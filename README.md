# Task Manager API

A CRUD API for task management built with Node.js, Express, and MySQL.

## Project Description

This Task Manager API allows users to create, read, update, and delete tasks, users, categories, and task assignments. It provides a complete backend solution for a task management application.

## Database Schema

The database consists of four tables:

1. **users** - Stores user information
2. **categories** - Stores task categories
3. **tasks** - Stores task information with references to categories and users
4. **task_assignments** - Manages the many-to-many relationship between users and tasks

### Entity Relationship Diagram (ERD)

\`\`\`
+----------------+       +----------------+       +----------------+
|     users      |       |     tasks      |       |   categories   |
+----------------+       +----------------+       +----------------+
| id (PK)        |       | id (PK)        |       | id (PK)        |
| username       |       | title          |       | name           |
| email          |       | description    |       | description    |
| password_hash  |       | status         |       | created_at     |
| created_at     |       | priority       |       | updated_at     |
| updated_at     |       | due_date       |       +----------------+
+----------------+       | category_id(FK)|
        |                | created_by (FK)|
        |                | created_at     |
        |                | updated_at     |
        |                +----------------+
        |                        |
        |                        |
        v                        v
+-------------------------------+
|     task_assignments          |
+-------------------------------+
| id (PK)                       |
| task_id (FK)                  |
| user_id (FK)                  |
| assigned_at                   |
+-------------------------------+
\`\`\`

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/task-manager-api.git
   cd task-manager-api
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Set up the database:
   \`\`\`
   mysql -u root -ptest < schema.sql
   \`\`\`

4. Create a `.env` file in the root directory with the following content:
   \`\`\`
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=test
   DB_NAME=task_manager
   \`\`\`

5. Start the server:
   \`\`\`
   npm start
   \`\`\`

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/user/:userId` - Get tasks by user ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `GET /api/categories/:id/tasks` - Get tasks by category ID
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Task Assignments

- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/task/:taskId` - Get assignments by task ID
- `GET /api/assignments/user/:userId` - Get assignments by user ID
- `POST /api/assignments` - Create a new assignment
- `DELETE /api/assignments/:taskId/:userId` - Delete an assignment

## Technologies Used

- Node.js - JavaScript runtime
- Express - Web framework
- MySQL - Database
- mysql2 - MySQL client for Node.js
- bcrypt - Password hashing
- dotenv - Environment variable management
- cors - Cross-Origin Resource Sharing
