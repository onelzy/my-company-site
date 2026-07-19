/**
 * Product Filter — Vanilla JS for dimension-tab + chip-based filtering
 *
 * Two dimensions:
 *   "type"   — filter by productType / productSubType + quick sol/comm chips
 *   "solution" — filter by techSolution / techSubType + quick type/comm chips
 *
 * AND between groups (type, subtype, sol, subsol, comm)
 * Single-select within single-value groups, multi-select within comm
 *
 * URL format: ?dim=type&type=smart-meters&subtype=single-phase&comm=zigbee&comm=wifi
 *             ?dim=solution&sol=tuya&subsol=tuya-meters&type=smart-meters&comm=zigbee
 */
(function () {
  'use strict';

  // ===========================================================================
  // Constants
  // ===========================================================================
  const SINGLE_GROUPS = ['type', 'subtype', 'sol', 'subsol'];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const MULTI_GROUPS = ['comm'];

  /** Map URL group key to data-attribute on .product-card-wrapper */
  const GROUP_TO_ATTR = {
    type: 'data-product-type',
    subtype: 'data-product-subtype',
    sol: 'data-tech-solution',
    subsol: 'data-tech-subtype',
    comm: 'data-comm',
  };

  // ===========================================================================
  // State
  // ===========================================================================
  let currentDim = 'type';

  /** Search term for text filtering */
  let searchTerm = '';

  /** { type: string|null, subtype: string|null, sol: string|null, subsol: string|null, comm: Set<string> } */
  const filterState = {
    type: null,
    subtype: null,
    sol: null,
    subsol: null,
    comm: new Set(),
  };

  // ===========================================================================
  // DOM helpers
  // ===========================================================================
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  function getCards() {
    return $$('.product-card-wrapper');
  }

  /**
   * Load taxonomy data. Reads from <script type="application/json" id="taxonomy-data">
   * if present, with fallback to window.__PRODUCT_TAXONOMY.
   */
  function getTaxonomy() {
    if (window.__PRODUCT_TAXONOMY) return window.__PRODUCT_TAXONOMY;
    var el = document.getElementById('taxonomy-data');
    if (el) {
      try {
        window.__PRODUCT_TAXONOMY = JSON.parse(el.textContent);
      } catch (_e) {
        console.warn('Failed to parse taxonomy data:', _e);
        window.__PRODUCT_TAXONOMY = {};
      }
    }
    return window.__PRODUCT_TAXONOMY || {};
  }

  // ===========================================================================
  // URL sync
  // ===========================================================================
  function readFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    // Dimension
    const dim = params.get('dim');
    if (dim === 'type' || dim === 'solution') currentDim = dim;

    // Single-value groups
    for (const g of SINGLE_GROUPS) {
      filterState[g] = params.get(g)?.trim().toLowerCase() || null;
    }

    // Multi-value groups (comm)
    filterState.comm = new Set();
    const commVals = params.getAll('comm');
    for (const v of commVals) {
      const cleaned = v.trim().toLowerCase();
      if (cleaned) filterState.comm.add(cleaned);
    }
  }

  function writeFiltersToURL() {
    const params = new URLSearchParams();
    params.set('dim', currentDim);

    for (const g of SINGLE_GROUPS) {
      if (filterState[g]) params.set(g, filterState[g]);
    }

    for (const v of filterState.comm) {
      params.append('comm', v);
    }

    const qs = params.toString();
    const newURL = (qs ? '?' + qs : window.location.pathname) + window.location.hash;
    history.replaceState(null, '', newURL);
  }

  /** Check if any filter is active. */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function hasAnyFilter() {
    for (const g of SINGLE_GROUPS) if (filterState[g]) return true;
    if (filterState.comm.size > 0) return true;
    return false;
  }

  // ===========================================================================
  // Product matching
  // ===========================================================================
  function cardMatches(card) {
    // Single-value groups (AND between them)
    for (const g of SINGLE_GROUPS) {
      const want = filterState[g];
      if (!want) continue; // no filter for this group → match
      const attrName = GROUP_TO_ATTR[g];
      const raw = card.getAttribute(attrName);
      if (!raw) return false;
      if (raw.trim().toLowerCase() !== want) return false;
    }

    // Multi-value comm (OR within group)
    if (filterState.comm.size > 0) {
      const raw = card.getAttribute('data-comm');
      if (!raw) return false;
      try {
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return false;
        const lower = arr.map(function (v) {
          return String(v).trim().toLowerCase();
        });
        const match = [...filterState.comm].some(function (v) {
          return lower.includes(v);
        });
        if (!match) return false;
      } catch {
        return false;
      }
    }

    return true;
  }

  /** Check if card matches search term */
  function cardMatchesSearch(card) {
    if (!searchTerm) return true;
    const text = (card.textContent || '').toLowerCase();
    return text.includes(searchTerm);
  }

  // ===========================================================================
  // Apply filters to DOM
  // ===========================================================================
  function applyFilters() {
    const cards = getCards();
    let visible = 0;

    for (const card of cards) {
      if (cardMatches(card) && cardMatchesSearch(card)) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    }

    // Update count
    const countEl = $('#countDisplay');
    if (countEl) countEl.textContent = visible;

    // Toggle empty state
    const emptyEl = $('#emptyState');
    const gridEl = $('#productGrid');
    if (emptyEl) {
      if (visible === 0) {
        emptyEl.classList.remove('hidden');
        if (gridEl) gridEl.classList.add('hidden');
      } else {
        emptyEl.classList.add('hidden');
        if (gridEl) gridEl.classList.remove('hidden');
      }
    }
  }

  // ===========================================================================
  // Chip UI sync
  // ===========================================================================
  function syncChips() {
    $$('.filter-chip').forEach(function (chip) {
      const group = chip.getAttribute('data-group');
      const value = chip.getAttribute('data-value') || '';

      if (!group) return;

      let active = false;

      if (group === 'comm') {
        // Multi-select: active if value is in the set (or empty = all when set is empty)
        if (value === '') {
          active = filterState.comm.size === 0;
        } else {
          active = filterState.comm.has(value);
        }
      } else if (group === 'type' || group === 'subtype' || group === 'sol' || group === 'subsol') {
        // Single-select: active if value matches (empty = all/null)
        if (value === '') {
          active = !filterState[group];
        } else {
          active = filterState[group] === value;
        }
      }

      // Toggle active classes
      if (active) {
        chip.classList.add('active');
        chip.classList.add('bg-primary', 'text-primary-foreground', 'border-primary');
        chip.classList.remove(
          'text-gray-600',
          'dark:text-slate-400',
          'bg-white',
          'dark:bg-slate-800',
          'border-gray-300',
          'dark:border-slate-600',
          'border-blue-200',
          'dark:border-blue-700',
          'bg-blue-50',
          'dark:bg-blue-900/20',
          'text-blue-700',
          'dark:text-blue-300',
          'border-green-200',
          'dark:border-green-700',
          'bg-green-50',
          'dark:bg-green-900/20',
          'text-green-700',
          'dark:text-green-300'
        );
      } else {
        chip.classList.remove('active');
        chip.classList.remove('bg-primary', 'text-primary-foreground', 'border-primary');

        if (group === 'sol') {
          // Eco tags: blue style
          chip.classList.add(
            'bg-blue-50',
            'dark:bg-blue-900/20',
            'text-blue-700',
            'dark:text-blue-300',
            'border-blue-200',
            'dark:border-blue-700'
          );
        } else if (group === 'comm') {
          // Comm tags: green style
          chip.classList.add(
            'bg-green-50',
            'dark:bg-green-900/20',
            'text-green-700',
            'dark:text-green-300',
            'border-green-200',
            'dark:border-green-700'
          );
        } else {
          // Default: gray style
          chip.classList.add(
            'text-gray-600',
            'dark:text-slate-400',
            'bg-white',
            'dark:bg-slate-800',
            'border-gray-300',
            'dark:border-slate-600'
          );
        }
      }
    });

    // Show/hide sub-type sections
    updateSubTypeVisibility();
  }

  /** Show or hide the sub-type chip sections based on current dim and parent selection. */
  function updateSubTypeVisibility() {
    const typeSubFilters = $('#typeSubFilters');
    const solSubFilters = $('#solSubFilters');

    if (currentDim === 'type') {
      // Show type sub-filters if a type is selected
      if (filterState.type && typeSubFilters) {
        typeSubFilters.classList.remove('hidden');
        // Populate sub-type chips dynamically
        populateSubTypeChips('subtype', filterState.type);
      } else if (typeSubFilters) {
        typeSubFilters.classList.add('hidden');
      }
    } else {
      // Show solution sub-filters if a sol is selected
      if (filterState.sol && solSubFilters) {
        solSubFilters.classList.remove('hidden');
        populateSubTypeChips('subsol', filterState.sol);
      } else if (solSubFilters) {
        solSubFilters.classList.add('hidden');
      }
    }
  }

  /** Dynamically generate sub-type chips for a given parent. */
  function populateSubTypeChips(group, parentKey) {
    const containerId = group === 'subtype' ? 'subTypeContainer' : 'solSubContainer';
    const container = $('#' + containerId);
    if (!container) return;

    const taxonomy = getTaxonomy();
    const key =
      group === 'subtype'
        ? taxonomy.typeGroups && taxonomy.typeGroups[parentKey]
        : taxonomy.solutionGroups && taxonomy.solutionGroups[parentKey];

    if (!key || !key.children) return;

    const children = typeof key.children === 'string' ? JSON.parse(key.children) : key.children;
    let html = '';

    for (const [value, label] of Object.entries(children)) {
      const active = filterState[group] === value;
      const activeClass = active
        ? 'bg-primary text-primary-foreground border-primary active'
        : 'border text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 hover:border-primary dark:hover:border-primary';
      html +=
        '<button class="filter-chip px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer ' +
        'transition-all duration-150 ' +
        activeClass +
        '" ' +
        'data-group="' +
        group +
        '" data-value="' +
        value +
        '">' +
        label +
        '</button>';
    }

    container.innerHTML = html;

    // Note: click events are handled by delegation on #filterRow —
    // no need to add individual listeners here.
  }

  // ===========================================================================
  // Dimension tab switching
  // ===========================================================================
  function switchDimension(dim) {
    if (dim === currentDim) return;

    currentDim = dim;

    // Update tab UI
    $$('.dimension-tab').forEach(function (tab) {
      if (tab.getAttribute('data-dim') === dim) {
        tab.classList.add(
          'active',
          'bg-white',
          'dark:bg-slate-700',
          'text-default',
          'dark:text-slate-200',
          'shadow-sm'
        );
        tab.classList.remove('text-gray-600', 'dark:text-slate-400');
      } else {
        tab.classList.remove(
          'active',
          'bg-white',
          'dark:bg-slate-700',
          'text-default',
          'dark:text-slate-200',
          'shadow-sm'
        );
        tab.classList.add('text-gray-600', 'dark:text-slate-400');
      }
    });

    // Show/hide filter dimensions
    const typeFilters = $('#typeFilters');
    const solFilters = $('#solutionFilters');
    if (dim === 'type') {
      if (typeFilters) typeFilters.classList.remove('hidden');
      if (solFilters) solFilters.classList.add('hidden');
    } else {
      if (typeFilters) typeFilters.classList.add('hidden');
      if (solFilters) solFilters.classList.remove('hidden');
    }

    // Reset all filters on dimension switch
    resetFilters();
    writeFiltersToURL();
    syncChips();
    applyFilters();
  }

  function resetFilters() {
    for (const g of SINGLE_GROUPS) filterState[g] = null;
    filterState.comm = new Set();
  }

  // ===========================================================================
  // Chip click handler
  // ===========================================================================
  function handleChipClick(e) {
    // e.target may be a text node (no .closest method) when clicking on chip text
    var el = e.target.closest ? e.target : e.target.parentElement;
    var chip = el ? el.closest('.filter-chip') : null;
    if (!chip) return;

    const group = chip.getAttribute('data-group');
    const value = chip.getAttribute('data-value') || '';

    if (!group) return;

    if (group === 'comm') {
      // Multi-select toggle
      if (value === '') {
        // "All" button clicked — clear comm
        filterState.comm = new Set();
      } else {
        if (filterState.comm.has(value)) {
          filterState.comm.delete(value);
        } else {
          filterState.comm.add(value);
        }
      }
    } else {
      // Single-select groups
      if (value === '') {
        // "All" button clicked
        filterState[group] = null;

        // If clearing a parent, also clear its sub
        if (group === 'type') filterState.subtype = null;
        if (group === 'sol') filterState.subsol = null;
      } else {
        // If toggling the already-selected value, de-select
        if (filterState[group] === value) {
          filterState[group] = null;
          if (group === 'type') filterState.subtype = null;
          if (group === 'sol') filterState.subsol = null;
        } else {
          filterState[group] = value;
          // Clear sub if parent changed
          if (group === 'type') filterState.subtype = null;
          if (group === 'sol') filterState.subsol = null;
        }
      }
    }

    writeFiltersToURL();
    syncChips();
    applyFilters();
  }

  // ===========================================================================
  // Event binding
  // ===========================================================================
  function bindEvents() {
    // Tab clicks
    $$('.dimension-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        switchDimension(tab.getAttribute('data-dim'));
      });
    });

    // Chip clicks (event delegation on filter row)
    var filterRow = $('#filterRow');
    if (filterRow) {
      filterRow.addEventListener('click', handleChipClick);
    }

    // Browser back/forward
    window.addEventListener('popstate', function () {
      readFiltersFromURL();
      syncChips();
      applyFilters();

      // Update dimension tab UI
      $$('.dimension-tab').forEach(function (tab) {
        if (tab.getAttribute('data-dim') === currentDim) {
          tab.classList.add('active', 'bg-white', 'dark:bg-slate-700', 'text-default', 'dark:text-slate-200', 'shadow-sm');
          tab.classList.remove('text-gray-600', 'dark:text-slate-400');
        } else {
          tab.classList.remove('active', 'bg-white', 'dark:bg-slate-700', 'text-default', 'dark:text-slate-200', 'shadow-sm');
          tab.classList.add('text-gray-600', 'dark:text-slate-400');
        }
      });

      var tf = $('#typeFilters');
      var sf = $('#solutionFilters');
      if (currentDim === 'solution') {
        if (tf) tf.classList.add('hidden');
        if (sf) sf.classList.remove('hidden');
      } else {
        if (tf) tf.classList.remove('hidden');
        if (sf) sf.classList.add('hidden');
      }
    });

    // Product search input
    var searchInput = $('#productSearch');
    if (searchInput) {
      var debounceTimer;
      searchInput.addEventListener('input', function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
          searchTerm = (searchInput.value || '').trim().toLowerCase();
          applyFilters();
        }, 200);
      });
    }
  }

  // ===========================================================================
  // Initialization
  // ===========================================================================
  function init() {
    readFiltersFromURL();

    // Apply initial dimension
    $$('.dimension-tab').forEach(function (tab) {
      if (tab.getAttribute('data-dim') === currentDim) {
        tab.classList.add('active', 'bg-white', 'dark:bg-slate-700', 'text-default', 'dark:text-slate-200', 'shadow-sm');
        tab.classList.remove('text-gray-600', 'dark:text-slate-400');
      } else {
        tab.classList.remove('active', 'bg-white', 'dark:bg-slate-700', 'text-default', 'dark:text-slate-200', 'shadow-sm');
        tab.classList.add('text-gray-600', 'dark:text-slate-400');
      }
    });

    var tf = $('#typeFilters');
    var sf = $('#solutionFilters');
    if (currentDim === 'solution') {
      if (tf) tf.classList.add('hidden');
      if (sf) sf.classList.remove('hidden');
    } else {
      if (tf) tf.classList.remove('hidden');
      if (sf) sf.classList.add('hidden');
    }

    syncChips();
    applyFilters();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ===========================================================================
  // Public API
  // ===========================================================================
  window.ProductFilter = {
    getState: function () {
      var s = {};
      for (var i = 0; i < SINGLE_GROUPS.length; i++) {
        var g = SINGLE_GROUPS[i];
        if (filterState[g]) s[g] = filterState[g];
      }
      s.comm = [...filterState.comm];
      s.dim = currentDim;
      return s;
    },
    reset: function () {
      resetFilters();
      writeFiltersToURL();
      syncChips();
      applyFilters();
    },
    refresh: function () {
      applyFilters();
    },
    getCount: function () {
      return $$('.product-card-wrapper').filter(function (c) {
        return !c.classList.contains('hidden');
      }).length;
    },
  };
})();
