/**
 * Lead Capture Modal — client-side logic
 * Three scenarios: price | pdf | case
 * Opens via: window.__openLeadModal({ scenario, productName?, pdfUrl? })
 */
(function () {
  'use strict';

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const SCENARIO_CONFIG = {
    price: {
      icon: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
      iconBg: 'bg-blue-500',
      title: 'Get Base Price',
      subtitle: 'Enter your business email to receive pricing information for {product}.',
      submitLabel: 'Send Pricing Info',
      showCompany: true,
      successMsg: 'We will send pricing details to your email shortly.',
      // No onSuccess redirect — stay on the current page (user correction 2026-08-08:
      // "应该回到原来的页面"). The generic closeModal() runs after the delay.
    },
    pdf: {
      icon: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
      iconBg: 'bg-red-500',
      title: 'Download Datasheet',
      subtitle: 'Enter your business email to download the datasheet for {product}.',
      submitLabel: 'Download PDF',
      showCompany: false,
      successMsg: 'Your download will start automatically.',
      successLink: true,
      onSuccess: function (pdfUrl) {
        if (pdfUrl) {
          var a = document.createElement('a');
          a.href = pdfUrl;
          a.download = '';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      },
    },
    case: {
      icon: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      iconBg: 'bg-purple-500',
      title: 'Download Case Study',
      subtitle: 'Enter your business email to access the full case study for {product}.',
      submitLabel: 'Download Case Study',
      showCompany: true,
      successMsg: 'Your case study will download automatically.',
      onSuccess: function (pdfUrl) {
        if (pdfUrl) {
          const a = document.createElement('a');
          a.href = pdfUrl;
          a.download = '';
          a.click();
        }
      },
    },
  };

  function openModal(config) {
    var scenario = config.scenario || 'price';
    var productName = config.productName || 'this product';
    var pdfUrl = config.pdfUrl || '';
    var cfg = SCENARIO_CONFIG[scenario] || SCENARIO_CONFIG.price;

    // Update UI
    document.getElementById('lead-modal-icon').innerHTML = cfg.icon;
    document.getElementById('lead-modal-icon').className =
      'w-12 h-12 rounded-xl flex items-center justify-center mb-4 ' + cfg.iconBg;
    document.getElementById('lead-modal-title').textContent = cfg.title;
    document.getElementById('lead-modal-subtitle').textContent = cfg.subtitle.replace('{product}', productName);
    document.getElementById('lead-modal-submit').textContent = cfg.submitLabel;
    document.getElementById('lead-modal-success-msg').textContent = cfg.successMsg;

    // Show/hide company field
    var companyGroup = document.getElementById('lead-company-group');
    companyGroup.className = cfg.showCompany ? '' : 'hidden';

    // Reset form
    document.getElementById('lead-modal-form').classList.remove('hidden');
    document.getElementById('lead-modal-success').classList.add('hidden');
    document.getElementById('lead-email').value = '';
    document.getElementById('lead-company').value = '';
    document.getElementById('lead-email-error').classList.add('hidden');

    // Show modal
    document.getElementById('lead-modal').classList.remove('hidden');
    document.getElementById('lead-modal').classList.add('flex');
    setTimeout(function () {
      document.getElementById('lead-email').focus();
    }, 100);

    // Store config for submit handler
    document.getElementById('lead-modal-form')._config = {
      scenario: scenario,
      pdfUrl: pdfUrl,
      productName: productName,
    };
  }

  function closeModal() {
    document.getElementById('lead-modal').classList.add('hidden');
    document.getElementById('lead-modal').classList.remove('flex');
  }

  function showError(msg) {
    var el = document.getElementById('lead-modal-error');
    if (el) {
      el.textContent = msg;
      el.classList.remove('hidden');
    } else {
      alert(msg);
    }
  }

  function clearError() {
    var el = document.getElementById('lead-modal-error');
    if (el) el.classList.add('hidden');
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      var email = document.getElementById('lead-email').value.trim();
      var emailError = document.getElementById('lead-email-error');

      if (!isValidEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.remove('hidden');
        return;
      }
      emailError.classList.add('hidden');
      clearError();

      var config = e.target._config || {};
      var cfg = SCENARIO_CONFIG[config.scenario] || SCENARIO_CONFIG.price;
      var company = (document.getElementById('lead-company') || { value: '' }).value.trim();
      var submitBtn = document.getElementById('lead-modal-submit');

      // Fire GA event (no-op until analytics is enabled)
      if (window.gtag) {
        window.gtag('event', 'lead_capture', {
          scenario: config.scenario,
          product: config.productName,
        });
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      var payload = new FormData();
      payload.append('source', 'lead-modal');
      payload.append('scenario', config.scenario || '');
      payload.append('product', config.productName || '');
      payload.append('email', email);
      payload.append('company', company);
      payload.append('pageUrl', window.location.href);

      // Session tracking (entry referrer, duration, pages, UTM) — never let a
      // tracking failure block the lead submission.
      var track = {};
      try {
        if (typeof window.__leadTrack === 'function') track = window.__leadTrack() || {};
      } catch {
        track = {};
      }
      Object.keys(track).forEach(function (k) {
        if (track[k]) payload.append(k, String(track[k]));
      });

      fetch('/api/contact', {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
      })
        .then(function (res) {
          if (!res.ok) throw new Error('send failed');
        })
        .then(function () {
          // Show success
          document.getElementById('lead-modal-form').classList.add('hidden');
          var successDiv = document.getElementById('lead-modal-success');
          successDiv.classList.remove('hidden');

          // For PDF scenario, add manual download link
          var existingLink = document.getElementById('lead-modal-download-link');
          if (existingLink) existingLink.remove();

          if (cfg.successLink && config.pdfUrl) {
            var linkEl = document.createElement('a');
            linkEl.id = 'lead-modal-download-link';
            linkEl.href = config.pdfUrl;
            linkEl.download = '';
            linkEl.className =
              'inline-flex items-center gap-2 mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity';
            linkEl.innerHTML =
              '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>Click here if download doesn\'t start';
            document.getElementById('lead-modal-success-msg').after(linkEl);
          }

          // Execute success action after delay
          setTimeout(function () {
            if (cfg.onSuccess) cfg.onSuccess(config.pdfUrl);
            closeModal();
          }, 2000);
        })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = cfg.submitLabel;
          showError('Sorry, something went wrong. Please try again, or contact us on WhatsApp.');
        });
    } catch {
      // Defensive: never leave the button stuck on "Sending..." — surface the
      // error inline so the visitor always gets feedback.
      var btn = document.getElementById('lead-modal-submit');
      if (btn) {
        var cfg2 =
          SCENARIO_CONFIG[(e && e.target && e.target._config && e.target._config.scenario) || 'price'] ||
          SCENARIO_CONFIG.price;
        btn.disabled = false;
        btn.textContent = cfg2.submitLabel;
      }
      showError('Something went wrong on this page. Please email info@owon-iot.com or chat on WhatsApp.');
    }
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('lead-modal-close').addEventListener('click', closeModal);
    document.getElementById('lead-modal-backdrop').addEventListener('click', closeModal);
    document.getElementById('lead-modal-form').addEventListener('submit', handleSubmit);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  });

  // Global API
  window.__openLeadModal = openModal;
  window.__closeLeadModal = closeModal;
})();
