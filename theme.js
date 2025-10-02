// Theme toggle with localStorage
const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function setInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else if (savedTheme === "black") {
    body.setAttribute("data-theme", "black");
    if (themeToggle) themeToggle.textContent = "🌑"; // New icon for black mode
  } else {
    body.removeAttribute("data-theme");
    if (themeToggle) themeToggle.textContent = "🌙";
  }
}

// Set initial theme on page load
setInitialTheme();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme") || "light";

    if (currentTheme === "light") {
      body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "☀️";
    } else if (currentTheme === "dark") {
      body.setAttribute("data-theme", "black");
      localStorage.setItem("theme", "black");
      themeToggle.textContent = "🌑";
    } else { // currentTheme === "black"
      body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌙";
    }
  });
}

// Site name change
document.title = document.title.replace("ToolMancer", "OneTool");
