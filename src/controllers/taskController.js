import Task from "../models/taskModel.js"

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll()
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.getById(req.params.id)
    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }
    res.status(200).json(task)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new task
export const createTask = async (req, res) => {
  try {
    // Validate request
    const { title, created_by } = req.body
    if (!title || !created_by) {
      return res.status(400).json({ message: "Title and created_by are required" })
    }

    const newTask = await Task.create(req.body)
    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Update a task
export const updateTask = async (req, res) => {
  try {
    const updated = await Task.update(req.params.id, req.body)
    if (!updated) {
      return res.status(404).json({ message: "Task not found" })
    }
    res.status(200).json({ message: "Task updated successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" })
    }
    res.status(200).json({ message: "Task deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get tasks by user ID
export const getTasksByUserId = async (req, res) => {
  try {
    const tasks = await Task.getByUserId(req.params.userId)
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
