import db from "../config/db.js"

class Category {
  // Get all categories
  static async getAll() {
    try {
      const [rows] = await db.query("SELECT * FROM categories ORDER BY name")
      return rows
    } catch (error) {
      throw error
    }
  }

  // Get category by ID
  static async getById(id) {
    try {
      const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [id])
      return rows[0]
    } catch (error) {
      throw error
    }
  }

  // Create a new category
  static async create(categoryData) {
    try {
      const { name, description } = categoryData

      const [result] = await db.query("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description])

      return { id: result.insertId, name, description }
    } catch (error) {
      throw error
    }
  }

  // Update a category
  static async update(id, categoryData) {
    try {
      const { name, description } = categoryData

      let query = "UPDATE categories SET "
      const values = []

      if (name) {
        query += "name = ?, "
        values.push(name)
      }

      if (description !== undefined) {
        query += "description = ?, "
        values.push(description)
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

  // Delete a category
  static async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id])
      return result.affectedRows > 0
    } catch (error) {
      throw error
    }
  }

  // Get tasks by category ID
  static async getTasks(categoryId) {
    try {
      const [rows] = await db.query(
        `
        SELECT t.*, u.username as creator_name
        FROM tasks t
        JOIN users u ON t.created_by = u.id
        WHERE t.category_id = ?
        ORDER BY t.created_at DESC
      `,
        [categoryId],
      )

      return rows
    } catch (error) {
      throw error
    }
  }
}

export default Category
