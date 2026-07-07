/**
 * Lead Capture Modal — Client-side logic.
 *
 * Open via: window.__openLeadModal({ scenario: 'price' | 'pdf' | 'case', ... })
 *
 * Three scenarios:
 *   price — Email + Company → redirect to /contact-sales with email prefilled
 *   pdf   — Email only → auto-download file, then redirect
 *   case  — Email + Company → auto-download, then redirect
 */
(function () {
  'use strict';

  const overlay = document.getElementById('leadCaptureOverlay');
  const sheet = document.getElementById('leadCaptureSheet');
  const titleEl = document.getElementById('leadCaptureTitle');
  const companyRow = document.getElementById('leadCaptureCompanyRow');
  const companyInput = document.getElementById('leadCaptureCompany');
  const emailInput = document.getElementById('leadCaptureEmail');
  const errorEl = document.getElementById('leadCaptureError');
  const submitBtn = document.getElementById('leadCaptureSubmit');
  const closeBtn = document.getElementById('leadCaptureClose');
  const formArea = submitBtn?.parentElement;
  const successDiv = document.getElementById('leadCaptureSuccess');
  const successMsg = document.getElementById('leadCaptureSuccessMsg');

  let currentConfig = null;

  function isValidBusinessEmail(email) {
    // Reject free email providers for B2B
    const freeDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'mail.com',
      'protonmail.com',
      'qq.com',
      '163.com',
      '126.com',
    ];
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    if (freeDomains.includes(domain)) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function show() {
    if (!overlay) return;
    overlay.classList.remove('hidden');
    // Force reflow then animate
    void overlay.offsetWidth;
    overlay.classList.add('flex');
    if (sheet) {
      setTimeout(() => {
        sheet.classList.remove('translate-y-full', 'sm:scale-95');
        sheet.classList.add('translate-y-0', 'sm:scale-100');
      }, 10);
    }
  }

  function hide() {
    if (!overlay || !sheet) return;
    sheet.classList.add('translate-y-full', 'sm:scale-95');
    sheet.classList.remove('translate-y-0', 'sm:scale-100');
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
    }, 300);
  }

  function showSuccess(message) {
    if (!formArea || !successDiv) return;
    formArea.classList.add('hidden');
    successDiv.classList.remove('hidden');
    if (successMsg) successMsg.textContent = message || 'Redirecting...';
  }

  function resetForm() {
    if (emailInput) emailInput.value = '';
    if (companyInput) companyInput.value = '';
    if (errorEl) errorEl.classList.add('hidden');
    if (formArea) formArea.classList.remove('hidden');
    if (successDiv) successDiv.classList.add('hidden');
  }

  function open(config) {
    currentConfig = config;
    const scenario = config.scenario || 'price';

    if (titleEl)
      titleEl.textContent =
        {
          price: 'Unlock Base Price',
          pdf: 'Please enter your work email to download',
          case: 'Get the Full Case Study PDF',
        }[scenario] || 'Unlock Content';

    // Show/hide company field
    const needsCompany = scenario === 'price' || scenario === 'case';
    if (companyRow) companyRow.classList.toggle('hidden', !needsCompany);

    if (submitBtn) {
      submitBtn.textContent = scenario === 'pdf' ? 'Download Now' : 'Submit & Continue';
    }

    resetForm();
    show();
  }

  async function handleSubmit() {
    const email = emailInput?.value?.trim() || '';
    const company = companyInput?.value?.trim() || '';
    const scenario = currentConfig?.scenario || 'price';

    // Validate
    if (!email || !isValidBusinessEmail(email)) {
      if (errorEl) errorEl.classList.remove('hidden');
      return;
    }
    if (errorEl) errorEl.classList.add('hidden');

    const needsCompany = scenario === 'price' || scenario === 'case';
    if (needsCompany && !company) {
      if (companyInput) companyInput.focus();
      return;
    }

    // Track lead (fire-and-forget to analytics endpoint if available)
    try {
      if (window.gtag) {
        window.gtag('event', 'lead_capture', {
          scenario: scenario,
          product: currentConfig?.productName || '',
        });
      }
    } catch {
      /* ignore */
    }

    // Handle per-scenario
    if (scenario === 'pdf' || scenario === 'case') {
      // Auto-download
      const pdfUrl = currentConfig?.pdfUrl;
      if (pdfUrl) {
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      showSuccess(pdfUrl ? 'Your download has started.' : 'Thank you!');
      setTimeout(() => {
        hide();
        resetForm();
      }, 2000);
    } else {
      // price scenario: redirect to contact-sales with email prefilled
      showSuccess('Taking you to our sales team...');
      setTimeout(() => {
        const params = new URLSearchParams();
        if (email) params.set('email', email);
        if (company) params.set('company', company);
        window.location.href = '/contact-sales?' + params.toString();
      }, 800);
    }
  }

  // Event bindings
  if (closeBtn) closeBtn.addEventListener('click', hide);
  if (overlay)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) hide();
    });
  if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
  if (emailInput) {
    emailInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });
    emailInput.addEventListener('input', () => {
      if (errorEl) errorEl.classList.add('hidden');
    });
  }
  if (companyInput) {
    companyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
      hide();
    }
  });

  // Export global API
  window.__openLeadModal = open;
})();
