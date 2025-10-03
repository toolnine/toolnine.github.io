// START: js/load-components.js

async function loadDynamicContent() {
    // 1. Load Header content
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('/includes/header.html');
            const headerHtml = await response.text();
            headerPlaceholder.innerHTML = headerHtml;
        } catch (error) {
            console.error('Failed to load header content:', error);
        }
    }

    // 2. Load Footer content
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

    // 3. Re-initialize scripts after content insertion
    // Note: If you have scripts (like theme.js or main script logic) that depend on
    // elements within the header/footer (like hamburger menu buttons), you must call their initialization logic here.
    // Let's call the functions from theme.js and script.js here, or ensure those scripts are modified to run after this injection.
    
    // --- Re-initialization for Theme and Navigation ---
    // The existing theme.js logic should be modified slightly to be called here after injection,
    // or you can include a simple initialization function here.
    // Since theme.js and script.js are already included at the bottom, they will run after this script,
    // but a DOMContentLoaded event inside them might fire before the injection completes.
    // To be safest, we'll call a re-initialization function here.

    // Let's assume you modify theme.js to expose its initialization function, e.g., initTheme();
    // In theme.js, wrap the DOMContentLoaded code in a function:
    // function initTheme() { //... existing theme.js logic ... }
    // document.addEventListener('DOMContentLoaded', initTheme); // remove this line from theme.js itself.
    // Then call initTheme(); here after injection.
    // For this example, let's just make sure theme.js and script.js are loaded after this script.
}

// Ensure the function runs after the main page content is loaded
document.addEventListener('DOMContentLoaded', loadDynamicContent);

// END: js/load-components.js
