document.addEventListener('DOMContentLoaded', () => {
    // --- Elements and Initial setup ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const allToolCards = Array.from(document.querySelectorAll('.tool-card-home'));
    const tabButtons = document.querySelectorAll('.tab-btn');
    const featureHighlights = document.getElementById('featureHighlights');
    const allToolsTitle = document.getElementById('allToolsTitle');
    const filterTabs = document.getElementById('filterTabs');
    const homeHero = document.getElementById('homeHero');
    const heroSearchInput = document.getElementById('heroSearchInput');
    const toolGrid = document.getElementById('toolGrid');

    // --- Search Logic ---
    heroSearchInput.addEventListener('input', () => {
        const query = heroSearchInput.value.toLowerCase().trim();
        performInPlaceSearch(query);
    });

    function performInPlaceSearch(query) {
        const lowerCaseQuery = query.toLowerCase().trim();

        if (lowerCaseQuery.length === 0) {
            featureHighlights.style.display = 'flex';
            allToolsTitle.style.display = 'block';
            filterTabs.style.display = 'flex';
            homeHero.style.display = 'block';
            updateToolVisibility(); // Restore category filtering
            return;
        }

        featureHighlights.style.display = 'none';
        allToolsTitle.style.display = 'none';
        filterTabs.style.display = 'none';
        homeHero.style.display = 'block';

        allToolCards.forEach(card => {
            const keywords = card.dataset.keywords.toLowerCase();
            const title = card.querySelector('.tool-title').textContent.toLowerCase();
            if (keywords.includes(lowerCaseQuery) || title.includes(lowerCaseQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // --- Filter Tabs Logic ---
    function updateToolVisibility() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.filter;
        allToolCards.forEach(card => {
            if (activeTab === 'all' || card.dataset.category === activeTab) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateToolVisibility();
        });
    });

    // --- Hamburger menu logic (optional for mobile mega-menu) ---
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            document.body.classList.toggle('menu-open');
        });
    }

    // --- Initial Setup ---
    updateToolVisibility();
});
