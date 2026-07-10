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
    filterChips.forEach(function (c) {
      var v = c.getAttribute('data-category') || '';
      if (v === activeCategory) {
        c.classList.add('bg-primary', 'text-primary-foreground', 'border-primary');
        c.classList.remove(
          'bg-white',
          'dark:bg-slate-800',
          'border-gray-300',
          'dark:border-slate-600',
          'text-gray-600',
          'dark:text-slate-400'
        );
      } else {
        c.classList.remove('bg-primary', 'text-primary-foreground', 'border-primary');
        c.classList.add(
          'bg-white',
          'dark:bg-slate-800',
          'border-gray-300',
          'dark:border-slate-600',
          'text-gray-600',
          'dark:text-slate-400'
        );
      }
    });
    var allBtn = $('#blogFilters [data-category=""]');
    if (allBtn) {
      if (!activeCategory) {
        allBtn.classList.add('bg-primary', 'text-primary-foreground', 'border-primary');
        allBtn.classList.remove(
          'bg-white',
          'dark:bg-slate-800',
          'border-gray-300',
          'dark:border-slate-600',
          'text-gray-600',
          'dark:text-slate-400'
        );
      }
    }
  }
})();
