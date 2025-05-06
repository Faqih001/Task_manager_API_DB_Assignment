import express from "express"
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js"

const router = express.Router()

// GET all users
router.get("/", getAllUsers)

// GET user by ID
router.get("/:id", getUserById)

// POST create a new user
router.post("/", createUser)

// PUT update a user
router.put("/:id", updateUser)

// DELETE a user
router.delete("/:id", deleteUser)

export default router
