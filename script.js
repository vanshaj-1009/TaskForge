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


}



// Initialize the application
document.addEventListener("DOMContentLoaded",()=>{new TaskForge()})
