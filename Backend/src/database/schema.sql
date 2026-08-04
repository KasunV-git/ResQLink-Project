-- ============================================================
--  ResQLink — Unified Production Schema
--  Engine: MySQL 8.0+   Charset: utf8mb4   Collation: utf8mb4_unicode_ci
-- ============================================================

-- ── users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT            NOT NULL AUTO_INCREMENT,
  username     VARCHAR(255)   DEFAULT NULL,
  name         VARCHAR(255)   DEFAULT NULL,
  first_name   VARCHAR(100)   DEFAULT NULL,
  last_name    VARCHAR(100)   DEFAULT NULL,
  email        VARCHAR(255)   DEFAULT NULL,
  phone        VARCHAR(50)    DEFAULT NULL,
  role         VARCHAR(50)    NOT NULL DEFAULT 'Volunteer',
  is_available TINYINT(1)     NOT NULL DEFAULT 1,
  avatar_url   VARCHAR(500)   DEFAULT NULL,
  password     VARCHAR(255)   NOT NULL,
  reset_code   VARCHAR(10)    DEFAULT NULL,
  reset_expires DATETIME      DEFAULT NULL,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username),
  INDEX idx_users_role (role),
  INDEX idx_users_avail (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── disasters ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS disasters (
  disaster_id           INT            NOT NULL AUTO_INCREMENT,
  type                  VARCHAR(255)   NOT NULL,
  location              VARCHAR(255)   NOT NULL,
  landmark              VARCHAR(255)   DEFAULT NULL,
  people_affected       VARCHAR(255)   DEFAULT NULL,
  lat                   DECIMAL(10, 7) DEFAULT NULL,
  lng                   DECIMAL(10, 7) DEFAULT NULL,
  description           TEXT           DEFAULT NULL,
  status                ENUM('active', 'resolved', 'pending') DEFAULT 'pending',
  severity_score        DECIMAL(5, 2)  DEFAULT 0.00,
  predictor_risk_level  ENUM('low', 'medium', 'high', 'critical') DEFAULT 'low',
  reported_by           INT            DEFAULT NULL,
  media_url             VARCHAR(500)   DEFAULT NULL,
  verification_status   ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  created_at            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (disaster_id),
  CONSTRAINT fk_disasters_user FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── skills ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id         INT           NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100)  NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_skills_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── user_skills (junction) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS user_skills (
  user_id     INT       NOT NULL,
  skill_id    INT       NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, skill_id),
  INDEX idx_user_skills_user_id (user_id),
  INDEX idx_user_skills_skill_id (skill_id),
  CONSTRAINT fk_us_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_us_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── alerts ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id          INT           NOT NULL AUTO_INCREMENT,
  priority    VARCHAR(20)   NOT NULL DEFAULT 'medium',
  message     TEXT          NOT NULL,
  source      VARCHAR(255)  NOT NULL,
  time        VARCHAR(100)  DEFAULT NULL,
  alert_time  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  target      VARCHAR(100)  NOT NULL DEFAULT 'For Volunteers',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_alerts_priority (priority),
  INDEX idx_alerts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── assignments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id             INT           NOT NULL AUTO_INCREMENT,
  user_id        INT           NOT NULL,
  disaster       VARCHAR(255)  NOT NULL,
  task           VARCHAR(255)  NOT NULL,
  location       VARCHAR(255)  NOT NULL,
  status         VARCHAR(50)   NOT NULL DEFAULT 'assigned',
  assigned_date  VARCHAR(50)   NOT NULL,
  completed_date VARCHAR(50)   DEFAULT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_asgn_user_id (user_id),
  INDEX idx_asgn_status (status),
  CONSTRAINT fk_asgn_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── schema migration tracking ─────────────────────────────────
CREATE TABLE IF NOT EXISTS _migrations (
  id       INT          NOT NULL AUTO_INCREMENT,
  name     VARCHAR(255) NOT NULL,
  run_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_migrations_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
