const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");
const priority = document.getElementById("priority");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const clearBtn = document.getElementById("clearBtn");
const themeBtn = document.getElementById("themeBtn");

const clickSound = document.getElementById("clickSound");


let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";



// Add Task

addBtn.addEventListener("click", addTask);


taskInput.addEventListener("keypress", e => {

    if(e.key === "Enter"){
        addTask();
    }

});



function addTask(){

    if(taskInput.value.trim()==""){
        alert("Enter a task!");
        return;
    }


    const task = {

        id: Date.now(),

        text: taskInput.value,

        priority: priority.value,

        completed:false,

        date:new Date().toLocaleString()

    };


    tasks.push(task);


    saveTasks();

    renderTasks();


    taskInput.value="";

    playSound();

}




// Display Tasks

function renderTasks(){

    taskList.innerHTML="";


    let filtered = tasks.filter(task=>{


        if(currentFilter=="completed")
            return task.completed;


        if(currentFilter=="pending")
            return !task.completed;


        return true;


    });



    filtered.forEach(task=>{


        if(!task.text.toLowerCase()
        .includes(searchInput.value.toLowerCase()))
        return;



        const li=document.createElement("li");



        li.classList.add(
            "priority-"+task.priority.toLowerCase()
        );



        const span=document.createElement("span");

        span.className="task-text";

        span.innerHTML=
        `
        ${task.text}
        <br>
        <small class="date">
        ${task.date}
        </small>
        `;



        if(task.completed)
        span.classList.add("completed");



        span.onclick=()=>{

            task.completed=!task.completed;

            saveTasks();

            renderTasks();

        };



        const edit=document.createElement("button");

        edit.innerHTML="✏️";

        edit.className="editBtn";


        edit.onclick=()=>{

            let newText=prompt(
                "Edit Task",
                task.text
            );


            if(newText){

                task.text=newText;

                saveTasks();

                renderTasks();

            }

        };



        const del=document.createElement("button");

        del.innerHTML="🗑";

        del.className="deleteBtn";


        del.onclick=()=>{

            tasks=tasks.filter(
                t=>t.id!==task.id
            );


            saveTasks();

            renderTasks();

        };



        const buttons=document.createElement("div");

        buttons.appendChild(edit);

        buttons.appendChild(del);



        li.appendChild(span);

        li.appendChild(buttons);



        taskList.appendChild(li);



    });


    updateCounter();

}




// Save

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}




// Counter

function updateCounter(){

    totalTasks.textContent=tasks.length;


    completedTasks.textContent=
    tasks.filter(
        t=>t.completed
    ).length;

}




// Search

searchInput.addEventListener(
"input",
renderTasks
);




// Filters

document.querySelectorAll(".filterBtn")
.forEach(btn=>{


    btn.onclick=()=>{

        currentFilter=
        btn.dataset.filter;


        renderTasks();

    };


});




// Clear completed

clearBtn.onclick=()=>{


    tasks=tasks.filter(
        t=>!t.completed
    );


    saveTasks();

    renderTasks();

};




// Dark Mode

themeBtn.onclick=()=>{

    document.body.classList.toggle("dark");

};




// Sound

function playSound(){

    if(clickSound){

        clickSound.currentTime=0;

        clickSound.play();

    }

}



renderTasks();