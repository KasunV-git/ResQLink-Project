-- ResQLink Database Schema

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) DEFAULT 'Volunteer',
  is_available BOOLEAN DEFAULT TRUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_skills (
  user_id INT,
  skill_id INT,
  PRIMARY KEY (user_id, skill_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  priority VARCHAR(20) NOT NULL, -- 'high', 'medium', 'low'
  message TEXT NOT NULL,
  source VARCHAR(255) NOT NULL,
  time VARCHAR(100) NOT NULL,
  target VARCHAR(100) DEFAULT 'For Volunteers',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  disaster VARCHAR(255) NOT NULL,
  task VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'assigned', -- 'assigned', 'in-progress', 'completed'
  assigned_date VARCHAR(50) NOT NULL,
  completed_date VARCHAR(50) NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
