(function () {
  'use strict';
  function $(s, c) {
    return (c || document).querySelector(s);
  }
  function $$(s, c) {
    return Array.from((c || document).querySelectorAll(s));
  }

  var searchInput = $('#blogSearch');
  var filterChips = $$('#blogFilters .filter-chip');
  var posts = $$('.blog-post-item');
  var activeCategory = '';
  var searchTerm = '';

  function apply() {
    posts.forEach(function (post) {
      var cat = post.getAttribute('data-category') || '';
      var text = (post.textContent || '').toLowerCase();
      var match = true;
      if (activeCategory && cat !== activeCategory) match = false;
      if (searchTerm && text.indexOf(searchTerm) === -1) match = false;
      if (match) {
        post.style.display = '';
      } else {
        post.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchTerm = (this.value || '').trim().toLowerCase();
      apply();
    });
  }

  // Chips also link to dedicated category pages — clicking a chip
  // filters client-side AND the href navigates. We prevent default
  // on the second click (to toggle off) but let the first click
  // both filter and navigate to category page.
  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      var val = this.getAttribute('data-category') || '';
      if (val === '') return; // "All" button — just clear filter, no nav

      if (activeCategory === val) {
        // Already active — toggle off, stay on page
        e.preventDefault();
        activeCategory = '';
        updateChips();
        apply();
        return;
      }

      // First click on this chip — set it active and let the link navigate
      activeCategory = val;
      updateChips();
      apply();
      // Allow the <a> tag to navigate to the category page
    });

    // "All" chip special handling
    if ((chip.getAttribute('data-category') || '') === '') {
      chip.addEventListener('click', function (e) {
        e.preventDefault();
        activeCategory = '';
        updateChips();
        apply();
      });
    }
  });

  function updateChips() {
    // Quiet chip system: active = dark solid (chip-active), idle = soft gray (chip-idle)
    filterChips.forEach(function (c) {
      var v = c.getAttribute('data-category') || '';
      if (v === activeCategory) {
        c.classList.remove('chip-idle');
        c.classList.add('chip-active');
      } else {
        c.classList.remove('chip-active');
        c.classList.add('chip-idle');
      }
    });
  }
})();
