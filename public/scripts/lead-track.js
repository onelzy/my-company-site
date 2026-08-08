/**
 * lead-track.js — session-level visitor tracking for lead submissions.
 *
 * Records, per browsing session (sessionStorage):
 *   - entry referrer (the site/page the visitor came FROM)
 *   - entry landing URL
 *   - session start time, current page load time
 *   - page-view counter
 *   - UTM params (if the entry URL carries them)
 *
 * Exposes window.__leadTrack() which returns all fields at submit time;
 * the lead-capture modal and the contact form append them to the POST body.
 * Pure client-side, no cookies, no third-party calls — zero SEO impact.
 */
(function () {
  'use strict';

  function setItem(key, value) {
    try {
      sessionStorage.setItem(key, String(value));
    } catch {
      /* storage unavailable (private mode etc.) — ignore */
    }
  }

  function getItem(key, fallback) {
    try {
      return sessionStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }

  // Entry referrer: only the FIRST referrer of the session counts.
  if (!getItem('owon_ref', '')) {
    setItem('owon_ref', document.referrer || 'direct');
    setItem('owon_entry', window.location.href);
    setItem('owon_t0', String(Date.now()));
  }

  // Page counter + current page load timestamp.
  var pages = parseInt(getItem('owon_pages', '0'), 10) + 1;
  setItem('owon_pages', String(pages));
  setItem('owon_page_t0', String(Date.now()));

  function fmtDuration(sec) {
    sec = Math.max(0, Math.round(sec));
    if (sec >= 60) return Math.floor(sec / 60) + 'm' + (sec % 60) + 's';
    return sec + 's';
  }

  window.__leadTrack = function () {
    var now = Date.now();
    var t0 = parseInt(getItem('owon_t0', String(now)), 10);
    var pt0 = parseInt(getItem('owon_page_t0', String(now)), 10);
    var params = new URLSearchParams(window.location.search);
    var out = {
      referrer: getItem('owon_ref', 'direct'),
      entryUrl: getItem('owon_entry', window.location.href),
      timeOnSiteSec: Math.max(0, Math.round((now - t0) / 1000)),
      timeOnPageSec: Math.max(0, Math.round((now - pt0) / 1000)),
      pagesViewed: parseInt(getItem('owon_pages', '1'), 10),
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
    };
    // Keep the payload compact.
    out.timeOnSite = fmtDuration(out.timeOnSiteSec);
    out.timeOnPage = fmtDuration(out.timeOnPageSec);
    return out;
  };
})();
