"use client"

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

// Define interfaces for data types
interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  created_at: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  category_id?: number;
  created_by: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

interface Assignment {
  id: number;
  task_id: number;
  user_id: number;
  assigned_at: string;
}

export default function TaskManagerUI() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Task Manager API UI</h1>
      
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksTab />
        </TabsContent>
        
        <TabsContent value="categories">
          <CategoriesTab />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentsTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Users Tab Component
function UsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [formData, setFormData] = useState<{
    id: string | number;
    username: string;
    email: string;
    password: string;
  }>({
    id: '',
    username: '',
    email: '',
    password: ''
  })
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Fetch all users
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Create a new user
  const createUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })
      
      if (response.ok) {
        setFormData({ id: '', username: '', email: '', password: '' })
        window.location.reload() // Reload page after successful operation
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  // Set form data for editing
  const editUser = (user: User) => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      password: ''
    })
    setIsEditing(true)
  }

  // Update an existing user
  const updateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/api/users/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          ...(formData.password && { password: formData.password })
        })
      })
      
      if (response.ok) {
        setFormData({ id: '', username: '', email: '', password: '' })
        setIsEditing(false)
        window.location.reload() // Reload page after successful operation
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  // Delete a user
  const deleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          window.location.reload() // Reload page after successful operation
        }
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit User' : 'Add New User'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isEditing ? updateUser : createUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password {isEditing && '(leave blank to keep current)'}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required={!isEditing}
              />
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setFormData({ id: '', username: '', email: '', password: '' })
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Username</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Created At</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.username}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{new Date(user.created_at).toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editUser(user)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive" 
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Tasks Tab Component
function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [formData, setFormData] = useState<{
    id: string | number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    category_id: string;
    created_by: string;
  }>({
    id: '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    category_id: '',
    created_by: ''
  })
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Fetch data on component mount
  useEffect(() => {
    fetchTasks()
    fetchCategories()
    fetchUsers()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Create a new task
  const createTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date || null,
          category_id: formData.category_id || null,
          created_by: formData.created_by
        })
      })
      
      if (response.ok) {
        setFormData({
          id: '',
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          due_date: '',
          category_id: '',
          created_by: ''
        })
        window.location.reload() // Reload page after successful operation
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  // Set form data for editing
  const editTask = (task: Task) => {
    setFormData({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      category_id: task.category_id?.toString() || '',
      created_by: task.created_by.toString()
    })
    setIsEditing(true)
  }

  // Update an existing task
  const updateTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          due_date: formData.due_date || null,
          category_id: formData.category_id || null
        })
      })
      
      if (response.ok) {
        setFormData({
          id: '',
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          due_date: '',
          category_id: '',
          created_by: ''
        })
        setIsEditing(false)
        window.location.reload() // Reload page after successful operation
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  // Delete a task
  const deleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          window.location.reload() // Reload page after successful operation
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Task' : 'Add New Task'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isEditing ? updateTask : createTask} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => handleSelectChange('category_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="created_by">Created By</Label>
                <Select 
                  value={formData.created_by} 
                  onValueChange={(value) => handleSelectChange('created_by', value)}
                  disabled={isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setFormData({
                      id: '',
                      title: '',
                      description: '',
                      status: 'pending',
                      priority: 'medium',
                      due_date: '',
                      category_id: '',
                      created_by: ''
                    })
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Priority</th>
                    <th className="p-2 text-left">Due Date</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Created By</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-t">
                      <td className="p-2">{task.id}</td>
                      <td className="p-2">{task.title}</td>
                      <td className="p-2">{task.status}</td>
                      <td className="p-2">{task.priority}</td>
                      <td className="p-2">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</td>
                      <td className="p-2">
                        {categories.find(c => c.id === task.category_id)?.name || 'N/A'}
                      </td>
                      <td className="p-2">
                        {users.find(u => u.id === task.created_by)?.username || 'Unknown'}
                      </td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editTask(task)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive" 
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Categories Tab Component
function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [formData, setFormData] = useState<{
    id: string | number;
    name: string;
    description: string;
  }>({
    id: '',
    name: '',
    description: ''
  })
  const [isEditing, setIsEditing] = useState<boolean>(false)

  // Fetch all categories
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Create a new category
  const createCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description
        })
      })
      
      if (response.ok) {
        setFormData({ id: '', name: '', description: '' })
        window.location.reload() // Reload page after successful operation
      }
    } catch (error) {
      console.error('Error creating category:', error)
    }
  }

  // Set form data for editing
  const editCategory = (category: Category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || ''
    })
    setIsEditing(true)
  }

  // Update an existing category
  const updateCategory = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch(`http://localhost:3000/api/categories/${formData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description
        })
      })
      
      if (response.ok) {
        setFormData({ id: '', name: '', description: '' })
        setIsEditing(false)
        window.location.reload() // Reload page after successful operation
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  // Delete a category
  const deleteCategory = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          window.location.reload() // Reload page after successful operation
        }
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Category' : 'Add New Category'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={isEditing ? updateCategory : createCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setFormData({ id: '', name: '', description: '' })
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit">{isEditing ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage task categories</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading categories...</p>
          ) : categories.length === 0 ? (
            <p>No categories found</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Created At</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-t">
                      <td className="p-2">{category.id}</td>
                      <td className="p-2">{category.name}</td>
                      <td className="p-2">{category.description || 'N/A'}</td>
                      <td className="p-2">{new Date(category.created_at).toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => editCategory(category)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive" 
                          onClick={() => deleteCategory(category.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Assignments Tab Component
function AssignmentsTab() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [formData, setFormData] = useState<{
    task_id: string;
    user_id: string;
  }>({
    task_id: '',
    user_id: ''
  })

  // Fetch data on component mount
  useEffect(() => {
    fetchAssignments()
    fetchTasks()
    fetchUsers()
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:3000/api/assignments')
      const data = await response.json()
      setAssignments(data)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/tasks')
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Create a new assignment
  const createAssignment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: formData.task_id,
          user_id: formData.user_id
        })
      })
      
      if (response.ok) {
        setFormData({ task_id: '', user_id: '' })
        fetchAssignments()
      }
    } catch (error) {
      console.error('Error creating assignment:', error)
    }
  }

  // Delete an assignment
  const deleteAssignment = async (id: number) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/assignments/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          fetchAssignments()
        }
      } catch (error) {
        console.error('Error deleting assignment:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Task to User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createAssignment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task_id">Task</Label>
                <Select 
                  value={formData.task_id} 
                  onValueChange={(value) => handleSelectChange('task_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    {tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id.toString()}>
                        {task.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user_id">User</Label>
                <Select 
                  value={formData.user_id} 
                  onValueChange={(value) => handleSelectChange('user_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Assign</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task Assignments</CardTitle>
          <CardDescription>Manage task assignments</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading assignments...</p>
          ) : assignments.length === 0 ? (
            <p>No assignments found</p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Task</th>
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-left">Assigned At</th>
                    <th className="p-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-t">
                      <td className="p-2">{assignment.id}</td>
                      <td className="p-2">
                        {tasks.find(t => t.id === assignment.task_id)?.title || 'Unknown Task'}
                      </td>
                      <td className="p-2">
                        {users.find(u => u.id === assignment.user_id)?.username || 'Unknown User'}
                      </td>
                      <td className="p-2">{new Date(assignment.assigned_at).toLocaleString()}</td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive" 
                          onClick={() => deleteAssignment(assignment.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}