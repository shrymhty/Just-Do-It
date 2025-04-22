import './styles.css';

const addNewItem = document.getElementById('new-item');
const dialog = document.querySelector('dialog');
const submitBtn = document.querySelector(".submit");
const allTasks = document.getElementById('all');
const completeTasks = document.getElementById('complete');
const incompleteTasks = document.getElementById('incomplete');

window.addEventListener('DOMContentLoaded', () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => createNewTask(task.title, task.desc, task.completed, task.id));
});

addNewItem.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
});

submitBtn.addEventListener('click', () => {
    const title = document.getElementById("task-title").value.trim();
    const description = document.getElementById("task-description").value.trim();

    const error = document.querySelector('.error');
    error.textContent = '';
    

    if (title === "") {
        error.textContent = 'Title cannot be empty';
        return;
    }

    const id = generateID();
    createNewTask(title, description, false, id);
    saveTaskToLocalStorage({ title, desc: description, completed: false, id });


    dialog.close();

    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";
})

function createNewTask(title, desc, completed = false, id = generateID()) {
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.setAttribute('data-id', id);

    newCard.style.display = 'flex';
    newCard.style.flexDirection = 'column';
    newCard.style.height = '150px';
    newCard.style.backgroundColor = 'lightblue';
    newCard.style.padding = '20px';
    newCard.style.marginBottom = '10px';
    newCard.style.borderRadius = '5px';

    const taskTitle = document.createElement('h3');
    taskTitle.textContent = title;
    taskTitle.style.marginBottom = '10px';
    taskTitle.style.fontSize = '1.2rem';
    taskTitle.style.borderBottom = 'solid 2px darkgray';
    taskTitle.style.backgroundColor = 'lightblue';

    const taskDesc = document.createElement('p');
    taskDesc.textContent = desc;
    taskDesc.style.fontSize = '0.9rem';
    taskDesc.style.color = '#444';
    taskDesc.style.padding = '10px';
    taskDesc.style.backgroundColor = 'lightblue';
    taskDesc.style.marginBottom = '5px';

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.marginTop = 'auto';
    buttonContainer.style.backgroundColor = 'lightblue';

    // Toggle button
    const tickBtn = document.createElement('button');
    tickBtn.innerHTML = '&#10003;'; // Unicode checkmark ✓
    tickBtn.style.width = '30px';
    tickBtn.style.height = '30px';
    tickBtn.style.fontSize = '18px';
    tickBtn.style.border = '2px solid darkgray';
    tickBtn.style.borderRadius = '5px';
    tickBtn.style.backgroundColor = 'transparent';
    tickBtn.style.color = 'darkgray';
    tickBtn.style.cursor = 'pointer';
    tickBtn.style.transition = 'all 0.3s ease';

    function updateTickButtonState(isComplete) {
        tickBtn.style.backgroundColor = isComplete ? 'green' : 'transparent';
        tickBtn.style.color = isComplete ? 'white' : 'darkgray';
        newCard.style.opacity = isComplete ? '0.6' : '1';
        taskTitle.style.textDecoration = isComplete ? 'line-through' : 'none';
    }

    updateTickButtonState(completed);

    tickBtn.addEventListener('click', () => {
        completed = !completed;
        updateTickButtonState(completed);
        updateTaskInLocalStorage(id, { completed });
    })

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.style.fontSize = '1rem';
    deleteBtn.style.color = 'white';
    deleteBtn.style.backgroundColor = 'crimson';
    deleteBtn.style.border = 'none';
    deleteBtn.style.borderRadius = '50%';
    deleteBtn.style.padding = '5px 10px';

    deleteBtn.addEventListener('click', () => {
        newCard.remove();
        deleteTaskFromLocalStorage(id);
    });

    // Add both buttons to container
    buttonContainer.appendChild(tickBtn);
    buttonContainer.appendChild(deleteBtn);

    // Assemble card
    newCard.appendChild(taskTitle);
    newCard.appendChild(taskDesc);
    newCard.appendChild(buttonContainer);

    document.querySelector('.cards').appendChild(newCard);
}

function generateID() {
    return '-' + Math.random().toString(36).substr(2, 9);
}

function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(id, updates) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => task.id === id ? { ...task, ...updates } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

allTasks.addEventListener('click', (event) => {
    event.preventDefault();
    filterTasks('all');
});

completeTasks.addEventListener('click', (e) => {
    e.preventDefault();
    filterTasks('complete'); // passed here
});

incompleteTasks.addEventListener('click', (e) => {
    e.preventDefault();
    filterTasks('incomplete');
});

function filterTasks(status) {
    const cards = document.querySelectorAll('.cards .card');
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    cards.forEach(card => {
        const id = card.getAttribute('data-id');
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        if (status === 'all') {
            card.style.display = 'flex';
        } else if (status === 'complete') {
            card.style.display = task.completed ? 'flex' : 'none';
        } else if (status === 'incomplete') {
            card.style.display = !task.completed ? 'flex' : 'none';
        }
    });

    // Handle active class
    document.querySelectorAll('.links a').forEach(link => {
        link.classList.remove('active-filter');
        if (link.dataset.filter === status) {
            link.classList.add('active-filter');
        }
    });
}