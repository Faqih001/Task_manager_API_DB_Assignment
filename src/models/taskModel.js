import db from "../config/db.js"

class Task {
  // Get all tasks
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT t.*, c.name as category_name, u.username as creator_name
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN users u ON t.created_by = u.id
        ORDER BY t.created_at DESC
      `)
      return rows
    } catch (error) {
      throw error
    }
  }

  // Get task by ID
  static async getById(id) {
    try {
      const [rows] = await db.query(
        `
        SELECT t.*, c.name as category_name, u.username as creator_name
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN users u ON t.created_by = u.id
        WHERE t.id = ?
      `,
        [id],
      )

      if (rows.length === 0) return null

      // Get assigned users
      const [assignedUsers] = await db.query(
        `
        SELECT u.id, u.username, u.email
        FROM task_assignments ta
        JOIN users u ON ta.user_id = u.id
        WHERE ta.task_id = ?
      `,
        [id],
      )

      return { ...rows[0], assignedUsers }
    } catch (error) {
      throw error
    }
  }

  // Create a new task
  static async create(taskData) {
    try {
      const { title, description, status, priority, due_date, category_id, created_by } = taskData

      const [result] = await db.query(
        `INSERT INTO tasks 
         (title, description, status, priority, due_date, category_id, created_by) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, status, priority, due_date, category_id, created_by],
      )

      return { id: result.insertId, ...taskData }
    } catch (error) {
      throw error
    }
  }

  // Update a task
  static async update(id, taskData) {
    try {
      const { title, description, status, priority, due_date, category_id } = taskData

      let query = "UPDATE tasks SET "
      const values = []

      if (title) {
        query += "title = ?, "
        values.push(title)
      }

      if (description !== undefined) {
        query += "description = ?, "
        values.push(description)
      }

      if (status) {
        query += "status = ?, "
        values.push(status)
      }

      if (priority) {
        query += "priority = ?, "
        values.push(priority)
      }

      if (due_date) {
        query += "due_date = ?, "
        values.push(due_date)
      }

      if (category_id !== undefined) {
        query += "category_id = ?, "
        values.push(category_id)
      }

      // Remove trailing comma and space
      query = query.slice(0, -2)

      query += " WHERE id = ?"
      values.push(id)

      const [result] = await db.query(query, values)
      return result.affectedRows > 0
    } catch (error) {
      throw error
    }
  }

  // Delete a task
  static async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM tasks WHERE id = ?", [id])
      return result.affectedRows > 0
    } catch (error) {
      throw error
    }
  }

  // Get tasks by user ID (tasks created by or assigned to a user)
  static async getByUserId(userId) {
    try {
      const [rows] = await db.query(
        `
        SELECT DISTINCT t.*, c.name as category_name, u.username as creator_name
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        LEFT JOIN users u ON t.created_by = u.id
        LEFT JOIN task_assignments ta ON t.id = ta.task_id
        WHERE t.created_by = ? OR ta.user_id = ?
        ORDER BY t.created_at DESC
      `,
        [userId, userId],
      )

      return rows
    } catch (error) {
      throw error
    }
  }
}

export default Task
