/* ═══════════════════════════════════════════
   SERGINHO 70 ANOS — Scripts
════════════════════════════════════════════ */

/* ── Forçar topo ao carregar (mobile + desktop) ── */
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
document.addEventListener('DOMContentLoaded', () => window.scrollTo(0, 0));
window.addEventListener('load', () => window.scrollTo(0, 0));

/* ── AOS init ── */
AOS.init({ once: true, duration: 800, easing: 'ease-out-cubic' });

/* ══════════════════════════════════════════
   GALERIA — efeito pop + fundo fosco
══════════════════════════════════════════ */
const veil = document.getElementById('gallery-veil');

// detecta dispositivo touch
const isTouchDevice = () => window.matchMedia('(hover: none) and (pointer: coarse)').matches;

function clearPopped() {
  document.querySelectorAll('.photo-card.popped').forEach(c => c.classList.remove('popped'));
  veil.classList.remove('active');
}

// variáveis para distinguir tap de scroll no mobile
let _touchStartY = 0;
let _touchStartX = 0;
let _touchMoved   = false;

document.querySelectorAll('.photo-card').forEach(card => {

  /* ── Desktop: hover ── */
  card.addEventListener('mouseenter', () => {
    if (isTouchDevice()) return;
    card.classList.add('popped');
    veil.classList.add('active');
  });
  card.addEventListener('mouseleave', () => {
    if (isTouchDevice()) return;
    card.classList.remove('popped');
    veil.classList.remove('active');
  });

  /* ── Mobile: tap (não scroll) ── */
  card.addEventListener('touchstart', e => {
    _touchStartY  = e.touches[0].clientY;
    _touchStartX  = e.touches[0].clientX;
    _touchMoved   = false;
  }, { passive: true });

  card.addEventListener('touchmove', e => {
    const dy = Math.abs(e.touches[0].clientY - _touchStartY);
    const dx = Math.abs(e.touches[0].clientX - _touchStartX);
    if (dy > 8 || dx > 8) _touchMoved = true;
  }, { passive: true });

  card.addEventListener('touchend', () => {
    if (_touchMoved) return;           // foi scroll — ignora
    const wasPopped = card.classList.contains('popped');
    clearPopped();
    if (!wasPopped) {
      card.classList.add('popped');
      veil.classList.add('active');
    }
  }, { passive: true });
});

/* ── Fechar ao clicar no véu ── */
veil.addEventListener('click',      clearPopped);
veil.addEventListener('touchstart', clearPopped, { passive: true });

/* ── Fechar automaticamente ao fazer scroll ── */
window.addEventListener('scroll', () => {
  if (document.querySelector('.photo-card.popped')) clearPopped();
}, { passive: true });

/* ══════════════════════════════════════════
   MENU MOBILE — fullscreen overlay
══════════════════════════════════════════ */
function toggleMenu() {
  const overlay = document.getElementById('mobile-menu-overlay');
  const btn     = document.getElementById('hamburger');
  const isOpen  = overlay.classList.toggle('open');
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// fechar ao pressionar ESC
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('mobile-menu-overlay');
    if (overlay.classList.contains('open')) toggleMenu();
  }
});

/* ══════════════════════════════════════════
   SMOOTH SCROLL — links âncora
══════════════════════════════════════════ */
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();

  // fechar menu mobile se estiver aberto
  const overlay = document.getElementById('mobile-menu-overlay');
  if (overlay.classList.contains('open')) {
    overlay.classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
    document.body.style.overflow = '';
  }

  setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
});

/* ══════════════════════════════════════════
   CONTADOR ANIMADO — 0 → 70
══════════════════════════════════════════ */
function animateCounter(target, duration) {
  const el = document.getElementById('counter');
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}

// Dispara quando o contador entra na tela
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(70, 2000); counterObs.disconnect(); }
  });
}, { threshold: 0.3 });
counterObs.observe(document.getElementById('counter'));

