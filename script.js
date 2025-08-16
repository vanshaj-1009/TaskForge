// TaskForge - Task Management Application
class TaskForge {

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



    
}



// Initialize the application
document.addEventListener("DOMContentLoaded",()=>{new TaskForge()})
