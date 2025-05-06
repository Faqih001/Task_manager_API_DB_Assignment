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

```
+------------------+                     +-------------------+                    +------------------+
|      users       |                     |       tasks       |                    |    categories    |
+------------------+                     +-------------------+                    +------------------+
| id (PK)          |                     | id (PK)           |                    | id (PK)          |
| username         |                     | title             |                    | name             |
| email            |                     | description       |                    | description      |
| password_hash    |                     | status            |                    | created_at       |
| created_at       |                     | priority          |                    | updated_at       |
| updated_at       |                     | due_date          |                    +------------------+
+------------------+                     | category_id (FK) -|------------------->|
        ^                                | created_by (FK) --|------------------->|
        |                                | created_at        |
        |                                | updated_at        |
        |                                +-------------------+
        |                                         ^
        |                                         |
        |                                         |
+-------------------------------+                 |
|     task_assignments          |                 |
+-------------------------------+                 |
| id (PK)                       |                 |
| task_id (FK) ----------------------------------->
| user_id (FK) ------------------+
| assigned_at                   |
+-------------------------------+
```

### Detailed Relationship Explanations

#### 1. Users and Tasks Relationship (One-to-Many)

- **Type**: One-to-Many
- **Implementation**: Foreign key `created_by` in the tasks table references `id` in the users table
- **Meaning**: Each user can create multiple tasks, but each task is created by exactly one user
- **Constraint**: ON DELETE CASCADE - When a user is deleted, all tasks created by that user are also deleted
- **Business Logic**: This relationship tracks task ownership and accountability

#### 2. Categories and Tasks Relationship (One-to-Many)

- **Type**: One-to-Many
- **Implementation**: Foreign key `category_id` in the tasks table references `id` in the categories table
- **Meaning**: Each category can be associated with multiple tasks, but each task belongs to at most one category
- **Constraint**: ON DELETE SET NULL - When a category is deleted, the category_id in associated tasks is set to NULL
- **Business Logic**: This allows for organizational grouping of related tasks

#### 3. Users and Tasks Assignment Relationship (Many-to-Many)

- **Type**: Many-to-Many
- **Implementation**: Junction table `task_assignments` with foreign keys to both users and tasks
- **Meaning**: Each user can be assigned to multiple tasks, and each task can be assigned to multiple users
- **Constraints**:
  - ON DELETE CASCADE for both relationships - When either a user or task is deleted, all related assignments are also deleted
  - UNIQUE constraint on the combination of task_id and user_id to prevent duplicate assignments
- **Business Logic**: This enables task delegation and team collaboration

#### 4. Database Integrity and Constraints

- **Unique Constraints**: Username and email must be unique in the users table; category names must be unique
- **Enumerated Types**: Task status is limited to 'pending', 'in_progress', 'completed', or 'cancelled'
- **Enumerated Types**: Task priority is limited to 'low', 'medium', or 'high'
- **Timestamps**: All tables include created_at timestamps; tables with updatable content include updated_at timestamps that automatically update
- **Cascading Actions**: The schema implements appropriate cascading actions to maintain referential integrity

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/task-manager-api.git
   cd task-manager-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   ```bash
   mysql -u root -ptest < schema.sql
   ```

4. Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=test
   DB_NAME=task_manager
   ```

5. Start the server:

   ```
   npm start
   ```

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

## Running the Project

After making updates, follow these steps to run the complete project:

### 1. Set up the Database

If you haven't already set up the database, run this command:

```bash
mysql -u root -p < schema.sql
```

Enter your MySQL password when prompted. This will create the database and necessary tables.

### 2. Start the API Server

Navigate to the project directory and start the Express API server:

```bash
# Navigate to project directory
cd /path/to/Task_manager_API_DB_Assignment

# Start the API server
npm run api
```

The API server will run on <http://localhost:3000/api>.

### 3. Start the Next.js Frontend

In a separate terminal, start the Next.js frontend:

```bash
# Navigate to project directory
cd /path/to/Task_manager_API_DB_Assignment

# Start the Next.js development server
npm run dev
```

The frontend will run on <http://localhost:3000> by default.

### 4. Access the Application

Open your browser and navigate to <http://localhost:3000> to access the Task Manager UI. From here you can:

- Manage users (create, view, edit, delete)
- Manage tasks (create, view, edit, delete)
- Manage categories (create, view, edit, delete)
- Manage task assignments (assign tasks to users, view assignments, delete assignments)

### Troubleshooting

If you encounter any issues:

1. **Database Connection Issues**: Verify your database credentials in the `.env` file
2. **Port Conflicts**: If port 3000 is already in use, you can modify the PORT in your `.env` file
3. **API Errors**: Check the terminal running your API server for error logs
4. **UI Not Showing Updates**: If the UI doesn't reflect database changes, refresh the page or check network requests for errors

## Technologies Used

- Node.js - JavaScript runtime
- Express - Web framework
- MySQL - Database
- mysql2 - MySQL client for Node.js
- bcrypt - Password hashing
- dotenv - Environment variable management
- cors - Cross-Origin Resource Sharing
