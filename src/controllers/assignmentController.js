import TaskAssignment from "../models/assignmentModel.js"

// Get all assignments
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await TaskAssignment.getAll()
    res.status(200).json(assignments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get assignments by task ID
export const getAssignmentsByTaskId = async (req, res) => {
  try {
    const assignments = await TaskAssignment.getByTaskId(req.params.taskId)
    res.status(200).json(assignments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get assignments by user ID
export const getAssignmentsByUserId = async (req, res) => {
  try {
    const assignments = await TaskAssignment.getByUserId(req.params.userId)
    res.status(200).json(assignments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new assignment
export const createAssignment = async (req, res) => {
  try {
    // Validate request
    const { task_id, user_id } = req.body
    if (!task_id || !user_id) {
      return res.status(400).json({ message: "Task ID and User ID are required" })
    }

    const result = await TaskAssignment.create(req.body)

    if (result.error) {
      return res.status(409).json({ message: result.error })
    }

    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete an assignment
export const deleteAssignment = async (req, res) => {
  try {
    const { taskId, userId } = req.params

    if (!taskId || !userId) {
      return res.status(400).json({ message: "Task ID and User ID are required" })
    }

    const deleted = await TaskAssignment.delete(taskId, userId)

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" })
    }

    res.status(200).json({ message: "Assignment deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
