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
    // Empty-state message
    var emptyEl = $('#solutionEmpty');
    if (emptyEl) emptyEl.style.display = count === 0 ? '' : 'none';
  }

  function syncChipUI() {
    // Quiet chip system (same as products): active = dark chip, idle = soft gray.
    industryChips.forEach(function (c) {
      var v = c.getAttribute('data-industry') || '';
      if (v === activeIndustry) {
        c.classList.add('chip-active');
        c.classList.remove('chip-idle');
      } else if (v !== '') {
        c.classList.remove('chip-active');
        c.classList.add('chip-idle');
      }
    });
    var allBtn = $('#industryFilters [data-industry=""]');
    if (allBtn) {
      if (!activeIndustry) {
        allBtn.classList.add('chip-active');
        allBtn.classList.remove('chip-idle');
      } else {
        allBtn.classList.remove('chip-active');
        allBtn.classList.add('chip-idle');
      }
    }
  }

  function writeURL() {
    var params = new URLSearchParams();
    if (activeIndustry) params.set('industry', activeIndustry);
    if (searchTerm) params.set('q', searchTerm);
    var qs = params.toString();
    var newURL = (qs ? '?' + qs : window.location.pathname) + window.location.hash;
    history.replaceState(null, '', newURL);
  }

  function readURL() {
    var params = new URLSearchParams(window.location.search);
    var ind = params.get('industry');
    if (ind) activeIndustry = ind;
    var q = params.get('q');
    if (q) {
      searchTerm = q.trim().toLowerCase();
      if (searchInput) searchInput.value = q;
    }
  }

  // Init from URL (nav links like /solutions?industry=smart-hotels)
  readURL();
  syncChipUI();
  apply();

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchTerm = (this.value || '').trim().toLowerCase();
      writeURL();
      apply();
    });
  }

  industryChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var val = this.getAttribute('data-industry') || '';
      activeIndustry = activeIndustry === val ? '' : val;
      syncChipUI();
      writeURL();
      apply();
    });
  });
})();
