(function () {
  'use strict';
  function $(s, c) {
    return (c || document).querySelector(s);
  }
  function $$(s, c) {
    return Array.from((c || document).querySelectorAll(s));
  }

  var searchInput = $('#faqSearch');
  var filterChips = $$('#faqFilters .filter-chip');
  var items = $$('.faq-item');
  var sections = $$('.faq-section');
  var activeCategory = '';
  var searchTerm = '';

  function apply() {
    items.forEach(function (item) {
      var section = item.closest('.faq-section');
      var cat = section ? section.getAttribute('data-category') || '' : '';
      var text = (item.textContent || '').toLowerCase();
      var match = true;
      if (activeCategory && cat !== activeCategory) match = false;
      if (searchTerm && text.indexOf(searchTerm) === -1) match = false;
      if (match) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });

    // Hide empty sections
    sections.forEach(function (sec) {
      var vis = sec.querySelectorAll('.faq-item');
      var has = false;
      vis.forEach(function (v) {
        if (v.style.display !== 'none') has = true;
      });
      sec.style.display = has ? '' : 'none';
    });
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
      updateChips();
      apply();
    });
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
    var allBtn = $('#faqFilters [data-category=""]');
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
