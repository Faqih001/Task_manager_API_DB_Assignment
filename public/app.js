// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// ========== USERS MODULE ==========
const userForm = document.getElementById('userForm');
const usersTableBody = document.getElementById('usersTableBody');
const userFormTitle = document.getElementById('userFormTitle');
const saveUserBtn = document.getElementById('saveUserBtn');
const cancelUserBtn = document.getElementById('cancelUserBtn');
const passwordHelpBlock = document.getElementById('passwordHelpBlock');
const userIdField = document.getElementById('userId');
const usernameField = document.getElementById('username');
const emailField = document.getElementById('email');
const passwordField = document.getElementById('password');

let isEditingUser = false;

// Fetch all users
async function fetchUsers() {
  try {
    usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Loading users...</td></tr>';
    
    const response = await fetch(`${API_BASE_URL}/users`);
    const users = await response.json();
    
    if (users.length === 0) {
      usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
      return;
    }
    
    usersTableBody.innerHTML = '';
    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${new Date(user.created_at).toLocaleString()}</td>
        <td class="text-end action-buttons">
          <button class="btn btn-sm btn-outline-primary edit-user-btn" data-id="${user.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-user-btn" data-id="${user.id}">Delete</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-user-btn').forEach(button => {
      button.addEventListener('click', () => editUser(users.find(u => u.id == button.dataset.id)));
    });
    
    document.querySelectorAll('.delete-user-btn').forEach(button => {
      button.addEventListener('click', () => deleteUser(button.dataset.id));
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading users</td></tr>';
  }
}

// Create a new user
async function createUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      resetUserForm();
      fetchUsers();
      return true;
    } else {
      const error = await response.json();
      alert(`Error creating user: ${error.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error creating user:', error);
    alert('Error creating user. Check console for details.');
    return false;
  }
}

// Update an existing user
async function updateUser(id, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (response.ok) {
      resetUserForm();
      fetchUsers();
      return true;
    } else {
      const error = await response.json();
      alert(`Error updating user: ${error.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    alert('Error updating user. Check console for details.');
    return false;
  }
}

// Delete a user
async function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchUsers();
      } else {
        const error = await response.json();
        alert(`Error deleting user: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Check console for details.');
    }
  }
}

// Set form for editing
function editUser(user) {
  userIdField.value = user.id;
  usernameField.value = user.username;
  emailField.value = user.email;
  passwordField.value = '';
  passwordField.required = false;
  passwordHelpBlock.classList.remove('d-none');
  
  userFormTitle.textContent = 'Edit User';
  saveUserBtn.textContent = 'Update User';
  cancelUserBtn.classList.remove('d-none');
  isEditingUser = true;
}

// Reset user form
function resetUserForm() {
  userForm.reset();
  userIdField.value = '';
  passwordField.required = true;
  passwordHelpBlock.classList.add('d-none');
  
  userFormTitle.textContent = 'Add New User';
  saveUserBtn.textContent = 'Create User';
  cancelUserBtn.classList.add('d-none');
  isEditingUser = false;
}

// Initialize users module
function initUsersModule() {
  // Form submission handler
  userForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userData = {
      username: usernameField.value,
      email: emailField.value
    };
    
    if (passwordField.value) {
      userData.password = passwordField.value;
    }
    
    if (isEditingUser) {
      await updateUser(userIdField.value, userData);
    } else {
      await createUser(userData);
    }
  });
  
  // Cancel button handler
  cancelUserBtn.addEventListener('click', resetUserForm);
  
  // Initial users load
  fetchUsers();
}

// ========== TASKS MODULE ==========
const taskForm = document.getElementById('taskForm');
const tasksTableBody = document.getElementById('tasksTableBody');
const taskFormTitle = document.getElementById('taskFormTitle');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const taskIdField = document.getElementById('taskId');
const taskTitleField = document.getElementById('taskTitle');
const taskDescriptionField = document.getElementById('taskDescription');
const taskStatusField = document.getElementById('taskStatus');
const taskPriorityField = document.getElementById('taskPriority');
const taskDueDateField = document.getElementById('taskDueDate');
const taskCategoryField = document.getElementById('taskCategory');
const taskCreatedByField = document.getElementById('taskCreatedBy');

let isEditingTask = false;
let categoriesCache = [];
let usersCache = [];

// Fetch all tasks
async function fetchTasks() {
  try {
    tasksTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Loading tasks...</td></tr>';
    
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const tasks = await response.json();
    
    if (tasks.length === 0) {
      tasksTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No tasks found</td></tr>';
      return;
    }
    
    tasksTableBody.innerHTML = '';
    tasks.forEach(task => {
      const category = categoriesCache.find(c => c.id === task.category_id);
      const user = usersCache.find(u => u.id === task.created_by);
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.id}</td>
        <td>${task.title}</td>
        <td><span class="badge ${getStatusBadgeClass(task.status)}">${task.status}</span></td>
        <td><span class="badge ${getPriorityBadgeClass(task.priority)}">${task.priority}</span></td>
        <td>${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</td>
        <td>${category ? category.name : 'N/A'}</td>
        <td class="text-end action-buttons">
          <button class="btn btn-sm btn-outline-primary edit-task-btn" data-id="${task.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-task-btn" data-id="${task.id}">Delete</button>
        </td>
      `;
      tasksTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-task-btn').forEach(button => {
      button.addEventListener('click', () => editTask(tasks.find(t => t.id == button.dataset.id)));
    });
    
    document.querySelectorAll('.delete-task-btn').forEach(button => {
      button.addEventListener('click', () => deleteTask(button.dataset.id));
    });
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    tasksTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading tasks</td></tr>';
  }
}

