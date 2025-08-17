// TaskForge - Task Management Application
class TaskForge {

    constructor() {
        this.currentUser = null
        this.tasks = []
        this.editingTaskId = null
        this.filters = {
        status: "all",
        priority: "all",
        sortBy: "date-desc",
        }

        this.demoTasks = []

        this.init()
    }

    init() {
        this.loadFromStorage()
        this.bindEvents()
        this.showApp()
    }

    // Storage Management
    loadFromStorage() {
        const userData = localStorage.getItem("taskforge_user")
        const tasksData = localStorage.getItem("taskforge_tasks")

        if (userData) {
        this.currentUser = JSON.parse(userData)
        }

        if (tasksData) {
        this.tasks = JSON.parse(tasksData)
        }
    }

    saveToStorage() {
        if (this.currentUser) {
        localStorage.setItem("taskforge_user", JSON.stringify(this.currentUser))
        }
        localStorage.setItem("taskforge_tasks", JSON.stringify(this.tasks))
    }

    // Authentication
    checkAuthState() {
        if (!this.currentUser) {
        this.tasks = []
        }
        this.showApp()
    }

    showAuthModal() {
        document.getElementById("authModal").classList.remove("hidden")
    }

    hideAuthModal() {
        document.getElementById("authModal").classList.add("hidden")
    }

    showApp() {
    document.getElementById("app").classList.remove("hidden")
    document.getElementById("authModal").classList.add("hidden")

    const userNameEl = document.getElementById("userName")
    const logoutBtn = document.getElementById("logoutBtn")
    const addTaskBtn = document.getElementById("addTaskBtn")

    if (this.currentUser) {
      userNameEl.textContent = this.currentUser.name
      logoutBtn.textContent = "Logout"
      addTaskBtn.textContent = "+ Add Task"
    } else {
      userNameEl.textContent = "Guest User"
      logoutBtn.textContent = "Sign In"
      addTaskBtn.textContent = "+ Sign In to Add Tasks"
    }

    this.renderTasks()
    }


    register(email, password, name) {
        // Simulate registration
        const user = {
        id: Date.now(),
        email,
        name,
        createdAt: new Date().toISOString(),
        }

        this.currentUser = user
        this.saveToStorage()
        this.showApp()
    }

    login(email, password) {
        // Simulate login - in real app, this would validate against a backend
        const user = {
        id: Date.now(),
        email,
        name: email.split("@")[0], // Use email prefix as name
        createdAt: new Date().toISOString(),
        }

        this.currentUser = user
        this.saveToStorage()
        this.showApp()
    }

    logout() {
        if (this.currentUser) {
        this.currentUser = null
        localStorage.removeItem("taskforge_user")
        localStorage.removeItem("taskforge_tasks")
        this.tasks = []
        this.showApp()
        } else {
        // If not logged in, show auth modal
        this.showAuthModal()
        }
    }

    // Task Management
    createTask(taskData) {
        if (!this.currentUser) {
        this.showAuthModal()
        return
        }

        const task = {
        id: Date.now(),
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: this.currentUser.id,
        }

        this.tasks.push(task)
        this.saveToStorage()
        this.renderTasks()
    }

