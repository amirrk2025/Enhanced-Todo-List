const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

// بازیابی تسک‌ها از LocalStorage هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', loadTodos);

todoForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const task = todoInput.value.trim();

    if (task) {
        addTodo(task);
        saveTodos();
        todoInput.value = '';
    }
});

function addTodo(task, isCompleted = false, description = '', reminder = '', imageUrl = '') {
    const li = document.createElement('li');
    li.classList.add('fade-in');
    if (isCompleted) {
        li.classList.add('completed');
    }
    li.innerHTML = `
            <div class="task-content">
                <span>${task}</span>
                <div>
                    <button onclick="editTask(this)">🖋</button>
                    <button onclick="deleteTask(this)">🚮</button>
                    <button onclick="completeTask(this)">✅</button>
                    <button onclick="addDescription(this)">📝</button>
                    <button onclick="addImage(this)">📷</button>
                    <button onclick="removeImage(this)">❌📷</button>
                    <button onclick="addReminder(this)">⏰</button>
                    <button onclick="removeReminder(this)">❌⏰</button>
                </div>
            </div>
            <div class="description">${description ? `Description: ${description}` : ''}</div>
            <div class="reminder-info">${reminder ? `Reminder set for: ${reminder}` : ''}</div>
            <img class="task-image" style="display:${imageUrl ? 'block' : 'none'};" src="${imageUrl}">
        `;
    todoList.appendChild(li);
}

function editTask(button) {
    const taskElement = button.parentElement.previousElementSibling;
    const newTask = prompt('Edit your task:', taskElement.textContent);
    if (newTask) {
        taskElement.textContent = newTask;
        saveTodos();
    }
}

function deleteTask(button) {
    const li = button.closest('li');
    todoList.removeChild(li);
    saveTodos();
}

function completeTask(button) {
    const li = button.closest('li');
    li.classList.toggle('completed');
    saveTodos();
}

function addDescription(button) {
    const descriptionDiv = button.closest('li').querySelector('.description');
    const description = prompt('Enter a description:', descriptionDiv.textContent || '');
    if (description) {
        descriptionDiv.textContent = `Description: ${description}`;
        saveTodos();
    }
}

function addImage(button) {
    const li = button.closest('li');
    const imgElement = li.querySelector('.task-image');

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('image-options');

    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'Upload from Computer';
    const urlButton = document.createElement('button');
    urlButton.textContent = 'Add from URL';

    optionsDiv.appendChild(uploadButton);
    optionsDiv.appendChild(urlButton);

    li.appendChild(optionsDiv);

    uploadButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imgElement.src = e.target.result;
                    imgElement.style.display = 'block';
                    saveTodos();
                };
                reader.readAsDataURL(file);
            }
        });

        fileInput.click();
        li.removeChild(optionsDiv);
    });

    urlButton.addEventListener('click', () => {
        const imageUrl = prompt('Enter the image URL:');
        if (imageUrl) {
            imgElement.src = imageUrl;
            imgElement.style.display = 'block';
            saveTodos();
        }
        li.removeChild(optionsDiv);
    });
}

function removeImage(button) {
    const li = button.closest('li');
    const imgElement = li.querySelector('.task-image');
    if (imgElement) {
        imgElement.src = '';
        imgElement.style.display = 'none';
        saveTodos();
    }
}

function addReminder(button) {
    const reminderDiv = button.closest('li').querySelector('.reminder-info');
    const reminderTimeInput = document.createElement('input');
    reminderTimeInput.type = 'datetime-local';
    reminderTimeInput.style.display = 'block';
    reminderTimeInput.addEventListener('change', function () {
        const reminderTime = reminderTimeInput.value;
        if (reminderTime) {
            reminderDiv.textContent = `Reminder set for: ${reminderTime}`;
            saveTodos();
            const reminderDate = new Date(reminderTime);

            const currentTime = new Date();
            const timeDifference = reminderDate - currentTime;

            if (timeDifference > 0) {
                setTimeout(() => {
                    alert(`Reminder: ${button.closest('li').querySelector('span').textContent}`);
                }, timeDifference);
            } else {
                alert("Invalid reminder time. Please enter a future date and time.");
            }
        }
    });
    reminderDiv.appendChild(reminderTimeInput);
}

function removeReminder(button) {
    const li = button.closest('li');
    const reminderDiv = li.querySelector('.reminder-info');
    if (reminderDiv) {
        reminderDiv.textContent = '';
        saveTodos();
    }
}

// ذخیره تسک‌ها در LocalStorage
function saveTodos() {
    const todos = [];
    document.querySelectorAll('#todo-list li').forEach(li => {
        todos.push({
            task: li.querySelector('.task-content span').textContent,
            isCompleted: li.classList.contains('completed'),
            description: li.querySelector('.description').textContent.replace('Description: ', ''),
            reminder: li.querySelector('.reminder-info').textContent.replace('Reminder set for: ', ''),
            imageUrl: li.querySelector('.task-image').src || ''
        });
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// بازیابی تسک‌ها از LocalStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    todos.forEach(todo => {
        addTodo(todo.task, todo.isCompleted, todo.description, todo.reminder, todo.imageUrl);
    });
}