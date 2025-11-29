CREATE TABLE user(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE session(
  id VARCHAR(255) PRIMARY KEY,
  user_id INT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE player(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE game(
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  message VARCHAR(1000),
);

CREATE TABLE player_score(
  id SERIAL PRIMARY KEY,
  player_id INT NOT NULL,
  game_id INT NOT NULL,
  score INT NOT NULL,
  UNIQUE(player_id, game_id),
  FOREIGN KEY (player_id) REFERENCES player(id),
  FOREIGN KEY (game_id) REFERENCES game(id)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_player_score_game_id ON player_score(game_id);
CREATE INDEX idx_player_score_player_id ON player_score(player_id);
CREATE INDEX idx_player_is_active ON player(is_active);
CREATE INDEX idx_game_date ON game(date);
CREATE INDEX idx_player_score_player_game ON player_score(player_id, game_id);
