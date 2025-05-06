import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import assignmentRoutes from "./routes/assignmentRoutes.js"
import path from "path"
import { fileURLToPath } from "url"

// Get current file's directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "../public")))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/assignments", assignmentRoutes)

// Root API route
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the Task Manager API",
    endpoints: {
      users: "/api/users",
      tasks: "/api/tasks",
      categories: "/api/categories",
      assignments: "/api/assignments",
    },
  })
})

// Root route serves the HTML UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
