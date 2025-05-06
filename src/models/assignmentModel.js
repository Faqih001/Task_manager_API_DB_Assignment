import db from "../config/db.js"

class TaskAssignment {
  // Get all assignments
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT ta.*, t.title as task_title, u.username
        FROM task_assignments ta
        JOIN tasks t ON ta.task_id = t.id
        JOIN users u ON ta.user_id = u.id
        ORDER BY ta.assigned_at DESC
      `)
      return rows
    } catch (error) {
      throw error
    }
  }

  // Get assignments by task ID
  static async getByTaskId(taskId) {
    try {
      const [rows] = await db.query(
        `
        SELECT ta.*, u.id as user_id, u.username, u.email
        FROM task_assignments ta
        JOIN users u ON ta.user_id = u.id
        WHERE ta.task_id = ?
      `,
        [taskId],
      )
      return rows
    } catch (error) {
      throw error
    }
  }

  // Get assignments by user ID
  static async getByUserId(userId) {
    try {
      const [rows] = await db.query(
        `
        SELECT ta.*, t.id as task_id, t.title, t.status, t.priority, t.due_date
        FROM task_assignments ta
        JOIN tasks t ON ta.task_id = t.id
        WHERE ta.user_id = ?
      `,
        [userId],
      )
      return rows
    } catch (error) {
      throw error
    }
  }

  // Create a new assignment
  static async create(assignmentData) {
    try {
      const { task_id, user_id } = assignmentData

      // Check if assignment already exists
      const [existing] = await db.query("SELECT * FROM task_assignments WHERE task_id = ? AND user_id = ?", [
        task_id,
        user_id,
      ])

      if (existing.length > 0) {
        return { error: "Assignment already exists" }
      }

      const [result] = await db.query("INSERT INTO task_assignments (task_id, user_id) VALUES (?, ?)", [
        task_id,
        user_id,
      ])

      return { id: result.insertId, task_id, user_id }
    } catch (error) {
      throw error
    }
  }

  // Delete an assignment
  static async delete(taskId, userId) {
    try {
      const [result] = await db.query("DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?", [
        taskId,
        userId,
      ])
      return result.affectedRows > 0
    } catch (error) {
      throw error
    }
  }
}

export default TaskAssignment
