import Category from "../models/categoryModel.js"

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.getAll()
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.getById(req.params.id)
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }
    res.status(200).json(category)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new category
export const createCategory = async (req, res) => {
  try {
    // Validate request
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ message: "Category name is required" })
    }

    const newCategory = await Category.create(req.body)
    res.status(201).json(newCategory)
  } catch (error) {
    // Check for duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Category name already exists" })
    }
    res.status(500).json({ message: error.message })
  }
}

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const updated = await Category.update(req.params.id, req.body)
    if (!updated) {
      return res.status(404).json({ message: "Category not found" })
    }
    res.status(200).json({ message: "Category updated successfully" })
  } catch (error) {
    // Check for duplicate entry error
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Category name already exists" })
    }
    res.status(500).json({ message: error.message })
  }
}

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" })
    }
    res.status(200).json({ message: "Category deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get tasks by category ID
export const getTasksByCategory = async (req, res) => {
  try {
    const tasks = await Category.getTasks(req.params.id)
    res.status(200).json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
