-- ============================================================
--  ResQLink — Production Schema (v2)
--  Engine: MySQL 8.0+   Charset: utf8mb4   Collation: utf8mb4_unicode_ci
-- ============================================================

-- ── users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           INT            NOT NULL AUTO_INCREMENT,
  first_name   VARCHAR(100)   NOT NULL,
  last_name    VARCHAR(100)   NOT NULL,
  email        VARCHAR(255)   NOT NULL,
  phone        VARCHAR(50)    DEFAULT NULL,
  role         ENUM('Volunteer','Citizen','Administrator')
                              NOT NULL DEFAULT 'Volunteer',
  is_available TINYINT(1)     NOT NULL DEFAULT 1,
  password     VARCHAR(255)   NOT NULL,
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email     (email),
  INDEX        idx_users_role   (role),
  INDEX        idx_users_avail  (is_available)
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
  INDEX idx_user_skills_user_id  (user_id),
  INDEX idx_user_skills_skill_id (skill_id),
  CONSTRAINT fk_us_user  FOREIGN KEY (user_id)
    REFERENCES users(id)  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_us_skill FOREIGN KEY (skill_id)
    REFERENCES skills(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── alerts ───────────────────────────────────────────────────
--  alert_time: proper DATETIME — replaces the old VARCHAR `time` column.
--  Ordering by priority uses ENUM declaration order (high=1, medium=2, low=3),
--  so ORDER BY priority ASC gives correct high → medium → low order.
CREATE TABLE IF NOT EXISTS alerts (
  id          INT           NOT NULL AUTO_INCREMENT,
  priority    ENUM('high','medium','low') NOT NULL DEFAULT 'medium',
  message     TEXT          NOT NULL,
  source      VARCHAR(255)  NOT NULL,
  alert_time  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  target      VARCHAR(100)  NOT NULL DEFAULT 'For Volunteers',
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                            ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_alerts_priority   (priority),
  INDEX idx_alerts_alert_time (alert_time),
  INDEX idx_alerts_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── assignments ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id             INT           NOT NULL AUTO_INCREMENT,
  user_id        INT           NOT NULL,
  disaster       VARCHAR(255)  NOT NULL,
  task           VARCHAR(255)  NOT NULL,
  location       VARCHAR(255)  NOT NULL,
  status         ENUM('assigned','in-progress','completed')
                               NOT NULL DEFAULT 'assigned',
  assigned_date  DATE          NOT NULL,
  completed_date DATE          DEFAULT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                               ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_asgn_user_id       (user_id),
  INDEX idx_asgn_status        (status),
  INDEX idx_asgn_assigned_date (assigned_date),
  CONSTRAINT fk_asgn_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── schema migration tracking ─────────────────────────────────
CREATE TABLE IF NOT EXISTS _migrations (
  id       INT          NOT NULL AUTO_INCREMENT,
  name     VARCHAR(255) NOT NULL,
  run_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_migrations_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
