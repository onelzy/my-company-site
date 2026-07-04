/**
 * Client-side Product Filter — vanilla JS
 *
 * Implements AND/OR filtering with URL parameter synchronization via
 * history.replaceState. Multiple values for the same key = OR logic;
 * different keys = AND logic.
 *
 * URL format:  ?type=smart-meters&comm=zigbee&comm=wifi&eco=tuya
 *
 * Supported filter keys:
 *   type, subtype, sol, subsol, comm, eco, tag, sw
 *
 * Exports a global `ProductFilter` object for external control.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  /** Filter keys recognised in the URL query string. */
  const FILTER_KEYS = ['type', 'subtype', 'sol', 'subsol', 'comm', 'eco', 'tag', 'sw'];

  /**
   * Maps a URL filter key to the data-attribute on product-card-wrapper
   * elements. Scalar attributes hold a single value; array attributes hold
   * a JSON array.
   */
  const KEY_TO_DATA_ATTR = {
    type: 'data-product-type',
    subtype: 'data-product-subtype',
    sol: 'data-tech-solution',
    subsol: 'data-tech-subtype',
    comm: 'data-comm',
    eco: 'data-eco',
    tag: 'data-tags',
    sw: 'data-sw',
  };

  /** Keys whose product data attributes contain JSON arrays. */
  const ARRAY_KEYS = new Set(['comm', 'eco', 'tag', 'sw']);

  // ---------------------------------------------------------------------------
  // DOM Selectors (queried lazily so the script can be loaded in <head>)
  // ---------------------------------------------------------------------------

  function getProductWrappers() {
    return document.querySelectorAll('.product-card-wrapper');
  }

  function getFilterSidebar() {
    return document.querySelector('.product-filter');
  }

  function getProductCount() {
    return document.querySelector('.product-count');
  }

  function getEmptyState() {
    return document.querySelector('.product-empty-state');
  }

  function getFilterCheckboxes() {
    return document.querySelectorAll('.filter-checkbox');
  }

  // ---------------------------------------------------------------------------
  // Read / Write filter state from / to URL
  // ---------------------------------------------------------------------------

  /**
   * Parse the current URL search params into a filter-state object.
   * @returns {{ [key: string]: string[] }}
   */
  function readFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const state = {};

    for (const key of FILTER_KEYS) {
      const values = params.getAll(key);
      if (values.length > 0) {
        // Normalise: lowercase, trim, drop empties, deduplicate
        const cleaned = [
          ...new Set(
            values
              .map(function (v) {
                return v.trim().toLowerCase();
              })
              .filter(Boolean)
          ),
        ];
        if (cleaned.length > 0) {
          state[key] = cleaned;
        }
      }
    }

    return state;
  }

  /**
   * Sync the current filter state into the URL via history.replaceState (no
   * page reload). Clears params that have no values.
   */
  function writeFiltersToURL(filterState) {
    const params = new URLSearchParams();

    for (const key of FILTER_KEYS) {
      const values = filterState[key];
      if (values && values.length > 0) {
        for (const v of values) {
          params.append(key, v);
        }
      }
    }

    const newSearch = params.toString();
    const newURL =
      (newSearch ? '?' + newSearch : window.location.pathname) +
      window.location.hash;

    history.replaceState(null, '', newURL);
  }

  // ---------------------------------------------------------------------------
  // Checkbox synchronisation
  // ---------------------------------------------------------------------------

  /**
   * Read the checked state of all filter checkboxes and return a filter-state
   * object (with lowercase values).
   */
  function readFiltersFromCheckboxes() {
    const state = {};
    const checkboxes = getFilterCheckboxes();

    for (const cb of checkboxes) {
      const group = cb.getAttribute('data-filter-group');
      const value = cb.getAttribute('data-filter-value');

      if (!group || !value) continue;
      if (!cb.checked) continue;

      const key = group.toLowerCase();
      const val = value.trim().toLowerCase();

      if (!FILTER_KEYS.includes(key)) continue;

      if (!state[key]) state[key] = [];
      state[key].push(val);
    }

    return state;
  }

  /**
   * Set checkbox checked state to match the given filter-state object.
   * Also manages sub-type checkbox visibility based on parent type selection.
   */
  function syncCheckboxesToState(filterState) {
    const checkboxes = getFilterCheckboxes();

    // Build a quick lookup set for parent types that are active
    const activeParentTypes = new Set(filterState.type || []);

    for (const cb of checkboxes) {
      const group = (cb.getAttribute('data-filter-group') || '').toLowerCase();
      const value = (cb.getAttribute('data-filter-value') || '').trim().toLowerCase();
      const parent = cb.getAttribute('data-filter-parent');

      if (!group || !value || !FILTER_KEYS.includes(group)) continue;

      // Determine checked state
      const selectedValues = filterState[group] || [];
      cb.checked = selectedValues.includes(value);

      // Manage sub-type visibility
      if (parent) {
        const parentValue = parent.trim().toLowerCase();
        const wrapper = cb.closest('.filter-subtype-group, .filter-option');
        const shouldShow = activeParentTypes.size === 0 || activeParentTypes.has(parentValue);

        if (wrapper) {
          wrapper.classList.toggle('hidden', !shouldShow);
        } else if (cb.parentElement) {
          cb.parentElement.classList.toggle('hidden', !shouldShow);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Matching logic
  // ---------------------------------------------------------------------------

  /**
   * Determine whether a single product wrapper matches the given filter state.
   *
   * AND across groups: the product must match EVERY active group.
   * OR within a group: the product matches if it has ANY of the selected values.
   */
  function productMatchesFilter(wrapper, filterState) {
    const activeKeys = Object.keys(filterState).filter(function (k) {
      return filterState[k] && filterState[k].length > 0;
    });

    // No active filters → show everything
    if (activeKeys.length === 0) return true;

    for (const key of activeKeys) {
      const selectedValues = filterState[key];
      const attrName = KEY_TO_DATA_ATTR[key];

      if (!attrName) continue;

      const raw = wrapper.getAttribute(attrName);
      if (!raw) return false; // missing attribute → no match

      let match = false;

      if (ARRAY_KEYS.has(key)) {
        // Array attribute — parse JSON, check for intersection
        let arr;
        try {
          arr = JSON.parse(raw);
        } catch (_e) {
          return false; // malformed JSON attribute
        }
        if (!Array.isArray(arr)) return false;

        const lowercased = arr.map(function (v) {
          return String(v).trim().toLowerCase();
        });
        match = selectedValues.some(function (sv) {
          return lowercased.includes(sv);
        });
      } else {
        // Scalar attribute — direct (case-insensitive) comparison
        const normalized = raw.trim().toLowerCase();
        match = selectedValues.includes(normalized);
      }

      if (!match) return false; // AND — one group failed
    }

    return true;
  }

  // ---------------------------------------------------------------------------
  // Apply filters to the DOM
  // ---------------------------------------------------------------------------

  /** Debounce helper — cancels a pending animation frame. */
  let _applyRAF = null;

  /**
   * Main entry point: read current filter state (either from arg or URL),
   * show/hide product cards, update count, toggle empty state.
   *
   * Debounced via requestAnimationFrame so rapid checkbox clicks collapse
   * into a single DOM update.
   */
  function applyFilters(filterState) {
    if (_applyRAF) {
      cancelAnimationFrame(_applyRAF);
    }

    _applyRAF = requestAnimationFrame(function () {
      const state = filterState || readFiltersFromURL();
      const wrappers = getProductWrappers();
      let visibleCount = 0;

      for (const wrapper of wrappers) {
        if (productMatchesFilter(wrapper, state)) {
          wrapper.classList.remove('hidden');
          visibleCount++;
        } else {
          wrapper.classList.add('hidden');
        }
      }

      // Update product count element
      const countEl = getProductCount();
      if (countEl) {
        countEl.textContent = visibleCount;
      }

      // Toggle empty state
      const emptyEl = getEmptyState();
      if (emptyEl) {
        emptyEl.classList.toggle('hidden', visibleCount > 0);
      }

      // Sync checkboxes (so back/forward resets visuals correctly)
      syncCheckboxesToState(state);

      // Dispatch a custom event so other scripts can react
      document.dispatchEvent(
        new CustomEvent('product-filter:updated', {
          detail: { visibleCount, total: wrappers.length, filters: state },
        })
      );
    });
  }

  // ---------------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------------

  /**
   * Handle a checkbox change: build state from checked boxes, write to URL,
   * then re-apply filters.
   */
  function handleCheckboxChange() {
    const state = readFiltersFromCheckboxes();
    writeFiltersToURL(state);
    applyFilters(state);
  }

  /** Handle popstate (browser back/forward). */
  function handlePopState() {
    applyFilters(readFiltersFromURL());
  }

  // ---------------------------------------------------------------------------
  // Initialisation
  // ---------------------------------------------------------------------------

  function init() {
    const sidebar = getFilterSidebar();

    // 1. Sync checkboxes to match initial URL state
    const initialState = readFiltersFromURL();
    syncCheckboxesToState(initialState);

    // 2. Apply initial filter
    applyFilters(initialState);

    // 3. Listen for checkbox changes (event delegation on the sidebar)
    if (sidebar) {
      sidebar.addEventListener('change', function (e) {
        const target = e.target;
        if (
          target &&
          target.tagName === 'INPUT' &&
          target.type === 'checkbox' &&
          target.classList.contains('filter-checkbox')
        ) {
          handleCheckboxChange();
        }
      });
    } else {
      // Fallback: listen on the whole document
      document.addEventListener('change', function (e) {
        const target = e.target;
        if (
          target &&
          target.tagName === 'INPUT' &&
          target.type === 'checkbox' &&
          target.classList.contains('filter-checkbox')
        ) {
          handleCheckboxChange();
        }
      });
    }

    // 4. Listen for browser back/forward
    window.addEventListener('popstate', handlePopState);
  }

  // ---------------------------------------------------------------------------
  // Public API (attached to window.ProductFilter)
  // ---------------------------------------------------------------------------

  /**
   * @typedef {Object} ProductFilterAPI
   * @property {function(): Object}        getState     — current filter state
   * @property {function(Object): void}    setState     — replace filter state, update URL & DOM
   * @property {function(): void}          reset        — clear all filters
   * @property {function(): number}        getCount     — number of currently visible products
   * @property {function(): void}          refresh      — re-apply filters (useful after DOM mutations)
   */

  window.ProductFilter = {
    /** Return a copy of the current filter state (from URL). */
    getState: function () {
      return readFiltersFromURL();
    },

    /**
     * Replace the filter state entirely. Accepts an object like
     * { type: ['smart-meters'], comm: ['zigbee','wifi'] }.
     */
    setState: function (newState) {
      writeFiltersToURL(newState);
      syncCheckboxesToState(newState);
      applyFilters(newState);
    },

    /** Clear all filters. */
    reset: function () {
      writeFiltersToURL({});
      syncCheckboxesToState({});
      applyFilters({});
    },

    /** Return the count of currently visible (non-hidden) product cards. */
    getCount: function () {
      const wrappers = getProductWrappers();
      let count = 0;
      for (const w of wrappers) {
        if (!w.classList.contains('hidden')) count++;
      }
      return count;
    },

    /** Re-apply filters (e.g. after dynamically adding/removing product cards). */
    refresh: function () {
      applyFilters(readFiltersFromURL());
    },
  };

  // ---------------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
