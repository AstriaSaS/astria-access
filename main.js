/* ==========================================================
   ASTRIA ACCESS · JavaScript
   Aquí vive lo que se mueve: el menú del celular, el enlace
   activo del menú y la validación del formulario.
   ========================================================== */

// ---------- 1. Menú para celulares ----------
const botonMenu = document.getElementById('menuBoton');
const menu = document.getElementById('menu');

function cerrarMenu() {
  menu.classList.remove('abierto');
  botonMenu.setAttribute('aria-expanded', 'false');
  botonMenu.setAttribute('aria-label', 'Abrir menú');
}

botonMenu.addEventListener('click', () => {
  const abierto = menu.classList.toggle('abierto');
  botonMenu.setAttribute('aria-expanded', String(abierto));
  botonMenu.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
});

// Al tocar un enlace del menú, se cierra
menu.querySelectorAll('a').forEach((enlace) => enlace.addEventListener('click', cerrarMenu));

// Con la tecla Escape también se cierra
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarMenu(); });


// ---------- 2. Resaltar en el menú la sección que se está viendo ----------
const secciones = document.querySelectorAll('main section[id]');
const enlacesMenu = document.querySelectorAll('.menu a[href^="#"]:not(.boton)');

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      enlacesMenu.forEach((a) => {
        a.classList.toggle('activo', a.getAttribute('href') === '#' + entrada.target.id);
      });
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });

secciones.forEach((s) => observador.observe(s));


// ---------- 2b. Aparición suave de tarjetas al hacer scroll ----------
// Si el navegador no soporta esto o JavaScript falla, todo se ve normal.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('js');
  const aparecer = new IntersectionObserver((entradas, obs) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.tarjeta, .servicio, .pasos li, .identidad__bloque, .equipo li, .demo, .cifras, .alcance__col, .razon').forEach((n) => {
    n.classList.add('aparece');
    aparecer.observe(n);
  });
}


// ---------- 3. Formulario de contacto (envío con EmailJS) ----------
// Mientras estos tres datos estén vacíos, el formulario es una DEMOSTRACIÓN:
// valida pero no envía nada, y lo dice con claridad.
// Para activarlo, crea tu cuenta en emailjs.com y pega aquí los tres datos
// (los pasos están en el README.md). Son datos públicos por diseño; no son contraseñas.
const EMAILJS = {
  serviceId: 'service_yrwajbc',
  templateId: 'template_3f0blgf',
  publicKey: 'pvL7AYhgf5yw-ZlJF'
};
const EMAIL_ACTIVO = Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey);

const formulario = document.getElementById('formulario');
const estado = document.getElementById('formularioEstado');
let ultimoEnvio = 0;

// Si el envío está activo, ya no es una demostración: ocultamos ese aviso
if (EMAIL_ACTIVO) { const aviso = document.getElementById('avisoDemo'); if (aviso) aviso.hidden = true; }

function mostrarError(campo, texto) {
  const aviso = formulario.querySelector('[data-error-para="' + campo.id + '"]');
  if (aviso) aviso.textContent = texto;
  campo.classList.toggle('invalido', texto !== '');
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();      // evita que la página se recargue
  estado.textContent = '';
  let hayErrores = false;

  const nombre = formulario.elements.nombre;
  const correo = formulario.elements.correo;
  const mensaje = formulario.elements.mensaje;
  const consentimiento = formulario.elements.consentimiento;

  if (nombre.value.trim().length < 2) { mostrarError(nombre, 'Escribe tu nombre.'); hayErrores = true; }
  else mostrarError(nombre, '');

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());
  if (!correoValido) { mostrarError(correo, 'Escribe un correo válido, por ejemplo nombre@dominio.com.'); hayErrores = true; }
  else mostrarError(correo, '');

  if (mensaje.value.trim().length < 10) { mostrarError(mensaje, 'Cuéntanos un poco más (mínimo 10 caracteres).'); hayErrores = true; }
  else mostrarError(mensaje, '');

  if (!consentimiento.checked) { mostrarError(consentimiento, 'Debes autorizar el uso de tus datos para poder enviar la solicitud.'); hayErrores = true; }
  else mostrarError(consentimiento, '');

  if (hayErrores) return;

  // Trampa anti-spam: las personas no ven ese campo, los robots sí lo llenan
  if (formulario.elements.sitio.value !== '') return;

  // Sin EmailJS configurado: no fingimos que se envió.
  if (!EMAIL_ACTIVO) {
    estado.textContent = 'Los datos están completos, pero este formulario es una demostración y no envió tu mensaje. Escríbenos al correo indicado.';
    return;
  }

  // Un envío cada 30 segundos, para evitar clics repetidos
  if (Date.now() - ultimoEnvio < 30000) {
    estado.textContent = 'Ya enviaste una solicitud hace un momento. Espera unos segundos antes de enviar otra.';
    return;
  }

  const boton = formulario.querySelector('button[type="submit"]');
  boton.disabled = true;
  estado.textContent = 'Enviando…';
  try {
    const respuesta = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS.serviceId,
        template_id: EMAILJS.templateId,
        user_id: EMAILJS.publicKey,
        template_params: {
          nombre: nombre.value.trim(),
          correo: correo.value.trim(),
          tipo: formulario.elements.tipo.value,
          unidades: formulario.elements.unidades.value,
          rol: formulario.elements.rol.value,
          mensaje: mensaje.value.trim()
        }
      })
    });
    if (!respuesta.ok) throw new Error('Respuesta ' + respuesta.status);
    ultimoEnvio = Date.now();
    estado.textContent = 'Solicitud enviada. Gracias por escribirnos, te responderemos pronto.';
    formulario.reset();
  } catch (error) {
    estado.textContent = 'No pudimos enviar el mensaje. Inténtalo de nuevo en un momento o escríbenos al correo indicado.';
  } finally {
    boton.disabled = false;
  }
});


// ---------- 4. Año del pie de página ----------
document.getElementById('anio').textContent = new Date().getFullYear();
