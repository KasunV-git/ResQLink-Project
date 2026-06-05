-- ResQLink Database Schema

CREATE TABLE IF NOT EXISTS users (
  id           INT          AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  phone        VARCHAR(50)  DEFAULT NULL,
  role         VARCHAR(50)  NOT NULL DEFAULT 'Volunteer',
  is_available TINYINT(1)   NOT NULL DEFAULT 1,
  password     VARCHAR(255) NOT NULL,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id   INT          AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_skills (
  user_id  INT NOT NULL,
  skill_id INT NOT NULL,
  PRIMARY KEY (user_id, skill_id),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  id         INT          AUTO_INCREMENT PRIMARY KEY,
  priority   VARCHAR(20)  NOT NULL,
  message    TEXT         NOT NULL,
  source     VARCHAR(255) NOT NULL,
  time       VARCHAR(100) NOT NULL,
  target     VARCHAR(100) NOT NULL DEFAULT 'For Volunteers',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
  id             INT          AUTO_INCREMENT PRIMARY KEY,
  user_id        INT          NOT NULL,
  disaster       VARCHAR(255) NOT NULL,
  task           VARCHAR(255) NOT NULL,
  location       VARCHAR(255) NOT NULL,
  status         VARCHAR(50)  NOT NULL DEFAULT 'assigned',
  assigned_date  DATE         NOT NULL,
  completed_date DATE         DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
