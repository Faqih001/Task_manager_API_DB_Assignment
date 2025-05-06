-- Drop database if exists and create a new one
DROP DATABASE IF EXISTS task_manager;
CREATE DATABASE task_manager;
USE task_manager;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  due_date DATE,
  category_id INT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Task assignments (many-to-many relationship between users and tasks)
CREATE TABLE task_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  user_id INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_assignment (task_id, user_id)
);

-- Insert some sample data
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@example.com', '$2b$10$rIC/UgPkTgIRhRhXOGYDzOiQs5Y36JjdawwOyFwP.fUP5SWkHwZ0W'), -- password: admin123
('john_doe', 'john@example.com', '$2b$10$rIC/UgPkTgIRhRhXOGYDzOiQs5Y36JjdawwOyFwP.fUP5SWkHwZ0W'), -- password: admin123
('jane_smith', 'jane@example.com', '$2b$10$rIC/UgPkTgIRhRhXOGYDzOiQs5Y36JjdawwOyFwP.fUP5SWkHwZ0W'); -- password: admin123

INSERT INTO categories (name, description) VALUES
('Work', 'Work-related tasks'),
('Personal', 'Personal tasks'),
('Study', 'Educational tasks');

INSERT INTO tasks (title, description, status, priority, due_date, category_id, created_by) VALUES
('Complete project proposal', 'Finish the proposal for the new client project', 'in_progress', 'high', '2023-12-15', 1, 1),
('Buy groceries', 'Get milk, eggs, and bread', 'pending', 'medium', '2023-12-10', 2, 2),
('Study for exam', 'Review chapters 5-8 for the upcoming test', 'pending', 'high', '2023-12-20', 3, 3);

INSERT INTO task_assignments (task_id, user_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 3);
