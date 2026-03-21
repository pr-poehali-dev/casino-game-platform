import json
import os
import random
import string
import psycopg2

def get_db():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
        'Content-Type': 'application/json'
    }

def extract_token(event):
    hdrs = event.get('headers', {})
    auth = hdrs.get('X-Authorization', hdrs.get('x-authorization', hdrs.get('Authorization', '')))
    if auth.startswith('Bearer '):
        return auth[7:]
    return auth

def get_user_by_token(cur, token):
    if not token:
        return None
    cur.execute(
        "SELECT u.id, u.balance FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = '%s' AND s.expires_at > NOW()"
        % token.replace("'", "''")
    )
    return cur.fetchone()

def gen_ticket_number():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def handler(event, context):
    """Лотерея: покупка билетов, розыгрыш, статус текущего тиража"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters', {}) or {}
    action = params.get('action', '')
    headers = cors_headers()

    if method == 'GET' and action == 'status':
        return get_status(event, headers)
    elif method == 'POST' and action == 'buy':
        return buy_ticket(event, headers)
    elif method == 'POST' and action == 'draw':
        return do_draw(event, headers)
    elif method == 'GET' and action == 'my-tickets':
        return my_tickets(event, headers)
    elif method == 'GET' and action == 'history':
        return draw_history(event, headers)
    else:
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'status': 'ok', 'service': 'loto'})
        }

def get_status(event, headers):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id, status, ticket_price, prize_1, prize_2, prize_3, winners_found, created_at, finished_at FROM loto_draws WHERE status = 'active' ORDER BY id DESC LIMIT 1")
    draw = cur.fetchone()

    if not draw:
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'draw': None, 'tickets_count': 0, 'winners': []})}

    draw_id = draw[0]

    cur.execute("SELECT COUNT(*) FROM loto_tickets WHERE draw_id = %d AND status = 'active'" % draw_id)
    tickets_count = cur.fetchone()[0]

    cur.execute("SELECT COUNT(*) FROM loto_tickets WHERE draw_id = %d" % draw_id)
    total_tickets = cur.fetchone()[0]

    cur.execute(
        "SELECT dl.place, dl.prize_amount, u.name, t.ticket_number FROM loto_draw_log dl JOIN users u ON dl.user_id = u.id JOIN loto_tickets t ON dl.ticket_id = t.id WHERE dl.draw_id = %d ORDER BY dl.place" % draw_id
    )
    winners = []
    for w in cur.fetchall():
        winners.append({'place': w[0], 'prize': w[1], 'name': w[2], 'ticket': w[3]})

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'draw': {
                'id': draw[0],
                'status': draw[1],
                'ticketPrice': draw[2],
                'prize1': draw[3],
                'prize2': draw[4],
                'prize3': draw[5],
                'winnersFound': draw[6],
                'createdAt': draw[7].strftime('%Y-%m-%d %H:%M') if draw[7] else None,
                'finishedAt': draw[8].strftime('%Y-%m-%d %H:%M') if draw[8] else None,
            },
            'ticketsCount': tickets_count,
            'totalTickets': total_tickets,
            'winners': winners
        })
    }

def buy_ticket(event, headers):
    token = extract_token(event)
    if not token:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Не авторизован'})}

    body = json.loads(event.get('body', '{}'))
    quantity = int(body.get('quantity', 1))
    if quantity < 1 or quantity > 10:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Можно купить от 1 до 10 билетов'})}

    conn = get_db()
    cur = conn.cursor()

    user = get_user_by_token(cur, token)
    if not user:
        cur.close()
        conn.close()
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Сессия истекла'})}

    user_id, balance = user

    cur.execute("SELECT id, ticket_price, status FROM loto_draws WHERE status = 'active' ORDER BY id DESC LIMIT 1")
    draw = cur.fetchone()
    if not draw:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет активного розыгрыша'})}

    draw_id, ticket_price, draw_status = draw
    total_cost = ticket_price * quantity

    if balance < total_cost:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Недостаточно D-COIN', 'need': total_cost, 'have': balance})}

    tickets = []
    for _ in range(quantity):
        ticket_num = gen_ticket_number()
        cur.execute(
            "INSERT INTO loto_tickets (draw_id, user_id, ticket_number) VALUES (%d, %d, '%s') RETURNING id, ticket_number"
            % (draw_id, user_id, ticket_num)
        )
        row = cur.fetchone()
        tickets.append({'id': row[0], 'number': row[1]})

    cur.execute("UPDATE users SET balance = balance - %d WHERE id = %d RETURNING balance" % (total_cost, user_id))
    new_balance = cur.fetchone()[0]

    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({
            'tickets': tickets,
            'cost': total_cost,
            'newBalance': new_balance
        })
    }

def do_draw(event, headers):
    """Провести один шаг розыгрыша — выбрать одного победителя из активных билетов"""
    token = extract_token(event)

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id, prize_1, prize_2, prize_3, winners_found, status FROM loto_draws WHERE status = 'active' ORDER BY id DESC LIMIT 1")
    draw = cur.fetchone()
    if not draw:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет активного розыгрыша'})}

    draw_id, prize_1, prize_2, prize_3, winners_found, status = draw
    prizes = [prize_1, prize_2, prize_3]

    if winners_found >= 3:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Все 3 приза уже разыграны'})}

    cur.execute("SELECT id, user_id, ticket_number FROM loto_tickets WHERE draw_id = %d AND status = 'active' ORDER BY RANDOM() LIMIT 1" % draw_id)
    winner_ticket = cur.fetchone()
    if not winner_ticket:
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Нет активных билетов для розыгрыша'})}

    ticket_id, winner_user_id, ticket_number = winner_ticket
    place = winners_found + 1
    prize_amount = prizes[place - 1]

    cur.execute("UPDATE loto_tickets SET status = 'won', prize_place = %d, prize_amount = %d WHERE id = %d" % (place, prize_amount, ticket_id))

    cur.execute("UPDATE users SET balance = balance + %d, total_won = total_won + %d WHERE id = %d" % (prize_amount, prize_amount, winner_user_id))

    cur.execute(
        "INSERT INTO loto_draw_log (draw_id, place, ticket_id, user_id, prize_amount) VALUES (%d, %d, %d, %d, %d)"
        % (draw_id, place, ticket_id, winner_user_id, prize_amount)
    )

    cur.execute("UPDATE loto_draws SET winners_found = %d WHERE id = %d" % (place, draw_id))

    if place >= 3:
        cur.execute("UPDATE loto_tickets SET status = 'cancelled' WHERE draw_id = %d AND status = 'active'" % draw_id)
        cur.execute("UPDATE loto_draws SET status = 'finished', finished_at = NOW() WHERE id = %d" % draw_id)

        cur.execute(
            "INSERT INTO loto_draws (status, ticket_price, prize_1, prize_2, prize_3) VALUES ('active', 100, 10000, 5000, 1000)"
        )

    conn.commit()

    cur.execute("SELECT name FROM users WHERE id = %d" % winner_user_id)
    winner_name = cur.fetchone()[0]

    result = {
        'place': place,
        'prize': prize_amount,
        'ticket': ticket_number,
        'winnerName': winner_name,
        'drawFinished': place >= 3
    }

    if place >= 3:
        cur.execute("SELECT COUNT(*) FROM loto_tickets WHERE draw_id = %d AND status = 'cancelled'" % draw_id)
        cancelled = cur.fetchone()[0]
        result['cancelledTickets'] = cancelled

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(result)
    }

def my_tickets(event, headers):
    token = extract_token(event)
    if not token:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Не авторизован'})}

    conn = get_db()
    cur = conn.cursor()

    user = get_user_by_token(cur, token)
    if not user:
        cur.close()
        conn.close()
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Сессия истекла'})}

    user_id = user[0]

    cur.execute("SELECT id FROM loto_draws WHERE status = 'active' ORDER BY id DESC LIMIT 1")
    draw = cur.fetchone()
    if not draw:
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'tickets': [], 'drawId': None})}

    draw_id = draw[0]

    cur.execute(
        "SELECT id, ticket_number, status, prize_place, prize_amount, created_at FROM loto_tickets WHERE draw_id = %d AND user_id = %d ORDER BY id"
        % (draw_id, user_id)
    )
    tickets = []
    for row in cur.fetchall():
        tickets.append({
            'id': row[0],
            'number': row[1],
            'status': row[2],
            'prizePlace': row[3],
            'prizeAmount': row[4],
            'createdAt': row[5].strftime('%H:%M %d.%m') if row[5] else None
        })

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'tickets': tickets, 'drawId': draw_id})
    }

def draw_history(event, headers):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, status, winners_found, created_at, finished_at FROM loto_draws WHERE status = 'finished' ORDER BY id DESC LIMIT 5"
    )
    draws = []
    for row in cur.fetchall():
        draw_id = row[0]
        cur.execute(
            "SELECT dl.place, dl.prize_amount, u.name FROM loto_draw_log dl JOIN users u ON dl.user_id = u.id WHERE dl.draw_id = %d ORDER BY dl.place" % draw_id
        )
        winners = []
        for w in cur.fetchall():
            winners.append({'place': w[0], 'prize': w[1], 'name': w[2]})

        draws.append({
            'id': draw_id,
            'winnersFound': row[2],
            'createdAt': row[3].strftime('%d.%m.%Y') if row[3] else None,
            'finishedAt': row[4].strftime('%d.%m.%Y %H:%M') if row[4] else None,
            'winners': winners
        })

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'draws': draws})
    }