(function () {
  'use strict';
  function $(s, c) {
    return (c || document).querySelector(s);
  }
  function $$(s, c) {
    return Array.from((c || document).querySelectorAll(s));
  }

  var searchInput = $('#solutionSearch');
  var industryChips = $$('#industryFilters .filter-chip');
  var cards = $$('.solution-card');
  var activeIndustry = '';
  var searchTerm = '';

  function apply() {
    var count = 0;
    cards.forEach(function (card) {
      var industry = card.getAttribute('data-industry') || '';
      var text = (card.textContent || '').toLowerCase();
      var match = true;
      if (activeIndustry && industry !== activeIndustry) match = false;
      if (searchTerm && text.indexOf(searchTerm) === -1) match = false;
      if (match) {
        card.style.display = '';
        count++;
      } else {
        card.style.display = 'none';
      }
    });
    var countEl = $('#solutionCount');
    if (countEl) countEl.textContent = count;
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchTerm = (this.value || '').trim().toLowerCase();
      apply();
    });
  }

  industryChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var val = this.getAttribute('data-industry') || '';
      activeIndustry = activeIndustry === val ? '' : val;
      industryChips.forEach(function (c) {
        var v = c.getAttribute('data-industry') || '';
        if (v === activeIndustry) {
          c.classList.add('bg-primary', 'text-primary-foreground', 'border-primary');
          c.classList.remove(
            'bg-white',
            'dark:bg-slate-800',
            'border-gray-300',
            'dark:border-slate-600',
            'text-gray-600',
            'dark:text-slate-400'
          );
        } else if (v === '') {
          /* keep All button */
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
      // Also update All chip
      var allBtn = $('#industryFilters [data-industry=""]');
      if (allBtn) {
        if (!activeIndustry) {
          allBtn.classList.add('bg-primary', 'text-primary-foreground', 'border-primary');
        } else {
          allBtn.classList.remove('bg-primary', 'text-primary-foreground', 'border-primary');
          allBtn.classList.add(
            'bg-white',
            'dark:bg-slate-800',
            'border-gray-300',
            'dark:border-slate-600',
            'text-gray-600',
            'dark:text-slate-400'
          );
        }
      }
      apply();
    });
  });
})();
