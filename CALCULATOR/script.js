const display = document.getElementById("display");

const buttons = document.querySelectorAll(".buttons button");
buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value = button.textContent;

        if (value === "AC") {
            display.value = "";
        }

        else if (value === "DEL") {
            display.value = display.value.slice(0, -1);
        }

        else if (value === "=") {
            try {
                display.value = eval(display.value);
            } catch {
                display.value = "Error";
            }
        }

        else {

    if (display.value === "Error") {
        display.value = "";
    }

    display.value += value;

}
    });

});
document.addEventListener("keydown", (event) => {

    const key = event.key;

    if (!isNaN(key) || "+-*/.%".includes(key)) {
        display.value += key;
    }

    else if (key === "Enter") {
        try {
            display.value = eval(display.value);
        } catch {
            display.value = "Error";
        }
    }

    else if (key === "Backspace") {
        display.value = display.value.slice(0, -1);
    }

    else if (key === "Escape") {
        display.value = "";
    }

});
const themeButton = document.getElementById("themeToggle");
const calculator = document.querySelector(".calculator");

themeButton.addEventListener("click", () => {

    calculator.classList.toggle("light");

    if (calculator.classList.contains("light")) {
        themeButton.textContent = "☀️";
    } else {
        themeButton.textContent = "🌙";
    }

});