// Get status badge class
function getStatusBadgeClass(status) {
  switch (status) {
    case 'pending': return 'bg-secondary';
    case 'in_progress': return 'bg-primary';
    case 'completed': return 'bg-success';
    case 'cancelled': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

// Get priority badge class
function getPriorityBadgeClass(priority) {
  switch (priority) {
    case 'low': return 'bg-info';
    case 'medium': return 'bg-warning';
    case 'high': return 'bg-danger';
    default: return 'bg-secondary';
  }
}

// Fetch categories for task form
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    categoriesCache = await response.json();
    
    // Populate category select
    taskCategoryField.innerHTML = '<option value="">None</option>';
    categoriesCache.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      taskCategoryField.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Fetch users for task form
async function fetchTaskUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    usersCache = await response.json();
    
    // Populate user select
    taskCreatedByField.innerHTML = '';
    usersCache.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.username;
      taskCreatedByField.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

// Create a new task
async function createTask(taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (response.ok) {
      resetTaskForm();
      fetchTasks();
      return true;
    } else {
      const error = await response.json();
      alert(`Error creating task: ${error.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error creating task:', error);
    alert('Error creating task. Check console for details.');
    return false;
  }
}

// Update an existing task
async function updateTask(id, taskData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    
    if (response.ok) {
      resetTaskForm();
      fetchTasks();
      return true;
    } else {
      const error = await response.json();
      alert(`Error updating task: ${error.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Error updating task. Check console for details.');
    return false;
  }
}

// Delete a task
async function deleteTask(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTasks();
      } else {
        const error = await response.json();
        alert(`Error deleting task: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. Check console for details.');
    }
  }
}

// Set form for editing
function editTask(task) {
  taskIdField.value = task.id;
  taskTitleField.value = task.title;
  taskDescriptionField.value = task.description || '';
  taskStatusField.value = task.status;
  taskPriorityField.value = task.priority;
  taskDueDateField.value = task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '';
  taskCategoryField.value = task.category_id || '';
  taskCreatedByField.value = task.created_by;
  
  // Disable created_by field when editing
  taskCreatedByField.disabled = true;
  
  taskFormTitle.textContent = 'Edit Task';
  saveTaskBtn.textContent = 'Update Task';
  cancelTaskBtn.classList.remove('d-none');
  isEditingTask = true;
}

// Reset task form
function resetTaskForm() {
  taskForm.reset();
  taskIdField.value = '';
  
  // Enable created_by field for new tasks
  taskCreatedByField.disabled = false;
  
  taskFormTitle.textContent = 'Add New Task';
  saveTaskBtn.textContent = 'Create Task';
  cancelTaskBtn.classList.add('d-none');
  isEditingTask = false;
}

// Initialize tasks module
function initTasksModule() {
  // Form submission handler
  taskForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const taskData = {
      title: taskTitleField.value,
      description: taskDescriptionField.value,
      status: taskStatusField.value,
      priority: taskPriorityField.value,
      due_date: taskDueDateField.value || null,
      category_id: taskCategoryField.value || null
    };
    
    if (!isEditingTask) {
      taskData.created_by = taskCreatedByField.value;
    }
    
    if (isEditingTask) {
      await updateTask(taskIdField.value, taskData);
    } else {
      await createTask(taskData);
    }
  });
  
  // Cancel button handler
  cancelTaskBtn.addEventListener('click', resetTaskForm);
  
  // Initial data load
  fetchCategories();
  fetchTaskUsers();
  fetchTasks();
}

// ========== CATEGORIES MODULE ==========
const categoryForm = document.getElementById('categoryForm');
const categoriesTableBody = document.getElementById('categoriesTableBody');
const categoryFormTitle = document.getElementById('categoryFormTitle');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
const categoryIdField = document.getElementById('categoryId');
const categoryNameField = document.getElementById('categoryName');
const categoryDescriptionField = document.getElementById('categoryDescription');

let isEditingCategory = false;

// Fetch all categories
async function fetchCategoriesList() {
  try {
    categoriesTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Loading categories...</td></tr>';
    
    const response = await fetch(`${API_BASE_URL}/categories`);
    const categories = await response.json();
    
    if (categories.length === 0) {
      categoriesTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No categories found</td></tr>';
      return;
    }
    
    categoriesTableBody.innerHTML = '';
    categories.forEach(category => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>${category.description || 'N/A'}</td>
        <td>${new Date(category.created_at).toLocaleString()}</td>
        <td class="text-end action-buttons">
          <button class="btn btn-sm btn-outline-primary edit-category-btn" data-id="${category.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-category-btn" data-id="${category.id}">Delete</button>
        </td>
      `;
      categoriesTableBody.appendChild(row);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-category-btn').forEach(button => {
      button.addEventListener('click', () => editCategory(categories.find(c => c.id == button.dataset.id)));
    });
    
    document.querySelectorAll('.delete-category-btn').forEach(button => {
      button.addEventListener('click', () => deleteCategory(button.dataset.id));
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    categoriesTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading categories</td></tr>';
  }
}

// Create a new category
async function createCategory(categoryData) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    
    if (response.ok) {
      resetCategoryForm();
      fetchCategoriesList();
      fetchCategories(); // Update task dropdown
      return true;
    } else {
      const error = await response.json();
      alert(`Error creating category: ${error.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error creating category:', error);
    alert('Error creating category. Check console for details.');
    return false;
  }
}

// Update an existing category
async function updateCategory(id, categoryData) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData)
    });
    
    if (response.ok) {
      resetCategoryForm();
      fetchCategoriesList();
      fetchCategories(); // Update task dropdown
      return true;
    } else {
      const error = await response.json();
      alert(`Error updating category: ${error.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error updating category:', error);
    alert('Error updating category. Check console for details.');
    return false;
  }
}

// Delete a category
async function deleteCategory(id) {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchCategoriesList();
        fetchCategories(); // Update task dropdown
      } else {
        const error = await response.json();
        alert(`Error deleting category: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Check console for details.');
    }
  }
}

// Set form for editing
function editCategory(category) {
  categoryIdField.value = category.id;
  categoryNameField.value = category.name;
  categoryDescriptionField.value = category.description || '';
  
  categoryFormTitle.textContent = 'Edit Category';
  saveCategoryBtn.textContent = 'Update Category';
  cancelCategoryBtn.classList.remove('d-none');
  isEditingCategory = true;
}

// Reset category form
function resetCategoryForm() {
  categoryForm.reset();
  categoryIdField.value = '';
  
  categoryFormTitle.textContent = 'Add New Category';
  saveCategoryBtn.textContent = 'Create Category';
  cancelCategoryBtn.classList.add('d-none');
  isEditingCategory = false;
}

// Initialize categories module
function initCategoriesModule() {
  // Form submission handler
  categoryForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const categoryData = {
      name: categoryNameField.value,
      description: categoryDescriptionField.value
    };
    
    if (isEditingCategory) {
      await updateCategory(categoryIdField.value, categoryData);
    } else {
      await createCategory(categoryData);
    }
  });
  
  // Cancel button handler
  cancelCategoryBtn.addEventListener('click', resetCategoryForm);
  
  // Initial categories load
  fetchCategoriesList();
}

// ========== ASSIGNMENTS MODULE ==========
const assignmentForm = document.getElementById('assignmentForm');
const assignmentsTableBody = document.getElementById('assignmentsTableBody');
const assignmentTaskField = document.getElementById('assignmentTask');
const assignmentUserField = document.getElementById('assignmentUser');

// Fetch all assignments
async function fetchAssignments() {
  try {
    assignmentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">Loading assignments...</td></tr>';
    
    const response = await fetch(`${API_BASE_URL}/assignments`);
    const assignments = await response.json();
    
    if (assignments.length === 0) {
      assignmentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No assignments found</td></tr>';
      return;
    }
    
    assignmentsTableBody.innerHTML = '';
    assignments.forEach(assignment => {
      const task = categoriesCache.find(t => t.id === assignment.task_id) || { title: `Task #${assignment.task_id}` };
      const user = usersCache.find(u => u.id === assignment.user_id) || { username: `User #${assignment.user_id}` };
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${assignment.id}</td>
        <td>${task.title}</td>
        <td>${user.username}</td>
        <td>${new Date(assignment.assigned_at).toLocaleString()}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger delete-assignment-btn" 
            data-task-id="${assignment.task_id}" 
            data-user-id="${assignment.user_id}">Unassign</button>
        </td>
      `;
      assignmentsTableBody.appendChild(row);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-assignment-btn').forEach(button => {
      button.addEventListener('click', () => deleteAssignment(
        button.dataset.taskId, 
        button.dataset.userId
      ));
    });
    
  } catch (error) {
    console.error('Error fetching assignments:', error);
    assignmentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading assignments</td></tr>';
  }
}

// Fetch tasks for assignment form
async function fetchAssignmentTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    const tasks = await response.json();
    
    // Populate task select
    assignmentTaskField.innerHTML = '<option value="">Select a task</option>';
    tasks.forEach(task => {
      const option = document.createElement('option');
      option.value = task.id;
      option.textContent = task.title;
      assignmentTaskField.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching tasks for assignments:', error);
  }
}

// Fetch users for assignment form
async function fetchAssignmentUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const users = await response.json();
    
    // Populate user select
    assignmentUserField.innerHTML = '<option value="">Select a user</option>';
    users.forEach(user => {
      const option = document.createElement('option');
      option.value = user.id;
      option.textContent = user.username;
      assignmentUserField.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching users for assignments:', error);
  }
}

// Create a new assignment
async function createAssignment(assignmentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignmentData)
    });
    
    if (response.ok) {
      assignmentForm.reset();
      fetchAssignments();
      return true;
    } else {
      const error = await response.json();
      alert(`Error creating assignment: ${error.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.error('Error creating assignment:', error);
    alert('Error creating assignment. Check console for details.');
    return false;
  }
}

// Delete an assignment
async function deleteAssignment(taskId, userId) {
  if (confirm('Are you sure you want to remove this assignment?')) {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${taskId}/${userId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchAssignments();
      } else {
        const error = await response.json();
        alert(`Error deleting assignment: ${error.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting assignment:', error);
      alert('Error deleting assignment. Check console for details.');
    }
  }
}

// Initialize assignments module
function initAssignmentsModule() {
  // Form submission handler
  assignmentForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const assignmentData = {
      task_id: parseInt(assignmentTaskField.value),
      user_id: parseInt(assignmentUserField.value)
    };
    
    await createAssignment(assignmentData);
  });
  
  // Initial data load
  fetchAssignmentTasks();
  fetchAssignmentUsers();
  fetchAssignments();
}

// ========== INITIALIZE APPLICATION ==========
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all modules
  initUsersModule();
  initTasksModule();
  initCategoriesModule();
  initAssignmentsModule();
  
  // Tab switching to refresh data
  document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(event) {
      const targetId = event.target.getAttribute('data-bs-target');
      
      if (targetId === '#users') {
        fetchUsers();
      } else if (targetId === '#tasks') {
        fetchTasks();
      } else if (targetId === '#categories') {
        fetchCategoriesList();
      } else if (targetId === '#assignments') {
        fetchAssignments();
      }
    });
  });
});