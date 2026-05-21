(() => {
  // ===== SCROLL REVEAL =====
  function initReveal() {
    const items = document.querySelectorAll('.reveal:not(.visible)');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('visible'));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 80);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(el => obs.observe(el));
  }

  // ===== TOAST =====
  window.showToast = function (msg, icon = '✅') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${msg}</span>`;
    document.body.appendChild(t);

    setTimeout(() => {
      t.classList.add('hide');
      setTimeout(() => t.remove(), 400);
    }, 3500);
  };

  // ===== CONTACT FORM =====
  function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nombreEl = document.getElementById('c-nombre');
      const emailEl = document.getElementById('c-email');
      const msgEl = document.getElementById('c-mensaje');

      const nombre = nombreEl ? nombreEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const msg = msgEl ? msgEl.value.trim() : '';

      if (!nombre || !email || !msg) {
        showToast('Por favor completa los campos requeridos (*)', '⚠️');
        return;
      }

      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json'
          }
        });

        if (response.ok) {
          showToast(`¡Mensaje enviado, ${nombre}! Te contactaremos pronto.`, '✅');
          form.reset();
        } else {
          showToast('No se pudo enviar el mensaje.', '❌');
        }
      } catch (error) {
        showToast('Error de conexión al enviar el mensaje.', '❌');
      }
    });
  }

  window.enviarContacto = function () {
    const form = document.getElementById('contact-form');

    if (form) {
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
      return;
    }

    const nombreEl = document.getElementById('c-nombre');
    const emailEl = document.getElementById('c-email');
    const msgEl = document.getElementById('c-mensaje');

    const nombre = nombreEl ? nombreEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const msg = msgEl ? msgEl.value.trim() : '';

    if (!nombre || !email || !msg) {
      showToast('Por favor completa los campos requeridos (*)', '⚠️');
      return;
    }

    showToast(`¡Mensaje enviado, ${nombre}! Te contactaremos pronto.`, '✅');
    limpiarContacto();
  };

  window.limpiarContacto = function () {
    const form = document.getElementById('contact-form');
    if (form) {
      form.reset();
      return;
    }

    ['c-nombre', 'c-email', 'c-asunto', 'c-mensaje'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  };

  // ===== NAVIGATION =====
  window.showPage = function (pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      setTimeout(() => initReveal(), 50);
    }

    document.querySelectorAll('[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === pageId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ===== HAMBURGER MENU =====
  window.toggleMenu = function () {
    const hb = document.getElementById('hamburger');
    const mn = document.getElementById('mobileNav');
    if (hb) hb.classList.toggle('open');
    if (mn) mn.classList.toggle('open');
  };

  window.closeMobile = function () {
    const hb = document.getElementById('hamburger');
    const mn = document.getElementById('mobileNav');
    if (hb) hb.classList.remove('open');
    if (mn) mn.classList.remove('open');
  };

  // ===== NAVBAR SCROLL EFFECT =====
  function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  // ===== INIT =====
  function start() {
    initReveal();
    setupNavbarScroll();
    setupContactForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();

function openCamera() {
  document.getElementById('photoInput').capture = 'environment';
  document.getElementById('photoInput').click();
}

function openGallery() {
  document.getElementById('photoInput').capture = '';
  document.getElementById('photoInput').click();
}

function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('preview').innerHTML = `
      <img src="${e.target.result}" style="max-width:100%; max-height:380px; border-radius:8px; margin:10px;">
    `;
  };
  reader.readAsDataURL(file);
}

function sendPhotoWithForm() {
  const file = document.getElementById('photoInput').files[0];
  
  if (file) {
    alert("✅ Formulario y foto recibidos correctamente.\n\nGracias por tu información.");
  } else {
    alert("Formulario enviado. (No se adjuntó foto)");
  }
  
  // Aquí puedes agregar el envío real a Formspree si quieres
}