(function () {
  'use strict';
  if (window.__siteMeasurementLoaded) return;
  window.__siteMeasurementLoaded = true;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === '1') return;
  var script = document.currentScript;
  var measurementId = script && script.getAttribute('data-ga-id');
  var site = script && script.getAttribute('data-site');
  if (!/^G-[A-Z0-9]+$/.test(measurementId || '') || !/^(midsizeai|healthandtravels)$/.test(site || '')) return;
  var sources = {
    'chatgpt.com': 'chatgpt', 'chat.openai.com': 'chatgpt', 'chatgpt': 'chatgpt',
    'perplexity.ai': 'perplexity', 'perplexity': 'perplexity',
    'claude.ai': 'claude', 'claude': 'claude',
    'gemini.google.com': 'gemini', 'gemini': 'gemini',
    'copilot.microsoft.com': 'copilot', 'copilot': 'copilot'
  };
  function sourceFor(value) {
    var key = (value || '').toLowerCase().replace(/^www\./, '');
    return Object.prototype.hasOwnProperty.call(sources, key) ? sources[key] : null;
  }
  var taggedSource = sourceFor(new URLSearchParams(location.search).get('utm_source'));
  var referringSource = null;
  try { referringSource = sourceFor(new URL(document.referrer).hostname); } catch (_) {}
  var source = taggedSource || referringSource;
  var evidence = taggedSource ? 'utm_source' : referringSource ? 'referrer' : null;
  var safeLocation = location.origin + location.pathname;
  var safeReferrer = '';
  try { safeReferrer = new URL(document.referrer).origin; } catch (_) {}
  // Use the existing property; initialize only on pages without a Google tag.
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { page_location: safeLocation, page_referrer: safeReferrer });
    var loader = document.createElement('script');
    loader.async = true;
    loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(loader);
  }
  function send(name, extra) {
    window.gtag('event', name, Object.assign({
      send_to: measurementId, site_name: site,
      page_location: safeLocation, page_referrer: safeReferrer,
      page_path: location.pathname, transport_type: 'beacon'
    }, extra || {}));
  }
  if (source) send('ai_referral_visit', { ai_platform: source, attribution_evidence: evidence });
  // Record navigation intent only. No form values, estimate text, query strings or link text.
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (!/^https?:$/.test(url.protocol)) return;
    var host = url.hostname.toLowerCase();
    var action = null;
    if (site === 'midsizeai') {
      if (['midsizeai.com', 'www.midsizeai.com', 'homeowner.midsizeai.com'].includes(host) && /^\/estimate-decoder\/?$/.test(url.pathname)) action = 'estimate_decoder_open';
      else if (host === 'apply.midsizeai.com' && url.pathname === '/application') action = 'contractor_audit_handoff';
      else if (['midsizeai.com', 'www.midsizeai.com', 'homeowner.midsizeai.com'].includes(host) && url.pathname.startsWith('/downloads/')) action = 'resource_download_click';
    } else {
      if (host === 'sage.healthandtravels.com') action = 'sage_planner_handoff';
      else if (host === 'newsletter.healthandtravels.com') action = 'newsletter_handoff';
      else if (host === 'join.arizonahikersassociation.org') action = 'aha_membership_handoff';
    }
    if (action) send('site_action', { action_name: action });
  });
  document.addEventListener('site:measurement', function (event) {
    var action = event.detail && event.detail.action;
    var allowed = site === 'midsizeai'
      ? ['estimate_review_completed', 'estimate_sample_completed'] : ['outing_saved'];
    if (allowed.includes(action)) send(action);
  });
}());
