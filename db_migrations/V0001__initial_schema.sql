
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar VARCHAR(10) DEFAULT '🚀',
    balance INTEGER DEFAULT 1000,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    xp_max INTEGER DEFAULT 1000,
    total_won INTEGER DEFAULT 0,
    total_games INTEGER DEFAULT 0,
    win_streak INTEGER DEFAULT 0,
    subscription VARCHAR(20) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE loto_draws (
    id SERIAL PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'active',
    ticket_price INTEGER DEFAULT 100,
    prize_1 INTEGER DEFAULT 10000,
    prize_2 INTEGER DEFAULT 5000,
    prize_3 INTEGER DEFAULT 1000,
    winners_found INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    finished_at TIMESTAMP
);

CREATE TABLE loto_tickets (
    id SERIAL PRIMARY KEY,
    draw_id INTEGER NOT NULL REFERENCES loto_draws(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    ticket_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    prize_place INTEGER,
    prize_amount INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE loto_draw_log (
    id SERIAL PRIMARY KEY,
    draw_id INTEGER NOT NULL REFERENCES loto_draws(id),
    place INTEGER NOT NULL,
    ticket_id INTEGER NOT NULL REFERENCES loto_tickets(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    prize_amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO loto_draws (status, ticket_price, prize_1, prize_2, prize_3) VALUES ('active', 100, 10000, 5000, 1000);

CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_loto_tickets_draw ON loto_tickets(draw_id);
CREATE INDEX idx_loto_tickets_user ON loto_tickets(user_id);
CREATE INDEX idx_loto_draws_status ON loto_draws(status);
