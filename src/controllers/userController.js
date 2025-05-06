import User from "../models/userModel.js"

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new user
export const createUser = async (req, res) => {
  try {
    // Validate request
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" })
    }

    const newUser = await User.create(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    // Check for duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username or email already exists" })
    }
    res.status(500).json({ message: error.message })
  }
}

// Update a user
export const updateUser = async (req, res) => {
  try {
    const updated = await User.update(req.params.id, req.body)
    if (!updated) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "User updated successfully" })
  } catch (error) {
    // Check for duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username or email already exists" })
    }
    res.status(500).json({ message: error.message })
  }
}

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