/* ══════════════════════════════════════════
   GALERIA — filtro por abas
══════════════════════════════════════════ */
function filterGallery(cat) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active', 'bg-flared', 'text-white');
    b.classList.add('text-gray-300');
  });
  const activeBtn = document.querySelector(`[data-cat="${cat}"]`);
  if (activeBtn) { activeBtn.classList.add('active'); activeBtn.classList.remove('text-gray-300'); }

  document.querySelectorAll('.gallery-item').forEach(item => {
    const cats = item.dataset.cat || '';
    if (cat === 'todos' || cats.includes(cat)) {
      item.style.display = '';
      item.style.animation = 'fadeIn .4s ease';
    } else {
      item.style.display = 'none';
    }
  });
}

/* ══════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════ */
function openLightbox(card) {
  const img = card.querySelector('img');
  if (!img) return;
  document.getElementById('lightbox-img').src = img.src;
  document.getElementById('lightbox').classList.add('open');
  document.getElementById('lightbox-close').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.getElementById('lightbox-close').style.display = 'none';
  document.body.style.overflow = '';
  clearPopped();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ══════════════════════════════════════════
   WHATSAPP
══════════════════════════════════════════ */
function sendWhatsApp() {
  const msg = encodeURIComponent(
    '🎉🏁 Parabéns, Serginho!! 70 anos com a emoção de Ayrton Senna e a paixão do Flamengo! ' +
    'Muita saúde, alegria e muitas pistas ainda por percorrer! Feliz aniversário, Ginho! ❤️🖤🏎️'
  );
  window.open(`https://wa.me/5521971444414?text=${msg}`, '_blank');
}

/* ══════════════════════════════════════════
   EASTER EGG — escudo do Flamengo
══════════════════════════════════════════ */
function easterEgg() {
  const shield = document.getElementById('fla-shield');
  // para o tremor, aplica glow, depois retoma o tremor
  shield.style.animation = 'none';
  shield.classList.add('glowing');
  setTimeout(() => {
    shield.classList.remove('glowing');
    shield.style.animation = '';
  }, 1800);

  playTorcida();

  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;z-index:9997;pointer-events:none;' +
    'background:linear-gradient(135deg,#C1272D88,#00000088);animation:flashAnim .6s ease forwards;';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 700);

  const toast = document.createElement('div');
  toast.innerHTML = '❤️🖤 URUBU NA VEIA!! MENGÃO!! 🖤❤️';
  toast.style.cssText =
    'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9998;' +
    'font-family:"Racing Sans One",cursive;font-size:clamp(1.5rem,5vw,3rem);' +
    'color:#FFD700;text-shadow:0 0 30px #C1272D;text-align:center;' +
    'pointer-events:none;animation:toastAnim 2s ease forwards;';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2100);

  launchConfetti(30);
}

/* ══════════════════════════════════════════
   WEB AUDIO — torcida simulada
══════════════════════════════════════════ */
function playTorcida() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    for (let i = 0; i < 6; i++) {
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * 0.3;
      const src  = ctx.createBufferSource();
      src.buffer = buf;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.6, now + i * 0.15 + 0.05);
      gain.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.3);
      src.connect(gain);
      gain.connect(ctx.destination);
      src.start(now + i * 0.15);
    }

    const osc     = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now + 0.9);
    osc.frequency.linearRampToValueAtTime(440, now + 1.1);
    osc.frequency.linearRampToValueAtTime(330, now + 1.4);
    oscGain.gain.setValueAtTime(0.2, now + 0.9);
    oscGain.gain.linearRampToValueAtTime(0, now + 1.6);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now + 0.9);
    osc.stop(now + 1.7);
  } catch (e) {
    console.log('Áudio não disponível');
  }
}

/* ══════════════════════════════════════════
   CONFETTI
══════════════════════════════════════════ */
const confettiColors = ['#C1272D', '#FFD700', '#ffffff', '#000000', '#ff6b6b', '#ffd93d'];

function launchConfetti(count = 80) {
  for (let i = 0; i < count; i++) {
    const el   = document.createElement('div');
    el.className = 'confetti-piece';
    const size = Math.random() * 10 + 6;
    el.style.cssText = `
      left:${Math.random() * 100}vw;
      width:${size}px; height:${size}px;
      background:${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
      border-radius:${Math.random() > .5 ? '50%' : '2px'};
      animation-duration:${Math.random() * 2 + 2}s;
      animation-delay:${Math.random() * 0.5}s;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

