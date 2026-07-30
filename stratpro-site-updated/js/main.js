// ============ Global contact number ============
const oldPhone = '+91 98861 67801';
const newPhone = '+91 98865 87801';
document.querySelectorAll('[href="tel:+919886167801"]').forEach((link) => {
  link.href = 'tel:+919886587801';
});
const phoneWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const phoneNodes = [];
while (phoneWalker.nextNode()) phoneNodes.push(phoneWalker.currentNode);
phoneNodes.forEach((node) => {
  if (node.nodeValue.includes(oldPhone)) node.nodeValue = node.nodeValue.replaceAll(oldPhone, newPhone);
});

// ============ Header scroll state ============
const header = document.getElementById('siteHeader');
if (header) {
  const update = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// ============ Mobile menu toggle ============
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ============ Ticker (infinite scroll) — duplicate the inner track ============
const ticker = document.getElementById('ticker');
if (ticker) {
  const inner = ticker.innerHTML;
  ticker.innerHTML = inner + inner;
}
const clientsTicker = document.getElementById('clientsTicker');
if (clientsTicker) {
  const inner = clientsTicker.innerHTML;
  clientsTicker.innerHTML = inner + inner;
}

// ============ Reveal on scroll ============
const reveals = document.querySelectorAll('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('in'));
}

// ============ Services tabs ============
const tabSidebar = document.getElementById('tabSidebar');
if (tabSidebar) {
  const buttons = tabSidebar.querySelectorAll('button');
  const panels = document.querySelectorAll('.tab-panel');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => p.classList.toggle('active', p.getAttribute('data-panel') === target));
      window.scrollTo({ top: tabSidebar.closest('section').offsetTop - 80, behavior: 'smooth' });
    });
  });
}

// ============ Contact form ============
const contactForm = document.getElementById('contactForm');
const formView = document.getElementById('formView');
const formSuccess = document.getElementById('formSuccess');
const resetForm = document.getElementById('resetForm');

if (contactForm) {
  const setErr = (el, msg) => {
    let next = el.parentElement.querySelector('.err');
    if (!next) {
      next = document.createElement('span');
      next.className = 'err';
      next.style.cssText = 'color:#c0392b;font-size:0.85rem;display:block;margin-top:0.35rem;';
      el.parentElement.appendChild(next);
    }
    next.textContent = msg;
  };
  const clearErrs = () => {
    contactForm.querySelectorAll('.err').forEach(n => n.remove());
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrs();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    let ok = true;
    if (!data.fullName || data.fullName.trim().length < 2) { setErr(contactForm.fullName, 'Name is required'); ok = false; }
    if (!data.phone || data.phone.trim().length < 10) { setErr(contactForm.phone, 'Valid phone number is required'); ok = false; }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setErr(contactForm.email, 'Valid email is required'); ok = false; }
    if (!data.segment) { setErr(contactForm.segment, 'Please select an interest'); ok = false; }
    if (!data.message || data.message.trim().length < 10) { setErr(contactForm.message, 'Please provide more details'); ok = false; }
    if (!ok) return;

    const segmentLabels = {
      'residential': 'Residential AC / Air Purifier',
      'light-commercial': 'Light Commercial System',
      'commercial-applied': 'Commercial Chiller / Applied',
      'projects': 'Project Contracting',
      'aftermarket': 'Annual Maintenance / Aftermarket Support',
      'energy-audit': 'Energy Audit / Retrofit'
    };
    const subject = `Website Enquiry — ${data.fullName}`;
    const body =
      `Name: ${data.fullName}\n` +
      `Phone: ${data.phone}\n` +
      `Email: ${data.email}\n` +
      `Interested in: ${segmentLabels[data.segment] || data.segment}\n\n` +
      `Message:\n${data.message}`;
    const mailtoLink = `mailto:info@stratprosolutions.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    formView.style.display = 'none';
    formSuccess.classList.add('show');
  });
}

if (resetForm) {
  resetForm.addEventListener('click', () => {
    contactForm.reset();
    formView.style.display = '';
    formSuccess.classList.remove('show');
  });
}
