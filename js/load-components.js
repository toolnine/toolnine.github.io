// START OF FILE: js/load-components.js

async function loadDynamicContent() {
    // 1. Load Header content from includes/header.html into placeholder div
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('/includes/header.html');
            const headerHtml = await response.text();
            headerPlaceholder.innerHTML = headerHtml;
            // Re-initialize scripts after content insertion (Theme Toggle, Navigation)
            setupNavigationListeners();
        } catch (error) {
            console.error('Failed to load header content:', error);
        }
    }

    // 2. Load Footer content from includes/footer.html into placeholder div
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch('/includes/footer.html');
            const footerHtml = await response.text();
            footerPlaceholder.innerHTML = footerHtml;
        } catch (error) {
            console.error('Failed to load footer content:', error);
        }
    }

    // Call theme toggle initialization (assuming theme.js is loaded)
    setupThemeToggle();
}

// --- Initialization functions for new injected content ---
function setupNavigationListeners() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const allToolsBtn = document.getElementById('allToolsBtn');
    const allToolsMenu = document.getElementById('allToolsMenu');

    // Toggle logic for hamburger menu (mobile) and all tools button (desktop)
    const toggleMenu = (event) => {
        event.stopPropagation();
        const isDesktopView = window.innerWidth > 900;

        if (isDesktopView) {
            // Desktop logic (dropdown toggle)
            allToolsMenu.classList.toggle('show');
            allToolsBtn.classList.toggle('open');
        } else {
            // Mobile logic (side drawer toggle)
            allToolsMenu.classList.toggle('show');
            document.body.classList.toggle('menu-open');
        }
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }
    if (allToolsBtn) {
        allToolsBtn.addEventListener('click', toggleMenu);
    }

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isDesktopView = window.innerWidth > 900;
        const clickedOutsideMenu = !allToolsMenu.contains(event.target) && !event.target.closest('.main-nav');

        if (isDesktopView) {
            if (allToolsMenu.classList.contains('show') && clickedOutsideMenu) {
                allToolsMenu.classList.remove('show');
                allToolsBtn.classList.remove('open');
            }
        } else {
            if (allToolsMenu.classList.contains('show') && clickedOutsideMenu && event.target !== hamburgerBtn) {
                allToolsMenu.classList.remove('show');
                document.body.classList.remove('menu-open');
            }
        }
    });

    // Handle initial state based on screen size (e.g., ensure correct display on resize)
    function checkScreenSize() {
        if (window.innerWidth > 900) {
            // On desktop, ensure mobile menu state is cleared on resize
            document.body.classList.remove('menu-open');
        } else {
            // On mobile, if menu is open, apply body overflow hidden
            if (allToolsMenu.classList.contains('show')) {
                document.body.classList.add('menu-open');
            }
        }
    }
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize(); // Initial check on load
}

function setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // --- Theme Toggle Logic ---
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
}

// Ensure loadDynamicContent runs after the page has finished loading
document.addEventListener('DOMContentLoaded', loadDynamicContent);
