const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

addBtn.addEventListener("click", function () {
    if (taskInput.value === "") {
        alert("Please enter a task!");
        return;
    }

    const li = document.createElement("li");

    // Task text
    const span = document.createElement("span");
    span.textContent = taskInput.value;

    // Mark as completed
    span.addEventListener("click", function () {
        span.classList.toggle("completed");
    });

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {
        li.remove();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    taskInput.value = "";
});
taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addBtn.click();
    }
});