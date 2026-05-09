// shared.js — header, footer, language toggle, and small UI helpers
(function () {
  // Initialize language from localStorage
  const savedLang = localStorage.getItem('mws_lang') || 'en';
  document.documentElement.setAttribute('data-lang', savedLang);

  function setLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    localStorage.setItem('mws_lang', lang);
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.classList.toggle('on', btn.dataset.lang === lang);
    });
  }
  window.setMwsLang = setLang;

  // Inject header
  function buildHeader(active) {
    const items = [
      { href: 'index.html', en: 'Home', vi: 'Trang chủ', key: 'home' },
      { href: 'services.html', en: 'Services', vi: 'Dịch vụ', key: 'services' },
      { href: 'products.html', en: 'Products', vi: 'Sản phẩm', key: 'products' },
      { href: 'gallery.html', en: 'Gallery', vi: 'Thư viện ảnh', key: 'gallery' },
      { href: 'about.html', en: 'About', vi: 'Giới thiệu', key: 'about' },
      { href: 'reviews.html', en: 'Reviews', vi: 'Đánh giá', key: 'reviews' },
      { href: 'contact.html', en: 'Contact', vi: 'Liên hệ', key: 'contact' },
    ];
    const lang = document.documentElement.getAttribute('data-lang') || 'en';
    const navHtml = items.map(it =>
      `<a href="${it.href}" class="${it.key === active ? 'active' : ''}" data-en="${it.en}" data-vi="${it.vi}">${lang === 'vi' ? it.vi : it.en}</a>`
    ).join('');

    return `
    <header class="site-header">
      <div class="header-inner">
        <a href="index.html" class="brand" aria-label="Mississauga Wedding Solutions">
          <span class="brand-mark"><em>M</em></span>
          <span class="brand-text">
            <span class="b1">Mississauga</span>
            <span class="b2">Wedding Solutions</span>
          </span>
        </a>
        <nav class="nav">${navHtml}</nav>
        <div class="header-right">
          <div class="lang-toggle" role="group" aria-label="Language">
            <button data-lang="en" class="${lang === 'en' ? 'on' : ''}">EN</button>
            <button data-lang="vi" class="${lang === 'vi' ? 'on' : ''}">VI</button>
          </div>
          <a href="contact.html" class="btn btn-primary"><span data-en="Book Now" data-vi="Đặt ngay">${lang === 'vi' ? 'Đặt ngay' : 'Book Now'}</span></a>
        </div>
      </div>
    </header>`;
  }

  function buildFooter() {
    const lang = document.documentElement.getAttribute('data-lang') || 'en';
    return `
    <footer class="site-footer">
      <div class="shell">
        <div>
          <div class="brand" style="margin-bottom: 24px;">
            <span class="brand-mark" style="border-color: var(--gold-soft); color: var(--gold-soft);"><em>M</em></span>
            <span class="brand-text">
              <span class="b1" style="color: var(--cream);">Mississauga</span>
              <span class="b2" style="color: rgba(201,165,94,0.7);">Wedding Solutions</span>
            </span>
          </div>
          <p class="f-tag">${lang === 'vi' ? 'Tổ chức đám cưới cổ truyền Việt Nam — nơi văn hóa Á Đông gặp gỡ phương Tây.' : 'Honoring the rituals of a traditional Vietnamese wedding — where East gracefully meets West.'}</p>
          <div style="display: flex; gap: 12px; margin-top: 8px;">
            <a href="#" aria-label="Instagram" style="width:36px;height:36px;border:1px solid rgba(245,235,217,0.2);border-radius:50%;display:grid;place-items:center;">IG</a>
            <a href="#" aria-label="Facebook" style="width:36px;height:36px;border:1px solid rgba(245,235,217,0.2);border-radius:50%;display:grid;place-items:center;">FB</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="services.html">${lang === 'vi' ? 'Dịch vụ' : 'Services'}</a></li>
            <li><a href="products.html">${lang === 'vi' ? 'Sản phẩm' : 'Products'}</a></li>
            <li><a href="gallery.html">${lang === 'vi' ? 'Thư viện ảnh' : 'Gallery'}</a></li>
            <li><a href="about.html">${lang === 'vi' ? 'Giới thiệu' : 'About'}</a></li>
            <li><a href="reviews.html">${lang === 'vi' ? 'Đánh giá' : 'Reviews'}</a></li>
          </ul>
        </div>
        <div>
          <h4>${lang === 'vi' ? 'Liên hệ' : 'Contact'}</h4>
          <ul>
            <li>Mississauga, ON</li>
            <li>(905) 000-0000</li>
            <li>hello@mississaugaweddsols.com</li>
            <li style="margin-top: 8px;"><a href="contact.html" style="color: var(--gold-soft);">${lang === 'vi' ? 'Đặt buổi tư vấn →' : 'Book a consultation →'}</a></li>
          </ul>
        </div>
        <div>
          <h4>${lang === 'vi' ? 'Giờ làm việc' : 'Hours'}</h4>
          <ul>
            <li>${lang === 'vi' ? 'Thứ 2 – Thứ 6' : 'Mon – Fri'}<br/><span style="color: var(--cream);">10am – 7pm</span></li>
            <li>${lang === 'vi' ? 'Thứ 7 – Chủ nhật' : 'Sat – Sun'}<br/><span style="color: var(--cream);">${lang === 'vi' ? 'Theo lịch hẹn' : 'By appointment'}</span></li>
          </ul>
        </div>
      </div>
      <div class="shell">
        <div class="footer-bottom">
          <span>© 2026 Mississauga Wedding Solutions. ${lang === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}</span>
          <span>${lang === 'vi' ? 'Phục vụ cộng đồng Việt tại Greater Toronto Area.' : 'Serving the Vietnamese community across the GTA.'}</span>
        </div>
      </div>
    </footer>`;
  }

  // Apply tweaks from localStorage on load
  function applyTweaks() {
    try {
      const t = JSON.parse(localStorage.getItem('mws_tweaks') || '{}');
      const root = document.documentElement;
      if (t.palette) {
        const palettes = {
          'classic': { red: '#9a1f2c', gold: '#c9a55e', bg: '#fdfaf5' },
          'jade':    { red: '#1f5d4f', gold: '#c9a55e', bg: '#f6f4ee' },
          'plum':    { red: '#6e2740', gold: '#b89968', bg: '#faf5ee' },
          'midnight':{ red: '#9a1f2c', gold: '#d4b370', bg: '#1a1410', ink: '#f5ebd9' },
        };
        const p = palettes[t.palette] || palettes.classic;
        root.style.setProperty('--red', p.red);
        root.style.setProperty('--gold', p.gold);
        root.style.setProperty('--bg', p.bg);
        if (p.ink) {
          root.style.setProperty('--ink', p.ink);
          root.style.setProperty('--ink-soft', 'rgba(245,235,217,0.75)');
          root.style.setProperty('--ink-muted', 'rgba(245,235,217,0.5)');
          root.style.setProperty('--cream', '#2a221c');
          root.style.setProperty('--line', 'rgba(245,235,217,0.1)');
          root.style.setProperty('--line-soft', 'rgba(245,235,217,0.06)');
        }
      }
      if (t.fontPair) {
        const pairs = {
          'cormorant': { serif: '"Cormorant Garamond", Georgia, serif' },
          'fraunces':  { serif: '"Fraunces", Georgia, serif' },
          'playfair':  { serif: '"Playfair Display", Georgia, serif' },
        };
        const p = pairs[t.fontPair];
        if (p) root.style.setProperty('--serif', p.serif);
      }
      if (t.density) {
        root.style.setProperty('--gutter', t.density === 'compact' ? 'clamp(16px, 3vw, 40px)' : 'clamp(20px, 4vw, 56px)');
      }
    } catch (e) { console.warn(e); }
  }

  function init(active) {
    applyTweaks();
    document.body.insertAdjacentHTML('afterbegin', buildHeader(active));
    document.body.insertAdjacentHTML('beforeend', buildFooter());

    // wire up lang toggle
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        setLang(lang);
        // update text in nav and CTAs
        document.querySelectorAll('[data-en][data-vi]').forEach(el => {
          el.textContent = el.dataset[lang];
        });
        // re-build footer for full translation
        const oldFooter = document.querySelector('.site-footer');
        if (oldFooter) {
          oldFooter.outerHTML = buildFooter();
        }
      });
    });
  }

  window.MWS = { init, setLang };
})();
