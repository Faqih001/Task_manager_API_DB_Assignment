import express from "express"
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByUserId,
} from "../controllers/taskController.js"

const router = express.Router()

// GET all tasks
router.get("/", getAllTasks)

// GET task by ID
router.get("/:id", getTaskById)

// GET tasks by user ID
router.get("/user/:userId", getTasksByUserId)

// POST create a new task
router.post("/", createTask)

// PUT update a task
router.put("/:id", updateTask)

// DELETE a task
router.delete("/:id", deleteTask)

export default router
