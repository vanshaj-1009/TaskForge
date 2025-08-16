// TaskForge - Task Management Application
class TaskForge {





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

    


    
}



// Initialize the application
document.addEventListener("DOMContentLoaded",()=>{new TaskForge()})
