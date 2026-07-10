(function () {
  'use strict';
  function $(s, c) {
    return (c || document).querySelector(s);
  }
  function $$(s, c) {
    return Array.from((c || document).querySelectorAll(s));
  }

  var searchInput = $('#brochureSearch');
  var filterChips = $$('#brochureFilters .filter-chip');
  var cards = $$('.brochure-card');
  var sections = $$('.brochure-section');
  var activeCategory = '';
  var searchTerm = '';

  function apply() {
    var count = 0;
    var visibleSections = new Set();

    cards.forEach(function (card) {
      var section = card.closest('.brochure-section');
      var cat = section ? section.getAttribute('data-category') || '' : '';
      var text = (card.textContent || '').toLowerCase();
      var match = true;
      if (activeCategory && cat !== activeCategory) match = false;
      if (searchTerm && text.indexOf(searchTerm) === -1) match = false;
      if (match) {
        card.style.display = '';
        count++;
        if (section) visibleSections.add(section);
      } else {
        card.style.display = 'none';
      }
    });

    // Show/hide sections
    sections.forEach(function (s) {
      s.style.display = visibleSections.has(s) ? '' : 'none';
    });

    var countEl = $('#brochureCount');
    if (countEl) countEl.textContent = count;
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchTerm = (this.value || '').trim().toLowerCase();
      apply();
    });
  }

  filterChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var val = this.getAttribute('data-category') || '';
      activeCategory = activeCategory === val ? '' : val;
      updateChipStyles();
      apply();
    });
  });

  function updateChipStyles() {
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
    var allBtn = $('#brochureFilters [data-category=""]');
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
