import './styles.css';

const addNewItem = document.getElementById('new-item');
const dialog = document.querySelector('dialog');
const submitBtn = document.querySelector(".submit");

addNewItem.addEventListener('click', (event) => {
    event.preventDefault();
    dialog.showModal();
});

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      submitBtn.click();
    }
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
    dialog.close();

    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";
})