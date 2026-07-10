/**
 * Lead Capture Modal — client-side logic
 * Three scenarios: price | pdf | case
 * Opens via: window.__openLeadModal({ scenario, productName?, pdfUrl? })
 */
(function () {
  'use strict';

  const FREE_DOMAINS = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
    'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
    'qq.com', '163.com', '126.com', 'sina.com', 'sohu.com',
  ];

  function isValidBusinessEmail(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain && !FREE_DOMAINS.includes(domain) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      onSuccess: function () { window.location.href = '/contact-sales'; },
    },
    pdf: {
      icon: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
      iconBg: 'bg-red-500',
      title: 'Download Datasheet',
      subtitle: 'Enter your business email to download the datasheet for {product}.',
      submitLabel: 'Download PDF',
      showCompany: false,
      successMsg: 'Your download will start automatically.',
      onSuccess: function (pdfUrl) { if (pdfUrl) { const a = document.createElement('a'); a.href = pdfUrl; a.download = ''; a.click(); } },
    },
    case: {
      icon: '<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
      iconBg: 'bg-purple-500',
      title: 'Download Case Study',
      subtitle: 'Enter your business email to access the full case study for {product}.',
      submitLabel: 'Download Case Study',
      showCompany: true,
      successMsg: 'Your case study will download automatically.',
      onSuccess: function (pdfUrl) { if (pdfUrl) { const a = document.createElement('a'); a.href = pdfUrl; a.download = ''; a.click(); } },
    },
  };

  function openModal(config) {
    var scenario = config.scenario || 'price';
    var productName = config.productName || 'this product';
    var pdfUrl = config.pdfUrl || '';
    var cfg = SCENARIO_CONFIG[scenario] || SCENARIO_CONFIG.price;

    // Update UI
    document.getElementById('lead-modal-icon').innerHTML = cfg.icon;
    document.getElementById('lead-modal-icon').className = 'w-12 h-12 rounded-xl flex items-center justify-center mb-4 ' + cfg.iconBg;
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
    document.getElementById('lead-modal-form')._config = { scenario: scenario, pdfUrl: pdfUrl, productName: productName };
  }

  function closeModal() {
    document.getElementById('lead-modal').classList.add('hidden');
    document.getElementById('lead-modal').classList.remove('flex');
  }

  function handleSubmit(e) {
    e.preventDefault();
    var email = document.getElementById('lead-email').value.trim();
    var emailError = document.getElementById('lead-email-error');

    if (!isValidBusinessEmail(email)) {
      emailError.classList.remove('hidden');
      return;
    }
    emailError.classList.add('hidden');

    var config = e.target._config || {};

    // Fire GA event
    if (window.gtag) {
      window.gtag('event', 'lead_capture', {
        scenario: config.scenario,
        product: config.productName,
      });
    }

    // Show success
    document.getElementById('lead-modal-form').classList.add('hidden');
    document.getElementById('lead-modal-success').classList.remove('hidden');

    // Execute success action after delay
    setTimeout(function () {
      var cfg = SCENARIO_CONFIG[config.scenario];
      if (cfg && cfg.onSuccess) {
        cfg.onSuccess(config.pdfUrl);
      }
      closeModal();
    }, 2000);
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
