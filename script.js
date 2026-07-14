const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";

        }

    });

});


sections.forEach(section => {

    section.style.opacity = "0";
    section.style.transform = "translateY(50px)";
    section.style.transition = "0.8s ease";

    observer.observe(section);

});
const text = "Aspiring AI & Web Developer";
const typingElement = document.querySelector(".hero p");

let index = 0;

function typeEffect(){

    if(index < text.length){

        typingElement.innerHTML += text.charAt(index);
        index++;

        setTimeout(typeEffect,100);

    }

}

typingElement.innerHTML = "";
typeEffect();

const glow = document.createElement("div");

glow.style.position = "fixed";
glow.style.width = "250px";
glow.style.height = "250px";
glow.style.borderRadius = "50%";
glow.style.pointerEvents = "none";
glow.style.background = "rgba(56,189,248,0.15)";
glow.style.filter = "blur(50px)";
glow.style.zIndex = "-1";

document.body.appendChild(glow);


document.addEventListener("mousemove", (e)=>{

    glow.style.left = e.clientX - 125 + "px";
    glow.style.top = e.clientY - 125 + "px";

});
const themeButton = document.getElementById("theme-toggle");

themeButton.addEventListener("click",()=>{

    document.body.classList.toggle("light-mode");

});