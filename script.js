/* ============================================================
   GÜL PERDE VE EV TEKSTİLİ — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     LANGUAGE SYSTEM
  ───────────────────────────────────────────────────────── */
  const TRANSLATIONS = {
    tr: { htmlLang: 'tr', title: 'Gül Perde ve Ev Tekstili | Osmaniye Perdeci | Perde Sistemleri', metaDesc: 'Osmaniye\'nin güvenilir perdecisi Gül Perde ve Ev Tekstili. Zebra perde, stor perde, jaluzi, fon ve tül perde çözümleri. 30 yıllık sektör deneyimi. Ücretsiz keşif, profesyonel montaj. 0555 611 9343' },
    en: { htmlLang: 'en', title: 'Gül Perde — Premium Curtains & Home Textiles | Osmaniye, Turkey', metaDesc: 'Trusted curtain specialist in Osmaniye. Zebra blinds, roller blinds, venetian blinds, blackout & sheer curtains. 30 years\' experience. Free consultation, professional installation.' }
  };

  var currentLang = (localStorage.getItem('gp-lang') || 'tr');

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('gp-lang', lang);

    document.documentElement.lang = TRANSLATIONS[lang].htmlLang;
    document.title = TRANSLATIONS[lang].title;

    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', TRANSLATIONS[lang].metaDesc);

    // Text nodes
    document.querySelectorAll('[data-tr]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (!val) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.tagName === 'BUTTON' && el.classList.contains('faq-q')) {
        el.childNodes[0].textContent = val;
      } else if (el.children.length === 0) {
        el.innerHTML = val;
      } else if (!el.querySelector('svg, img')) {
        el.innerHTML = val;
      }
    });

    // data-placeholder-tr / data-placeholder-en
    document.querySelectorAll('[data-placeholder-tr]').forEach(function (el) {
      var ph = el.getAttribute('data-placeholder-' + lang);
      if (ph) el.placeholder = ph;
    });

    // Select options
    document.querySelectorAll('select option[data-tr]').forEach(function (opt) {
      var val = opt.getAttribute('data-' + lang);
      if (val) opt.textContent = val;
    });

    // Update lang buttons
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      if (lang !== currentLang) applyLang(lang);
    });
  });

  // Apply saved language on load
  if (currentLang !== 'tr') applyLang(currentLang);


  /* ─────────────────────────────────────────────────────────
     HEADER — scroll state
  ───────────────────────────────────────────────────────── */
  var header = document.getElementById('site-header');

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─────────────────────────────────────────────────────────
     MOBILE NAV
  ───────────────────────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var overlay   = document.getElementById('mobile-nav-overlay');
  var navOpen   = false;

  function toggleNav(state) {
    navOpen = state !== undefined ? state : !navOpen;
    hamburger.classList.toggle('open', navOpen);
    hamburger.setAttribute('aria-expanded', navOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', navOpen ? 'Menüyü kapat' : 'Menüyü aç');
    overlay.classList.toggle('open', navOpen);
    overlay.setAttribute('aria-hidden', navOpen ? 'false' : 'true');
    document.body.style.overflow = navOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', function () { toggleNav(); });
  overlay.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleNav(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navOpen) toggleNav(false);
  });


  /* ─────────────────────────────────────────────────────────
     ACTIVE NAV LINK
  ───────────────────────────────────────────────────────── */
  var sections = Array.from(document.querySelectorAll('section[id]'));
  var navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var current = '';
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }


  /* ─────────────────────────────────────────────────────────
     REVEAL ON SCROLL
  ───────────────────────────────────────────────────────── */
  var revealEls = Array.from(document.querySelectorAll('[data-reveal]'));

  // Hide elements via JS (so they remain visible if JS fails)
  revealEls.forEach(function (el) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity .75s cubic-bezier(0.22,1,0.36,1), transform .75s cubic-bezier(0.22,1,0.36,1)';
  });

  // Safety fallback: reveal everything after 4s regardless
  var fallback = setTimeout(function () {
    revealEls.forEach(show);
  }, 4000);

  function show(el) {
    el.classList.add('visible');
    el.style.opacity   = '1';
    el.style.transform = 'none';
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          show(entry.target);
          observer.unobserve(entry.target);
          // If all revealed, clear fallback
          if (revealEls.every(function (el) { return el.classList.contains('visible'); })) {
            clearTimeout(fallback);
          }
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // No IntersectionObserver — show all
    revealEls.forEach(show);
    clearTimeout(fallback);
  }


  /* ─────────────────────────────────────────────────────────
     STAGGERED GRID CHILDREN
  ───────────────────────────────────────────────────────── */
  var STAGGER_SELECTOR = [
    '.products-grid .prod-card',
    '.why-grid .why-card',
    '.reviews-grid .review-card',
    '.gallery-grid .gal-item',
    '.process-steps .process-step',
    '.faq-list .faq-item',
    '.insta-grid .insta-item'
  ].join(', ');

  document.querySelectorAll(STAGGER_SELECTOR).forEach(function (el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity .5s cubic-bezier(0.22,1,0.36,1), transform .5s cubic-bezier(0.22,1,0.36,1)';
  });

  var staggerObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var parent = entry.target;
      var children = Array.from(parent.querySelectorAll(STAGGER_SELECTOR.split(', ').map(function(s){ return s.trim(); }).filter(function(s){ return s.startsWith('.'+parent.className.split(' ')[0]); }).join(', ') || 'article, div[class*="card"], div[class*="item"], div[class*="step"]'));
      // simpler: just get direct staggerable children
      var staggerables = Array.from(parent.children).filter(function(c){
        return c.style.opacity === '0';
      });
      staggerables.forEach(function(child, i){
        setTimeout(function(){
          child.style.opacity = '1';
          child.style.transform = 'none';
        }, i * 80);
      });
      staggerObs.unobserve(parent);
    });
  }, { threshold: 0.05 });

  // Observe parent containers instead
  [
    '.products-grid', '.why-grid', '.reviews-grid',
    '.gallery-grid', '.process-steps', '.faq-list', '.insta-grid'
  ].forEach(function(sel){
    var el = document.querySelector(sel);
    if (el) staggerObs.observe(el);
  });


  /* ─────────────────────────────────────────────────────────
     FAQ ACCORDION
  ───────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var answer   = this.closest('.faq-item').querySelector('.faq-a');

      // Close all
      document.querySelectorAll('.faq-q').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
        var a = b.closest('.faq-item').querySelector('.faq-a');
        if (a) a.classList.remove('open');
      });

      // Open this one (toggle)
      if (!expanded) {
        this.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });


  /* ─────────────────────────────────────────────────────────
     GALLERY LIGHTBOX (simple)
  ───────────────────────────────────────────────────────── */
  function buildLightbox() {
    var lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.style.cssText = [
      'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.92)',
      'display:none;align-items:center;justify-content:center;cursor:zoom-out'
    ].join(';');

    var img = document.createElement('img');
    img.style.cssText = 'max-width:90vw;max-height:88vh;border-radius:4px;object-fit:contain;';
    lb.appendChild(img);

    var close = document.createElement('button');
    close.innerHTML = '&times;';
    close.style.cssText = 'position:absolute;top:20px;right:28px;background:none;border:none;color:#fff;font-size:40px;cursor:pointer;line-height:1;';
    lb.appendChild(close);

    document.body.appendChild(lb);

    function closeLb() {
      lb.style.display = 'none';
      document.body.style.overflow = '';
    }
    close.addEventListener('click', closeLb);
    lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeLb(); });
    return { el: lb, img: img };
  }

  var lightbox = buildLightbox();

  document.querySelectorAll('.gal-item').forEach(function (item) {
    var bg = item.style.backgroundImage;
    if (!bg || bg === 'none') return;
    var url = bg.replace(/url\(['"]?(.*?)['"]?\)/, '$1');

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', item.getAttribute('aria-label') || 'Görseli büyüt');

    function openLb() {
      lightbox.img.src = url;
      lightbox.el.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
    item.addEventListener('click', openLb);
    item.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' ') openLb(); });
  });


  /* ─────────────────────────────────────────────────────────
     CONTACT FORM → WHATSAPP
  ───────────────────────────────────────────────────────── */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = (form.querySelector('[name="name"]')    || {}).value || '';
      var phone   = (form.querySelector('[name="phone"]')   || {}).value || '';
      var city    = (form.querySelector('[name="city"]')    || {}).value || '';
      var product = (form.querySelector('[name="product"]') || {}).value || '';
      var message = (form.querySelector('[name="message"]') || {}).value || '';

      // Basic validation
      if (!name.trim() || !phone.trim()) {
        var alertMsg = currentLang === 'tr'
          ? 'Lütfen ad soyad ve telefon alanlarını doldurun.'
          : 'Please fill in your name and phone number.';
        alert(alertMsg);
        return;
      }

      var isTr = currentLang === 'tr';
      var lines = [
        isTr ? 'Merhaba, web sitenizden size ulaşıyorum.' : 'Hello, I am contacting you through your website.',
        '',
        (isTr ? 'Ad Soyad: '     : 'Name: ')    + name,
        (isTr ? 'Telefon: '      : 'Phone: ')   + phone,
        city    ? (isTr ? 'İl / İlçe: '    : 'City: ')    + city    : '',
        product ? (isTr ? 'İlgilendiğim Ürün: ' : 'Product: ') + product : '',
        message ? (isTr ? 'Mesaj: '         : 'Message: ') + message : ''
      ].filter(Boolean).join('\n');

      var waURL = 'https://wa.me/905556119343?text=' + encodeURIComponent(lines);
      window.open(waURL, '_blank', 'noopener');
    });
  }


  /* ─────────────────────────────────────────────────────────
     SMOOTH SCROLL (for browsers without native support)
  ───────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hdr-h')) || 72;
      window.scrollTo({ top: target.offsetTop - offset + 1, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────────────────────
     FOOTER YEAR
  ───────────────────────────────────────────────────────── */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─────────────────────────────────────────────────────────
     HERO TITLE — html entity fix for innerHTML
  ───────────────────────────────────────────────────────── */
  // Ensure hero title linebreaks render
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle && heroTitle.innerHTML.indexOf('<br>') === -1) {
    heroTitle.innerHTML = heroTitle.innerHTML.replace(/\n/g, '<br>');
  }

})();
