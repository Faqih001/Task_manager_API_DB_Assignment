import db from "../config/db.js"
import bcrypt from "bcryptjs"

class User {
  // Get all users
  static async getAll() {
    try {
      const [rows] = await db.query("SELECT id, username, email, created_at, updated_at FROM users")
      return rows
    } catch (error) {
      throw error
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const [rows] = await db.query("SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?", [id])
      return rows[0]
    } catch (error) {
      throw error
    }
  }

  // Create a new user
  static async create(userData) {
    try {
      const { username, email, password } = userData
      const hashedPassword = await bcrypt.hash(password, 10)

      const [result] = await db.query("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", [
        username,
        email,
        hashedPassword,
      ])

      return { id: result.insertId, username, email }
    } catch (error) {
      throw error
    }
  }

  // Update a user
  static async update(id, userData) {
    try {
      const { username, email, password } = userData
      let query = "UPDATE users SET "
      const values = []

      if (username) {
        query += "username = ?, "
        values.push(username)
      }

      if (email) {
        query += "email = ?, "
        values.push(email)
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        query += "password_hash = ?, "
        values.push(hashedPassword)
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

  // Delete a user
  static async delete(id) {
    try {
      const [result] = await db.query("DELETE FROM users WHERE id = ?", [id])
      return result.affectedRows > 0
    } catch (error) {
      throw error
    }
  }
}

export default User
