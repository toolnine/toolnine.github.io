const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

function setInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else if (savedTheme === "black") {
    body.setAttribute("data-theme", "black");
    if (themeToggle) themeToggle.textContent = "🌑";
  } else {
    body.removeAttribute("data-theme");
    if (themeToggle) themeToggle.textContent = "🌙";
  }
}
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
    } else {
      body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌙";
    }
  });
}

// Branding fix
document.title = document.title.replace("OneTool", "ToolNine");

// Improved PWA Install Button (hide after install/dismiss)
const installButton = document.getElementById('installButton');
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installButton) installButton.style.display = 'block';
});
if (installButton) {
  installButton.addEventListener('click', () => {
    installButton.style.display = 'none';
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
      });
    }
  });
  window.addEventListener('appinstalled', () => installButton.style.display = 'none');
}
