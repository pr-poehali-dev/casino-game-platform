import json
import os
import hashlib
import uuid
from datetime import datetime, timedelta
import psycopg2

def get_db():
    """Подключение к БД"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
        'Content-Type': 'application/json'
    }

def handler(event, context):
    """Авторизация: регистрация, вход, проверка сессии"""

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers(), 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters', {}) or {}
    action = params.get('action', '')
    headers = cors_headers()

    if method == 'POST' and action == 'register':
        return register(event, headers)
    elif method == 'POST' and action == 'login':
        return login(event, headers)
    elif method == 'GET' and action == 'me':
        return get_me(event, headers)
    elif method == 'POST' and action == 'logout':
        return logout(event, headers)
    else:
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({'status': 'ok', 'actions': ['register', 'login', 'me', 'logout']})
        }

def register(event, headers):
    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '').strip()
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not name or not email or not password:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполни все поля'})}
    if len(password) < 4:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Пароль минимум 4 символа'})}
    if len(name) < 2:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Имя минимум 2 символа'})}

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = '%s'" % email.replace("'", "''"))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Email уже зарегистрирован'})}

    pw_hash = hash_password(password)
    cur.execute(
        "INSERT INTO users (name, email, password_hash, balance) VALUES ('%s', '%s', '%s', 1000) RETURNING id"
        % (name.replace("'", "''"), email.replace("'", "''"), pw_hash)
    )
    user_id = cur.fetchone()[0]

    token = str(uuid.uuid4())
    expires = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
    cur.execute(
        "INSERT INTO sessions (user_id, token, expires_at) VALUES (%d, '%s', '%s')"
        % (user_id, token, expires)
    )
    conn.commit()

    cur.execute("SELECT id, name, email, avatar, balance, level, xp, xp_max, total_won, total_games, win_streak, subscription, created_at FROM users WHERE id = %d" % user_id)
    row = cur.fetchone()
    cur.close()
    conn.close()

    user = format_user(row)
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'token': token, 'user': user})
    }

def login(event, headers):
    body = json.loads(event.get('body', '{}'))
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not email or not password:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'Заполни все поля'})}

    conn = get_db()
    cur = conn.cursor()

    pw_hash = hash_password(password)
    cur.execute(
        "SELECT id, name, email, avatar, balance, level, xp, xp_max, total_won, total_games, win_streak, subscription, created_at FROM users WHERE email = '%s' AND password_hash = '%s'"
        % (email.replace("'", "''"), pw_hash)
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Неверный email или пароль'})}

    token = str(uuid.uuid4())
    expires = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
    cur.execute(
        "INSERT INTO sessions (user_id, token, expires_at) VALUES (%d, '%s', '%s')"
        % (row[0], token, expires)
    )
    conn.commit()
    cur.close()
    conn.close()

    user = format_user(row)
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps({'token': token, 'user': user})
    }

def get_me(event, headers):
    token = extract_token(event)
    if not token:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Не авторизован'})}

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT u.id, u.name, u.email, u.avatar, u.balance, u.level, u.xp, u.xp_max, u.total_won, u.total_games, u.win_streak, u.subscription, u.created_at FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = '%s' AND s.expires_at > NOW()"
        % token.replace("'", "''")
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {'statusCode': 401, 'headers': headers, 'body': json.dumps({'error': 'Сессия истекла'})}

    user = format_user(row)
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'user': user})}

def logout(event, headers):
    token = extract_token(event)
    if token:
        conn = get_db()
        cur = conn.cursor()
        cur.execute("UPDATE sessions SET expires_at = NOW() WHERE token = '%s'" % token.replace("'", "''"))
        conn.commit()
        cur.close()
        conn.close()

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

def extract_token(event):
    hdrs = event.get('headers', {})
    auth = hdrs.get('X-Authorization', hdrs.get('x-authorization', hdrs.get('Authorization', '')))
    if auth.startswith('Bearer '):
        return auth[7:]
    return auth

def format_user(row):
    return {
        'id': str(row[0]),
        'name': row[1],
        'email': row[2],
        'avatar': row[3],
        'balance': row[4],
        'level': row[5],
        'xp': row[6],
        'xpMax': row[7],
        'totalWon': row[8],
        'totalGames': row[9],
        'winStreak': row[10],
        'subscription': row[11],
        'joinDate': row[12].strftime('%Y-%m-%d') if row[12] else '2026-01-01',
        'achievements': []
    }