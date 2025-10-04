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
            setupThemeToggle();
            // NEW: Setup universal search logic for redirection
            setupCommonSearchRedirection();
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

    // 3. Initialize main page logic AFTER header/footer are loaded
    // Wait a tick to let the HTML render
    setTimeout(() => {
        if (typeof initializePageLogic === "function") {
            initializePageLogic();
        }
    }, 0);
}

// --- Universal Search Redirection Logic (NEW FUNCTION) ---
function setupCommonSearchRedirection() {
    const headerSearchInput = document.getElementById('headerSearchInput');
    if (headerSearchInput) {
        // Function to handle redirection logic
        const handleSearchRequest = () => {
            const query = headerSearchInput.value.trim();
            const isOnHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

            if (query.length > 0) {
                if (isOnHomePage) {
                    // If on homepage, let the specific script.js handle the filtering.
                    // The 'input' listener below will handle this, but for 'Enter' key, we ensure it's processed.
                    if (typeof performInPlaceSearch === "function") {
                        performInPlaceSearch(query);
                    }
                } else {
                    // If not on homepage, redirect to homepage with search query in URL.
                    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
                }
            } else if (!isOnHomePage && window.location.search.includes('search=')) {
                // If query is empty and we are on a non-homepage URL with search params, redirect back clean.
                window.location.href = `index.html`;
            }
        };

        // Add event listeners:
        // 1. For keydown/enter (to perform action immediately on pressing Enter)
        headerSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSearchRequest();
            }
        });

        // 2. For input event (to provide live filtering on homepage, and to ensure functionality on all pages)
        // Note: The homepage script.js will also have an input listener (see below update for script.js)
        // If we are on a non-homepage, we only need to respond to 'Enter' or click.
        // Let's keep a simpler approach to avoid redundant listeners:
        // The homepage script's initializePageLogic already sets up a listener for 'input' (performInPlaceSearch).
        // Let's add the input listener here only for the redirection part when needed.
    }
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

// END OF FILE: js/load-components.js
