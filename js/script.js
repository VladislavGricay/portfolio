const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// Hero headline: words rise one by one
const h1 = $('.hero h1');
const text = h1.textContent.trim();
h1.setAttribute('aria-label', text);
h1.innerHTML = text.split(/\s+/).map((w, i) => `<span class="word" aria-hidden="true"><i style="--i:${i}">${w}</i></span> `).join('');

// Scroll progress
const bar = $('.progress');
addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.setProperty('--p', max > 0 ? scrollY / max : 0);
}, { passive: true });

// Endless stack marquee
const track = $('.marquee div');
track.append(...$$('span', track).map(s => { const c = s.cloneNode(true); c.setAttribute('aria-hidden', 'true'); return c; }));

// Reveal cases and services on scroll
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$('.case, .services li').forEach((el, i) => {
  el.classList.add('rv');
  el.style.setProperty('--d', (i % 3) * 0.12 + 's');
  io.observe(el);
});

// 3D tilt on case cards (mouse only)
if (matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches) {
  $$('.case').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 10 + 'deg');
      card.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 10 + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// Case cards: "Детальніше" accordion (each card opens on its own, animated)
$$('.case__toggle').forEach(btn => {
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    btn.firstChild.textContent = open ? 'Детальніше ' : 'Згорнути ';
    panel.classList.toggle('is-open', !open);
  });
});
