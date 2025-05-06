import express from "express"
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getTasksByCategory,
} from "../controllers/categoryController.js"

const router = express.Router()

// GET all categories
router.get("/", getAllCategories)

// GET category by ID
router.get("/:id", getCategoryById)

// GET tasks by category ID
router.get("/:id/tasks", getTasksByCategory)

// POST create a new category
router.post("/", createCategory)

// PUT update a category
router.put("/:id", updateCategory)

// DELETE a category
router.delete("/:id", deleteCategory)

export default router