    updateTask(taskId, taskData) {
        if (!this.currentUser) {
        this.showAuthModal()
        return
        }

        const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
        if (taskIndex !== -1) {
        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            ...taskData,
            updatedAt: new Date().toISOString(),
        }
        this.saveToStorage()
        this.renderTasks()
        }
    }

    deleteTask(taskId) {
        if (!this.currentUser) {
        this.showAuthModal()
        return
        }

        if (confirm("Are you sure you want to delete this task?")) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId)
        this.saveToStorage()
        this.renderTasks()
        }
    }




    // Task Rendering
    renderTasks() {
        const container = document.getElementById("tasksContainer")
        const emptyState = document.getElementById("emptyState")

        const filteredTasks = this.getFilteredTasks()

        if (filteredTasks.length === 0) {
        container.innerHTML = ""
        container.appendChild(emptyState)
        return
        }

        emptyState.remove()
        container.innerHTML = filteredTasks.map((task) => this.createTaskHTML(task)).join("")
    }

    getFilteredTasks() {
        let filtered = [...this.tasks]

        // Filter by status
        if (this.filters.status !== "all") {
        filtered = filtered.filter((task) => task.status === this.filters.status)
        }

        // Filter by priority
        if (this.filters.priority !== "all") {
        filtered = filtered.filter((task) => task.priority === this.filters.priority)
        }

        // Sort tasks
        filtered.sort((a, b) => {
        switch (this.filters.sortBy) {
            case "date-asc":
            return new Date(a.createdAt) - new Date(b.createdAt)
            case "date-desc":
            return new Date(b.createdAt) - new Date(a.createdAt)
            case "priority":
            const priorityOrder = { high: 3, medium: 2, low: 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
            case "status":
            const statusOrder = { pending: 1, "in-progress": 2, completed: 3 }
            return statusOrder[a.status] - statusOrder[b.status]
            default:
            return 0
        }
        })

        return filtered
    }

    createTaskHTML(task) {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"
        const dueDateText = task.dueDate ? this.formatDate(task.dueDate) : ""

        const showActions = this.currentUser || task.userId !== "demo"

        return `
                <div class="task-card" data-task-id="${task.id}">
                    <div class="task-header">
                        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                        ${
                        showActions
                            ? `
                        <div class="task-actions">
                            <button class="task-btn edit-task" title="Edit Task">✏️</button>
                            <button class="task-btn delete-task" title="Delete Task">🗑️</button>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ""}
                    <div class="task-meta">
                        <div class="task-badges">
                            <span class="badge badge-status-${task.status}">${task.status.replace("-", " ")}</span>
                            <span class="badge badge-priority-${task.priority}">${task.priority}</span>
                        </div>
                        ${dueDateText ? `<div class="task-due-date ${isOverdue ? "overdue" : ""}">Due: ${dueDateText}</div>` : ""}
                    </div>
                </div>
            `
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        })
    }
    escapeHtml(text) {
        const div = document.createElement("div")
        div.textContent = text
        return div.innerHTML
    }

    showLoading() {
        document.getElementById("loadingOverlay").classList.remove("hidden")
    }

    hideLoading() {
        document.getElementById("loadingOverlay").classList.add("hidden")
    }

    // Event Binding
    bindEvents() {
        // Auth Modal Events
        document.getElementById("closeModal").addEventListener("click", () => {
        this.hideAuthModal()
        })

        document.getElementById("authSwitchBtn").addEventListener("click", this.toggleAuthMode.bind(this))
        document.getElementById("authForm").addEventListener("submit", this.handleAuthSubmit.bind(this))

        // App Events
        document.getElementById("logoutBtn").addEventListener("click", this.logout.bind(this))
        document.getElementById("addTaskBtn").addEventListener("click", () => {
        if (this.currentUser) {
            this.showTaskModal()
        } else {
            this.showAuthModal()
        }
        })

        // Task Modal Events
        document.getElementById("closeTaskModal").addEventListener("click", this.hideTaskModal.bind(this))
        document.getElementById("cancelTask").addEventListener("click", this.hideTaskModal.bind(this))
        document.getElementById("taskForm").addEventListener("submit", this.handleTaskSubmit.bind(this))

        // Filter Events
        document.getElementById("statusFilter").addEventListener("change", this.handleFilterChange.bind(this))
        document.getElementById("priorityFilter").addEventListener("change", this.handleFilterChange.bind(this))
        document.getElementById("sortBy").addEventListener("change", this.handleFilterChange.bind(this))

        // Task Actions (Event Delegation)
        document.getElementById("tasksContainer").addEventListener("click", this.handleTaskAction.bind(this))

        // Modal Close on Outside Click
        document.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            if (e.target.id === "taskModal") {
            this.hideTaskModal()
            } else if (e.target.id === "authModal") {
            this.hideAuthModal()
            }
        }
        })
    }

    toggleAuthMode() {
        const isLogin = document.getElementById("authTitle").textContent.includes("Welcome")
        const title = document.getElementById("authTitle")
        const submitBtn = document.getElementById("authSubmit")
        const switchText = document.getElementById("authSwitchText")
        const switchBtn = document.getElementById("authSwitchBtn")
        const nameGroup = document.getElementById("nameGroup")

        if (isLogin) {
        // Switch to Register
        title.textContent = "Create Account"
        submitBtn.textContent = "Sign Up"
        switchText.textContent = "Already have an account?"
        switchBtn.textContent = "Sign In"
        nameGroup.style.display = "block"
        document.getElementById("name").required = true
        } else {
        // Switch to Login
        title.textContent = "Welcome to TaskForge"
        submitBtn.textContent = "Sign In"
        switchText.textContent = "Don't have an account?"
        switchBtn.textContent = "Sign Up"
        nameGroup.style.display = "none"
        document.getElementById("name").required = false
        }

        // Clear form
        document.getElementById("authForm").reset()
    }

    handleAuthSubmit(e) {
        e.preventDefault()

        const email = document.getElementById("email").value
        const password = document.getElementById("password").value
        const name = document.getElementById("name").value
        const isRegister = document.getElementById("authTitle").textContent.includes("Create")

        this.showLoading()

        // Simulate API call delay
        setTimeout(() => {
        if (isRegister) {
            this.register(email, password, name)
        } else {
            this.login(email, password)
        }
        this.hideLoading()
        }, 1000)
    }






    showTaskModal(task = null) {
        if (!this.currentUser) {
        this.showAuthModal()
        return
        }

        const modal = document.getElementById("taskModal")
        const title = document.getElementById("taskModalTitle")
        const form = document.getElementById("taskForm")

        if (task) {
        // Edit mode
        title.textContent = "Edit Task"
        document.getElementById("taskTitle").value = task.title
        document.getElementById("taskDescription").value = task.description || ""
        document.getElementById("taskPriority").value = task.priority
        document.getElementById("taskStatus").value = task.status
        document.getElementById("taskDueDate").value = task.dueDate || ""
        this.editingTaskId = task.id
        } else {
        // Add mode
        title.textContent = "Add New Task"
        form.reset()
        document.getElementById("taskPriority").value = "medium"
        document.getElementById("taskStatus").value = "pending"
        this.editingTaskId = null
        }

        modal.classList.remove("hidden")
        document.getElementById("taskTitle").focus()
    }

    hideTaskModal() {
        document.getElementById("taskModal").classList.add("hidden")
        document.getElementById("taskForm").reset()
        this.editingTaskId = null
    }

    handleTaskSubmit(e) {
        e.preventDefault()

        const taskData = {
        title: document.getElementById("taskTitle").value,
        description: document.getElementById("taskDescription").value,
        priority: document.getElementById("taskPriority").value,
        status: document.getElementById("taskStatus").value,
        dueDate: document.getElementById("taskDueDate").value,
        }

        if (this.editingTaskId) {
        this.updateTask(this.editingTaskId, taskData)
        } else {
        this.createTask(taskData)
        }

        this.hideTaskModal()
    }
    

    handleFilterChange(e) {
        const filterId = e.target.id
        const value = e.target.value

        switch (filterId) {
        case "statusFilter":
            this.filters.status = value
            break
        case "priorityFilter":
            this.filters.priority = value
            break
        case "sortBy":
            this.filters.sortBy = value
            break
        }

        this.renderTasks()
    }

    handleTaskAction(e) {
        const taskCard = e.target.closest(".task-card")
        if (!taskCard) return

        const taskId = Number.parseInt(taskCard.dataset.taskId)
        const task = this.tasks.find((t) => t.id === taskId)

        if (!this.currentUser) {
        this.showAuthModal()
        return
        }

        if (e.target.classList.contains("edit-task")) {
        this.showTaskModal(task)
        } else if (e.target.classList.contains("delete-task")) {
        this.deleteTask(taskId)
        }
    }

}



// Initialize the application
document.addEventListener("DOMContentLoaded",()=>{new TaskForge()})
