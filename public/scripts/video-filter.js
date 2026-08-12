(function () {
  'use strict';
  function $(s, c) {
    return (c || document).querySelector(s);
  }
  function $$(s, c) {
    return Array.from((c || document).querySelectorAll(s));
  }

  var searchInput = $('#videoSearch');
  var filterChips = $$('#videoFilters .filter-chip');
  var cards = $$('.video-card');
  var sections = $$('.video-section');
  var activeCategory = '';
  var searchTerm = '';

  function apply() {
    var count = 0;

    cards.forEach(function (card) {
      var cat = card.getAttribute('data-category') || '';
      var text = (card.textContent || '').toLowerCase();
      var match = true;
      if (activeCategory && cat !== activeCategory) match = false;
      if (searchTerm && text.indexOf(searchTerm) === -1) match = false;
      if (match) {
        card.style.display = '';
        count++;
      } else {
        card.style.display = 'none';
      }
    });

    // Hide empty sections
    sections.forEach(function (sec) {
      var visibleCards = sec.querySelectorAll('.video-card');
      var hasVisible = false;
      visibleCards.forEach(function (c) {
        if (c.style.display !== 'none') hasVisible = true;
      });
      sec.style.display = hasVisible ? '' : 'none';
    });

    var countEl = $('#videoCount');
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
      updateChips();
      apply();
    });
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
