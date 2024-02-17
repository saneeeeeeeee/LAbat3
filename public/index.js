document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        const taskId = taskForm.getAttribute('data-task-id');
        const method = taskId ? 'PUT' : 'POST';
        const url = taskId ? `/tasks/${taskId}` : '/tasks';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            const updatedTask = await response.json();

            if (taskId) {
                const existingTaskItem = taskList.querySelector(`[data-id="${taskId}"]`);
                existingTaskItem.querySelector('strong').textContent = updatedTask.title;
                existingTaskItem.textContent = `${updatedTask.description} ${updatedTask.completed ? '(Completed)' : ''}`;
                taskForm.removeAttribute('data-task-id');
            } else {
                const taskItem = document.createElement('li');
                taskItem.className = 'list-group-item';
                taskItem.dataset.id = updatedTask._id;
                taskItem.innerHTML = `
            <strong>${updatedTask.title}</strong>: ${updatedTask.description}
            <button type="button" class="btn btn-success btn-sm float-right update-btn" data-id="${updatedTask._id}">Update</button>
            <button type="button" class="btn btn-danger btn-sm float-right delete-btn" data-id="${updatedTask._id}">Delete</button>
          `;

                taskItem.querySelector('.update-btn').addEventListener('click', () => {
                    taskForm.setAttribute('data-task-id', updatedTask._id);
                    document.getElementById('title').value = updatedTask.title;
                    document.getElementById('description').value = updatedTask.description;
                });

                taskItem.querySelector('.delete-btn').addEventListener('click', async () => {
                    await fetch(`/tasks/${updatedTask._id}`, { method: 'DELETE' });
                    taskItem.remove();
                });

                taskList.appendChild(taskItem);
            }

            taskForm.reset();
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function fetchTasks() {
        try {
            const response = await fetch('/tasks');
            const tasks = await response.json();

            tasks.forEach((task) => {
                const taskItem = document.createElement('li');
                taskItem.className = 'list-group-item';
                taskItem.dataset.id = task._id;
                taskItem.innerHTML = `
            <strong>${task.title}</strong>: ${task.description}
            <button type="button" class="btn btn-success btn-sm float-right update-btn" data-id="${task._id}">Update</button>
            <button type="button" class="btn btn-danger btn-sm float-right delete-btn" data-id="${task._id}">Delete</button>
          `;

                taskItem.querySelector('.update-btn').addEventListener('click', () => {
                    taskForm.setAttribute('data-task-id', task._id);
                    document.getElementById('title').value = task.title;
                    document.getElementById('description').value = task.description;
                });

                taskItem.querySelector('.delete-btn').addEventListener('click', async () => {
                    await fetch(`/tasks/${task._id}`, { method: 'DELETE' });
                    taskItem.remove();
                });

                taskList.appendChild(taskItem);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchTasks();
});