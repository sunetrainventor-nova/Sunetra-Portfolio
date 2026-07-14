// ==============================
// GET ELEMENTS
// ==============================

const display = document.getElementById("display");

const buttons = document.querySelectorAll(".buttons button");

const historyBtn = document.getElementById("historyBtn");

const historyPanel = document.getElementById("historyPanel");

const historyList = document.getElementById("historyList");

const clearHistory = document.getElementById("clearHistory");

const themeBtn = document.getElementById("themeBtn");

const clickSound = document.getElementById("clickSound");

let expression = "";

// ==============================
// CLICK SOUND
// ==============================

function playSound(){

    clickSound.currentTime = 0;

    clickSound.play();

}

// ==============================
// THEME
// ==============================

if(localStorage.getItem("theme") === "light"){

    document.body.classList.add("light");

    themeBtn.textContent = "☀️";

}

themeBtn.addEventListener("click",()=>{

    playSound();

    document.body.classList.toggle("light");

    themeBtn.style.transform="rotate(360deg)";

setTimeout(()=>{

    themeBtn.style.transform="";

},500);

    if(document.body.classList.contains("light")){

        localStorage.setItem("theme","light");

        themeBtn.textContent="☀️";

    }

    else{

        localStorage.setItem("theme","dark");

        themeBtn.textContent="🌙";

    }

});

// ==============================
// HISTORY PANEL
// ==============================

historyBtn.addEventListener("click",()=>{

    playSound();

    historyPanel.classList.toggle("active");

});

// ==============================
// LOAD HISTORY
// ==============================

let history = JSON.parse(localStorage.getItem("history")) || [];

function loadHistory(){

    historyList.innerHTML = "";

    history.forEach(item=>{

        const div = document.createElement("div");

        div.className="history-item";

        div.innerHTML=item;

        historyList.prepend(div);

    });

}

loadHistory();

// ==============================
// SAVE HISTORY
// ==============================

function saveHistory(calculation){

    history.push(calculation);

    localStorage.setItem("history",JSON.stringify(history));

    loadHistory();

}

// ==============================
// CLEAR HISTORY
// ==============================

clearHistory.addEventListener("click",()=>{

    playSound();

    history=[];

    localStorage.removeItem("history");

    loadHistory();

});

// ==============================
// BUTTON CLICK
// ==============================

buttons.forEach(button=>{

button.addEventListener("click",()=>{

playSound();
button.classList.add("clicked");


setTimeout(()=>{

    button.classList.remove("clicked");

},200);
let value = button.textContent;
animateDisplay();
if(value==="AC"){

expression="";

display.value="";

return;

}
if(value==="DEL"){

expression=expression.slice(0,-1);

display.value=expression;

return;

}
if(value==="×") value="*";

if(value==="÷") value="/";
if(value==="%"){

expression+="%";

display.value=expression;

return;

}
if(value==="+/-"){

if(expression.startsWith("-")){

expression=expression.substring(1);

}

else{

expression="-"+expression;

}

display.value=expression;

return;

}
if(value==="="){

try{

let result = eval(

expression.replace(/%/g,"/100")

);

saveHistory(

expression+" = "+result

);

expression=result.toString();

display.value=expression;

}

catch{

display.value="Error";

expression="";

}

return;

}
expression+=value;

display.value=expression;

});
});
// ==============================
// KEYBOARD
// ==============================

document.addEventListener("keydown",(e)=>{

const key=e.key;

if("0123456789+-*/.%".includes(key)){

expression+=key;

display.value=expression;

}

if(key==="Enter"){

try{

let result=eval(

expression.replace(/%/g,"/100")

);

saveHistory(

expression+" = "+result

);

expression=result.toString();

display.value=expression;

}

catch{

display.value="Error";

expression="";

}

}

if(key==="Backspace"){

expression=expression.slice(0,-1);

display.value=expression;

}

if(key==="Escape"){

expression="";

display.value="";

}

});

// ==============================
// MOUSE FOLLOW GLOW
// ==============================

const mouseGlow = document.querySelector(".mouse-glow");


document.addEventListener("mousemove",(e)=>{

    mouseGlow.style.left = e.clientX + "px";

    mouseGlow.style.top = e.clientY + "px";

});

// ==============================
// DISPLAY ANIMATION
// ==============================

function animateDisplay(){

    display.style.animation="none";

    setTimeout(()=>{

        display.style.animation="displayGlow .3s ease";

    },10);

}