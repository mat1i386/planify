tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "inverse-on-surface": "#f2f0f0",
          "secondary-fixed-dim": "#6dd8c8",
          "on-tertiary-fixed-variant": "#723600",
          "surface-container-highest": "#e4e2e2",
          "surface-dim": "#dbd9d9",
          "on-tertiary-container": "#ff8c31",
          "on-surface": "#1b1c1c",
          "outline-variant": "#c3c6cf",
          "on-tertiary-fixed": "#311300",
          "surface-container-low": "#f5f3f3",
          "secondary": "#006a60",
          "on-error": "#ffffff",
          "tertiary-fixed-dim": "#ffb786",
          "secondary-fixed": "#8bf5e4",
          "inverse-surface": "#303030",
          "on-primary-container": "#8cacd9",
          "on-secondary-fixed-variant": "#005048",
          "surface-container-lowest": "#ffffff",
          "surface-container": "#efeded",
          "on-secondary-fixed": "#00201c",
          "tertiary-fixed": "#ffdcc7",
          "inverse-primary": "#a8c9f7",
          "tertiary": "#451e00",
          "surface-variant": "#e4e2e2",
          "error": "#ba1a1a",
          "outline": "#73777f",
          "on-primary-fixed-variant": "#264870",
          "on-secondary": "#ffffff",
          "error-container": "#ffdad6",
          "on-error-container": "#93000a",
          "primary": "#002a4f",
          "surface": "#fbf9f8",
          "on-surface-variant": "#43474e",
          "primary-fixed-dim": "#a8c9f7",
          "on-background": "#1b1c1c",
          "on-tertiary": "#ffffff",
          "tertiary-container": "#663000",
          "surface-container-high": "#eae8e7",
          "secondary-container": "#88f2e2",
          "surface-bright": "#fbf9f8",
          "primary-container": "#1d4067",
          "primary-fixed": "#d3e4ff",
          "on-primary": "#ffffff",
          "on-primary-fixed": "#001c38",
          "on-secondary-container": "#006f64",
          "surface-tint": "#406089",
          "background": "#fbf9f8"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "space-lg": "1.5rem",
          "space-sm": "0.5rem",
          "gutter-sm": "1rem",
          "space-xl": "2.5rem",
          "margin": "2rem",
          "margin-sm": "1rem",
          "space-md": "1rem",
          "space-xs": "0.25rem",
          "gutter": "1.5rem"
        },
        "fontFamily": {
          "body-lg": ["Roboto Flex"],
          "label-lg": ["Roboto Flex"],
          "display-lg": ["Roboto Flex"],
          "headline-lg-mobile": ["Roboto Flex"],
          "display-lg-mobile": ["Roboto Flex"],
          "title-lg": ["Roboto Flex"],
          "headline-sm": ["Roboto Flex"],
          "label-md": ["Roboto Flex"],
          "title-md": ["Roboto Flex"],
          "label-sm": ["Roboto Flex"],
          "body-md": ["Roboto Flex"],
          "body-sm": ["Roboto Flex"],
          "headline-lg": ["Roboto Flex"],
          "headline-md": ["Roboto Flex"]
        },
        "fontSize": {
          "body-lg": ["16px", {"lineHeight": "24px", "letterSpacing": "0em", "fontWeight": "400"}],
          "label-lg": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "600"}],
          "display-lg": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
          "headline-lg-mobile": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.005em", "fontWeight": "700"}],
          "display-lg-mobile": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
          "title-lg": ["18px", {"lineHeight": "26px", "letterSpacing": "0em", "fontWeight": "600"}],
          "headline-sm": ["20px", {"lineHeight": "28px", "letterSpacing": "0em", "fontWeight": "600"}],
          "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.02em", "fontWeight": "600"}],
          "title-md": ["16px", {"lineHeight": "24px", "letterSpacing": "0.005em", "fontWeight": "500"}],
          "label-sm": ["10px", {"lineHeight": "14px", "letterSpacing": "0.04em", "fontWeight": "700"}],
          "body-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "400"}],
          "body-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.015em", "fontWeight": "400"}],
          "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
          "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "0em", "fontWeight": "600"}]
        }
      }
    }
  };

document.addEventListener("DOMContentLoaded", () => {
(function() {
      const filterTabs = document.querySelectorAll('.filter-tab');
      const cards = document.querySelectorAll('.destination-card');
      const searchInput = document.getElementById('search-input');
      const cardsContainer = document.getElementById('cards-container');
      const sortBtn = document.getElementById('sort-menu-btn');
      const sortDropdown = document.getElementById('sort-dropdown');
      const sortOptions = document.querySelectorAll('.sort-option');
      const currentSortLabel = document.getElementById('current-sort-label');
      const favoriteHearts = document.querySelectorAll('.favorite-heart');

      let currentCategory = 'all';
      let searchQuery = '';

      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => {
            t.classList.remove('bg-secondary', 'text-on-secondary');
            t.classList.add('bg-surface-container-low', 'text-on-surface-variant');
          });
          tab.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
          tab.classList.add('bg-secondary', 'text-on-secondary');

          currentCategory = tab.getAttribute('data-category');
          applyFilterAndSearch();
        });
      });

      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        applyFilterAndSearch();
      });

      function applyFilterAndSearch() {
        cards.forEach(card => {
          const cardCategories = card.getAttribute('data-category') || '';
          const cardName = card.getAttribute('data-name')?.toLowerCase() || '';

          const matchesCategory = currentCategory === 'all' || cardCategories.includes(currentCategory);
          const matchesSearch = !searchQuery || cardName.includes(searchQuery);

          if (matchesCategory && matchesSearch) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      }

      sortBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sortDropdown.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        sortDropdown.classList.add('hidden');
      });

      sortOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
          const sortType = opt.getAttribute('data-sort');
          currentSortLabel.textContent = opt.textContent;
          sortDropdown.classList.add('hidden');

          const cardsArray = Array.from(cards);

          if (sortType === 'recent') {
            cardsArray.sort((a, b) => new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date')));
          } else if (sortType === 'popular') {
            cardsArray.sort((a, b) => Number(b.getAttribute('data-popularity')) - Number(a.getAttribute('data-popularity')));
          } else if (sortType === 'alpha') {
            cardsArray.sort((a, b) => a.getAttribute('data-name').localeCompare(b.getAttribute('data-name')));
          }

          cardsArray.forEach(card => cardsContainer.appendChild(card));
        });
      });

      favoriteHearts.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const icon = btn.querySelector('.material-symbols-outlined');
          if (icon.textContent === 'favorite') {
            icon.textContent = 'favorite_border';
            icon.style.fontVariationSettings = "'FILL' 0";
            btn.classList.remove('text-on-tertiary-container');
            btn.classList.add('text-on-surface-variant');
          } else {
            icon.textContent = 'favorite';
            icon.style.fontVariationSettings = "'FILL' 1";
            btn.classList.add('text-on-tertiary-container');
            btn.classList.remove('text-on-surface-variant');
          }
        });
      });

    })();
});
