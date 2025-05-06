import express from "express"
import {
  getAllAssignments,
  getAssignmentsByTaskId,
  getAssignmentsByUserId,
  createAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js"

const router = express.Router()

// GET all assignments
router.get("/", getAllAssignments)

// GET assignments by task ID
router.get("/task/:taskId", getAssignmentsByTaskId)

// GET assignments by user ID
router.get("/user/:userId", getAssignmentsByUserId)

// POST create a new assignment
router.post("/", createAssignment)

// DELETE an assignment
router.delete("/:taskId/:userId", deleteAssignment)

export default router
