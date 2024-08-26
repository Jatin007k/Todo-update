// Run this function once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search');
    const addTaskButton = document.getElementById('add-task');

    // Load tasks from localStorage or start with an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Render the list of tasks
    function renderTasks(filteredTasks = tasks) {
        taskList.innerHTML = '';  // Clear existing tasks

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = task.completed ? 'completed' : '';
            li.innerHTML = `
                <span>${task.text}</span>
                <div class="buttons">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                    <button class="up-btn">Up</button>
                    <button class="down-btn">Down</button>
                    <button class="complete-btn">${task.completed ? 'Undo' : 'Done'}</button>
                </div>
            `;

            // Edit Task
            li.querySelector('.edit-btn').addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text);
                if (newText) {
                    task.text = newText;
                    saveTasks();
                    renderTasks();
                }
            });

            // Delete Task
            li.querySelector('.delete-btn').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            // Mark as Done/Undo
            li.querySelector('.complete-btn').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            // Move Task Up
            li.querySelector('.up-btn').addEventListener('click', () => {
                if (index > 0) {
                    [tasks[index - 1], tasks[index]] = [tasks[index], tasks[index - 1]];
                    saveTasks();
                    renderTasks();
                }
            });

            // Move Task Down
            li.querySelector('.down-btn').addEventListener('click', () => {
                if (index < tasks.length - 1) {
                    [tasks[index + 1], tasks[index]] = [tasks[index], tasks[index + 1]];
                    saveTasks();
                    renderTasks();
                }
            });

            taskList.appendChild(li);
        });
    }

    // Add Task
    addTaskButton.addEventListener('click', () => {
        const newTask = taskInput.value.trim();
        if (newTask) {
            tasks.push({ text: newTask, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = '';  // Clear input field after adding
        }
    });

    // Search Tasks
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
        renderTasks(filteredTasks);
    });

    // Initial rendering of tasks
    renderTasks();
});
