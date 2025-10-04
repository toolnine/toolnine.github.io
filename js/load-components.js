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
            // NEW: Setup universal search logic for redirection and live suggestions on non-homepages
            setupUniversalSearchLogic();
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

// --- Universal Search Logic (Live Suggestions + Redirection) ---
function setupUniversalSearchLogic() {
    const headerSearchInput = document.getElementById('headerSearchInput');
    const searchResultsDropdown = document.getElementById('searchResultsDropdown');

    // Tool Data (Manually hardcoded array of tool names and links)
    const allToolsData = [
        { name: "Image to PDF", url: "/tools/image-to-pdf.html", keywords: ["image", "pdf", "convert"] },
        { name: "Image Compressor", url: "/tools/image-compressor.html", keywords: ["image", "compress", "resize"] },
        { name: "Image Resizer", url: "/tools/image-resizer.html", keywords: ["image", "resize", "scale"] },
        { name: "PNG <> JPG Converter", url: "/tools/convert-png-jpg.html", keywords: ["image", "png", "jpg", "convert"] },
        { name: "Steganography", url: "/tools/steganography.html", keywords: ["image", "hide", "secret"] },
        { name: "Palette Extractor", url: "/tools/image-palette-extractor.html", keywords: ["image", "color", "palette"] },
        { name: "Placeholder Generator", url: "/tools/image-placeholder-generator.html", keywords: ["image", "placeholder", "generate"] },
        { name: "Text Diff Checker", url: "/tools/text-diff.html", keywords: ["text", "compare", "diff"] },
        { name: "Word Counter", url: "/tools/word-counter.html", keywords: ["text", "word", "count"] },
        { name: "Text Encryptor", url: "/tools/text-encryptor.html", keywords: ["text", "encrypt", "password"] },
        { name: "Text to PDF", url: "/tools/text-to-pdf.html", keywords: ["text", "pdf", "convert"] },
        { name: "Line Operations", url: "/tools/line-operations.html", keywords: ["text", "sort", "shuffle"] },
        { name: "Text Cleaner", url: "/tools/text-cleaner.html", keywords: ["text", "clean", "format"] },
        { name: "Delivery Note Generator", url: "/tools/delivery-note-generator.html", keywords: ["text", "delivery", "note", "challan"] },
        { name: "Unit Converter", url: "/tools/unit-converter.html", keywords: ["convert", "unit", "length", "weight"] },
        { name: "Document Scanner", url: "/tools/document-scanner.html", keywords: ["convert", "document", "scan", "pdf"] },
        { name: "CSV Editor", url: "/tools/csv-editor.html", keywords: ["convert", "csv", "editor", "spreadsheet"] },
        { name: "Calculator", url: "/tools/calculator.html", keywords: ["convert", "calculator", "math"] },
        { name: "PDF Editor", url: "/tools/pdf-editor.html", keywords: ["convert", "pdf", "edit", "merge", "split"] },
        { name: "QR & Barcode Reader", url: "/tools/qr-reader.html", keywords: ["encode", "qr", "barcode", "scan"] },
        { name: "URL Encoder", url: "/tools/url-encoder.html", keywords: ["encode", "url"] },
        { name: "Hash Generator", url: "/tools/hash-generator.html", keywords: ["encode", "hash", "md5", "sha"] },
        { name: "Password Manager", url: "/tools/password-manager.html", keywords: ["encode", "password", "manager"] },
        { name: "Password Generator", url: "/tools/password-generator.html", keywords: ["encode", "password", "generate"] },
        { name: "QR Generator", url: "/tools/qr-generator.html", keywords: ["encode", "qr", "generate"] },
        { name: "PWA Manifest Generator", url: "/tools/pwa-manifest-generator.html", keywords: ["encode", "pwa", "manifest"] },
        { name: "Image to Prompt (AI)", url: "/tools/image-to-prompt.html", keywords: ["ai", "image", "prompt"] },
        { name: "JSON Formatter", url: "/tools/json-formatter.html", keywords: ["ai", "json", "formatter"] },
        { name: "HTML Viewer", url: "/tools/html-viewer.html", keywords: ["ai", "html", "code", "viewer"] }
    ];

    if (headerSearchInput) {
        // --- Get current page status ---
        const isOnHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';

        // --- Live Suggestions Logic (Only run on non-homepage) ---
        // We only show suggestions when NOT on the homepage to avoid conflict with in-page filtering.
        headerSearchInput.addEventListener('input', () => {
            const query = headerSearchInput.value.trim().toLowerCase();

            // Hide suggestions on homepage
            if (isOnHomePage) {
                // Do nothing here, script.js on homepage handles this.
                return;
            }
            
            // Show suggestions on other pages
            if (query.length === 0) {
                searchResultsDropdown.style.display = 'none';
                return;
            }

            const matchingTools = allToolsData.filter(tool => {
                const searchString = tool.name.toLowerCase() + ' ' + (tool.keywords ? tool.keywords.join(' ') : '');
                return searchString.includes(query);
            }).slice(0, 5); // Show top 5 results

            renderSuggestions(matchingTools, query);
        });

        // --- Redirection Logic (on Enter key or when suggestions are clicked) ---
        headerSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent default form submission

                const query = headerSearchInput.value.trim();

                // If on homepage, perform in-place filtering directly (for full results)
                if (isOnHomePage) {
                    // We let script.js handle the input event, here we just ensure a clean redirect on empty search
                    if (typeof performInPlaceSearch === "function") { // Check if homepage logic exists
                        performInPlaceSearch(query);
                    }
                } else if (query.length > 0) {
                    // If not on homepage, redirect to homepage with query for full results display
                    window.location.href = `/index.html?search=${encodeURIComponent(query)}`;
                } else if (query.length === 0 && window.location.search.includes('search=')) {
                    // Clear search and redirect back to clean homepage URL
                    window.location.href = `/index.html`;
                }
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!headerSearchInput.contains(event.target) && !searchResultsDropdown.contains(event.target)) {
                searchResultsDropdown.style.display = 'none';
            }
        });

        // --- Render Suggestions UI ---
        function renderSuggestions(matches, query) {
            if (query.length === 0 || matches.length === 0) {
                searchResultsDropdown.style.display = 'none';
                return;
            }

            searchResultsDropdown.innerHTML = '';
            const ul = document.createElement('ul');
            ul.className = 'suggestions-list';

            matches.forEach(tool => {
                const li = document.createElement('li');
                li.className = 'suggestion-item';
                li.textContent = tool.name;
                li.dataset.url = tool.url;

                li.addEventListener('click', () => {
                    window.location.href = tool.url;
                });
                ul.appendChild(li);
            });

            searchResultsDropdown.appendChild(ul);
            searchResultsDropdown.style.display = 'block';
        }
    }
}


// --- Initialization functions for new injected content ---
function setupNavigationListeners() {
    // ... (unchanged navigation code from previous update) ...
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
    // ... (unchanged theme logic code from previous update) ...
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
