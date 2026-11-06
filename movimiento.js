/* ==========================================================
   ASTRIA ACCESS · Movimiento
   Barra de progreso, encabezado que se compacta, lector que
   escanea, cifras que cuentan, luz sobre las tarjetas y
   escalonado de apariciones. Sin librerías. Si la persona pidió
   reducir el movimiento, solo se mantiene la barra y el encabezado.
   ========================================================== */
(function () {
  'use strict';

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); };

  // 1. Barra de progreso, encabezado compacto y parallax suave (un solo listener)
  var barra = document.createElement('div');
  barra.className = 'progreso';
  barra.setAttribute('aria-hidden', 'true');
  document.body.appendChild(barra);
  var encabezado = document.querySelector('.encabezado');
  var hero = document.querySelector('.hero');
  var pendiente = false;

  function actualizar() {
    pendiente = false;
    var y = window.scrollY || 0;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.setProperty('--p', max > 0 ? Math.min(1, y / max) : 0);
    if (encabezado) encabezado.classList.toggle('encabezado--scroll', y > 24);
    if (hero && !reducido && y < 1400) hero.style.setProperty('--py', (y * -0.12) + 'px');
  }
  window.addEventListener('scroll', function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(actualizar); }
  }, { passive: true });
  actualizar();

  if (reducido || !('IntersectionObserver' in window)) return;

  // 2. Más elementos que aparecen al hacer scroll, con escalonado
  var extras = '.seccion__cabecera > *, .faq__item, .comparativa tbody tr, .comparativa__titulo, ' +
               '.comparativa__nota, .compromiso, .cifras__lista li';
  var observador = new IntersectionObserver(function (entradas, obs) {
    entradas.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  $$(extras).forEach(function (n) {
    if (!n.classList.contains('aparece')) {
      n.classList.add('aparece');
      observador.observe(n);
    }
  });
  // El retraso se reparte por grupos de hasta 4 hermanos (de izquierda a derecha)
  var contador = new Map();
  $$('.aparece').forEach(function (n) {
    var p = n.parentElement;
    var i = contador.get(p) || 0;
    n.style.setProperty('--i', i % 4);
    contador.set(p, i + 1);
  });

  // 3. El lector del inicio escanea y muestra "Acceso permitido"
  $$('.qr').forEach(function (qr) {
    var caja = document.createElement('div');
    caja.className = 'qr-caja';
    qr.parentNode.insertBefore(caja, qr);
    caja.appendChild(qr);
  });

  var lector = document.querySelector('.lector');
  var texto = lector && lector.querySelector('.lector__texto');
  var fila = document.querySelector('.panel__fila');
  if (lector && texto && hero) {
    var original = Array.prototype.slice.call(texto.childNodes);
    var visible = true;
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(hero);

    var ciclo = function () {
      if (visible && !document.hidden) {
        lector.classList.remove('lector--ok');
        texto.replaceChildren.apply(texto, original);
        setTimeout(function () { if (visible) texto.textContent = 'Verificando…'; }, 2600);
        setTimeout(function () {
          if (!visible) return;
          lector.classList.add('lector--ok');
          texto.textContent = 'Acceso\npermitido';
          if (fila) {
            fila.classList.add('panel__fila--destello');
            setTimeout(function () { fila.classList.remove('panel__fila--destello'); }, 1400);
          }
        }, 3400);
      }
      setTimeout(ciclo, 7000);
    };
    setTimeout(ciclo, 1400);
  }

  // 4. Cifras que cuentan hacia arriba ("5 de 10")
  $$('.cifras__lista strong').forEach(function (s) {
    var m = /^(\d+)\s+de\s+(\d+)$/.exec(s.textContent.trim());
    if (!m) return;
    var meta = Number(m[1]);
    var total = m[2];
    var lectura = document.createElement('span');
    lectura.className = 'solo-lectores';
    lectura.textContent = s.textContent.trim();
    s.setAttribute('aria-hidden', 'true');
    s.parentNode.insertBefore(lectura, s.nextSibling);
    s.textContent = '0 de ' + total;
    new IntersectionObserver(function (es, obs) {
      if (!es[0].isIntersecting) return;
      obs.disconnect();
      var inicio = null;
      (function paso(t) {
        if (inicio === null) inicio = t;
        var k = Math.min(1, (t - inicio) / 1200);
        var suave = 1 - Math.pow(1 - k, 3);
        s.textContent = Math.round(meta * suave) + ' de ' + total;
        if (k < 1) requestAnimationFrame(paso);
      })(performance.now());
    }, { threshold: 0.6 }).observe(s);
  });

  // 5. Luz que sigue al cursor e inclinación de la tarjeta de ejemplo
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch' || !e.target.closest) return;
    var t = e.target.closest('.tarjeta, .razon, .servicio, .alcance__col, .compromiso');
    if (t) {
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }
    var c = e.target.closest('.demo__tarjeta');
    if (c) {
      var b = c.getBoundingClientRect();
      c.style.setProperty('--ry', (((e.clientX - b.left) / b.width - 0.5) * 12) + 'deg');
      c.style.setProperty('--rx', ((0.5 - (e.clientY - b.top) / b.height) * 10) + 'deg');
    }
  }, { passive: true });
  $$('.demo__tarjeta').forEach(function (c) {
    c.addEventListener('pointerleave', function () {
      c.style.setProperty('--rx', '0deg');
      c.style.setProperty('--ry', '0deg');
    });
  });

  // 6. Registro "en vivo" de ejemplo (todo simulado)
  var lista = document.getElementById('vivoLista');
  var horaEl = document.getElementById('vivoHora');
  if (lista) {
    var EVENTOS = [
      ['ok', 'Visitante autorizado', 'QR temporal · Torre 1, Apto 512'],
      ['ok', 'Residente ingresó', 'Tarjeta 0017 · Puerta vehicular'],
      ['no', 'Tarjeta bloqueada', 'Tarjeta 0031 · Acceso rechazado'],
      ['ok', 'Visitante autorizado', 'QR temporal · Torre 2, Apto 208'],
      ['no', 'Código vencido', 'QR de visita · Acceso rechazado'],
      ['ok', 'Residente ingresó', 'Tarjeta 0042 · Puerta peatonal']
    ];
    var n = 0, hh = 8, mm = 12, visibleVivo = false;
    new IntersectionObserver(function (es) { visibleVivo = es[0].isIntersecting; }).observe(lista);
    var pintarHora = function () { horaEl.textContent = hh + ':' + (mm < 10 ? '0' : '') + mm; };
    setInterval(function () {
      if (!visibleVivo || document.hidden) return;
      var d = EVENTOS[n % EVENTOS.length]; n++;
      mm++; if (mm > 59) { mm = 0; hh = hh % 12 + 1; } pintarHora();
      $$('time', lista).forEach(function (t, i) { t.textContent = i === 0 ? 'hace 1 min' : 'hace ' + (i * 2 + 1) + ' min'; });
      var li = document.createElement('li');
      li.className = 'vivo__ev vivo__ev--' + d[0] + ' vivo__ev--nuevo';
      var ico = document.createElement('span'); ico.className = 'vivo__ico'; ico.setAttribute('aria-hidden', 'true'); ico.textContent = d[0] === 'ok' ? '✓' : '!';
      var box = document.createElement('div');
      var b = document.createElement('b'); b.textContent = d[1];
      var sm = document.createElement('small'); sm.textContent = d[2];
      box.appendChild(b); box.appendChild(sm);
      var t = document.createElement('time'); t.textContent = 'ahora';
      li.appendChild(ico); li.appendChild(box); li.appendChild(t);
      lista.insertBefore(li, lista.firstChild);
      while (lista.children.length > 3) lista.removeChild(lista.lastChild);
    }, 3800);
  }
})();
