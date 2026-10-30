/* ==========================================================
   ASTRIA ACCESS · Panel de demostración
   Todo vive en la memoria del navegador (variables). No hay
   servidor, no hay base de datos y no se guarda nada al recargar.
   Los datos son inventados a propósito.
   ========================================================== */

// ---------- Datos simulados ----------
const datos = {
  residentes: [
    { nombre: 'Residente de ejemplo 1', unidad: 'T1-101', activo: true },
    { nombre: 'Residente de ejemplo 2', unidad: 'T1-204', activo: true },
    { nombre: 'Residente de ejemplo 3', unidad: 'T2-302', activo: true },
    { nombre: 'Residente de ejemplo 4', unidad: 'T2-405', activo: false }
  ],
  credenciales: [
    { id: '0001', titular: 'Residente de ejemplo 1', peatonal: true, vehicular: true, bloqueada: false },
    { id: '0002', titular: 'Residente de ejemplo 2', peatonal: true, vehicular: false, bloqueada: false },
    { id: '0003', titular: 'Residente de ejemplo 3', peatonal: true, vehicular: true, bloqueada: false }
  ],
  eventos: [
    { hora: '07:42', quien: 'Residente de ejemplo 1', metodo: 'Tarjeta', resultado: 'Permitido' },
    { hora: '08:15', quien: 'Visitante de ejemplo', metodo: 'QR', resultado: 'Permitido' },
    { hora: '09:03', quien: 'Código vencido', metodo: 'QR', resultado: 'Denegado' },
    { hora: '10:27', quien: 'Residente de ejemplo 3', metodo: 'Tarjeta', resultado: 'Permitido' },
    { hora: '11:10', quien: 'Tarjeta no registrada', metodo: 'Tarjeta', resultado: 'Denegado' }
  ],
  vehiculos: [
    { placa: 'AAA 000', unidad: 'T1-101', tipo: 'Automóvil', activo: true },
    { placa: 'BBB 111', unidad: 'T2-302', tipo: 'Motocicleta', activo: true },
    { placa: 'CCC 222', unidad: 'T2-405', tipo: 'Automóvil', activo: false }
  ],
  visitantes: []
};

// ---------- Utilidades ----------
// Crea elementos de forma segura: usa textContent, así lo que escriba
// una persona nunca se interpreta como código HTML.
function el(etiqueta, props = {}, hijos = []) {
  const nodo = document.createElement(etiqueta);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'texto') nodo.textContent = v;
    else if (k === 'clase') nodo.className = v;
    else nodo.setAttribute(k, v);
  });
  hijos.forEach((h) => nodo.append(h));
  return nodo;
}
const $ = (id) => document.getElementById(id);
const estadoPill = (ok, si, no) => el('span', { clase: 'estado ' + (ok ? 'estado--ok' : 'estado--no'), texto: ok ? si : no });
const limpiar = (nodo) => { while (nodo.firstChild) nodo.removeChild(nodo.firstChild); };

// ---------- Navegación entre vistas ----------
const botones = document.querySelectorAll('#panelMenu button');
const vistas = document.querySelectorAll('.vista');

function mostrarVista(nombre) {
  vistas.forEach((v) => { v.hidden = v.id !== 'vista-' + nombre; });
  botones.forEach((b) => {
    const activo = b.dataset.vista === nombre;
    b.classList.toggle('activo', activo);
    if (activo) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  $('panelContenido').focus({ preventScroll: true });
}
botones.forEach((b) => b.addEventListener('click', () => mostrarVista(b.dataset.vista)));

// ---------- Dibujo de cada vista ----------
function dibujarResumen() {
  const permitidos = datos.eventos.filter((e) => e.resultado === 'Permitido').length;
  const denegados = datos.eventos.length - permitidos;
  const items = [
    [datos.residentes.filter((r) => r.activo).length, 'Residentes activos'],
    [datos.visitantes.length, 'Autorizaciones de visita creadas'],
    [permitidos, 'Ingresos permitidos hoy'],
    [denegados, 'Ingresos denegados hoy']
  ];
  const caja = $('metricas'); limpiar(caja);
  items.forEach(([n, t]) => caja.append(el('div', { clase: 'metrica' }, [el('b', { texto: String(n) }), el('span', { texto: t })])));

  const lista = $('resumenEventos'); limpiar(lista);
  datos.eventos.slice(-4).reverse().forEach((e) => {
    lista.append(el('li', {}, [
      el('span', { texto: e.hora + ' · ' + e.quien + ' (' + e.metodo + ')' }),
      estadoPill(e.resultado === 'Permitido', 'Permitido', 'Denegado')
    ]));
  });
}

function dibujarResidentes() {
  const cuerpo = $('tbResidentes'); limpiar(cuerpo);
  datos.residentes.forEach((r) => cuerpo.append(el('tr', {}, [
    el('td', { texto: r.nombre }), el('td', { texto: r.unidad }),
    el('td', {}, [estadoPill(r.activo, 'Activo', 'Inactivo')])
  ])));
}

function dibujarCredenciales() {
  const cuerpo = $('tbCredenciales'); limpiar(cuerpo);
  datos.credenciales.forEach((c) => {
    const celda = (campo, etiqueta) => {
      const caja = el('input', { type: 'checkbox', clase: 'interruptor', 'aria-label': etiqueta + ' de la credencial ' + c.id });
      caja.checked = c[campo];
      caja.disabled = c.bloqueada;
      caja.addEventListener('change', () => { c[campo] = caja.checked; });
      return el('td', {}, [caja]);
    };
    // Bloquear al instante una tarjeta perdida: la función más pedida en la encuesta (50 %)
    const accion = el('button', { type: 'button', clase: 'boton boton--pequeno' + (c.bloqueada ? ' boton--borde' : ''), texto: c.bloqueada ? 'Reactivar' : 'Bloquear por pérdida' });
    accion.addEventListener('click', () => { c.bloqueada = !c.bloqueada; dibujarCredenciales(); });
    cuerpo.append(el('tr', {}, [
      el('td', { texto: c.id }), el('td', { texto: c.titular }),
      celda('peatonal', 'Permiso peatonal'), celda('vehicular', 'Permiso vehicular'),
      el('td', {}, [estadoPill(!c.bloqueada, 'Activa', 'Bloqueada')]), el('td', {}, [accion])
    ]));
  });
}

function dibujarEventos() {
  const filtro = $('filtroEventos').value;
  const cuerpo = $('tbEventos'); limpiar(cuerpo);
  datos.eventos.filter((e) => filtro === 'todos' || e.resultado === filtro).forEach((e) => {
    cuerpo.append(el('tr', {}, [
      el('td', { texto: e.hora }), el('td', { texto: e.quien }), el('td', { texto: e.metodo }),
      el('td', {}, [estadoPill(e.resultado === 'Permitido', 'Permitido', 'Denegado')])
    ]));
  });
}

function dibujarVehiculos() {
  const cuerpo = $('tbVehiculos'); limpiar(cuerpo);
  datos.vehiculos.forEach((v) => cuerpo.append(el('tr', {}, [
    el('td', { texto: v.placa }), el('td', { texto: v.unidad }), el('td', { texto: v.tipo }),
    el('td', {}, [estadoPill(v.activo, 'Autorizado', 'Sin permiso')])
  ])));
}

// QR ilustrativo: un patrón de cuadros calculado a partir del código. No es un QR real.
function qrIlustrativo(codigo) {
  const n = 9;
  let semilla = 0;
  for (const c of codigo) semilla = (semilla * 31 + c.charCodeAt(0)) >>> 0;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + (n + 2) + ' ' + (n + 2));
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Código QR ilustrativo, no escaneable');
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      semilla = (semilla * 1664525 + 1013904223) >>> 0;
      const esquina = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
      if (esquina || semilla % 100 < 48) {
        const r = document.createElementNS(ns, 'rect');
        r.setAttribute('x', x + 1); r.setAttribute('y', y + 1);
        r.setAttribute('width', 1); r.setAttribute('height', 1);
        r.setAttribute('fill', '#071B33');
        svg.append(r);
      }
    }
  }
  return svg;
}

function dibujarVisitantes() {
  const caja = $('listaVisitantes'); limpiar(caja);
  if (datos.visitantes.length === 0) {
    caja.append(el('p', { clase: 'vista__ayuda', texto: 'Aún no hay autorizaciones. Crea la primera con el formulario.' }));
    return;
  }
  datos.visitantes.forEach((v) => {
    caja.append(el('div', { clase: 'tarjeta-visita' }, [
      qrIlustrativo(v.codigo),
      el('div', {}, [
        el('strong', { texto: v.nombre }),
        el('span', { texto: 'Destino: ' + v.unidad }),
        el('small', { texto: 'Código: ' }),
        el('small', { texto: 'Vigencia: ' + v.horas + (v.horas === 1 ? ' hora' : ' horas') })
      ])
    ]));
    // el código se agrega aparte para mostrarlo en formato de código
    const ult = caja.lastChild.querySelector('small');
    ult.append(el('code', { texto: v.codigo }));
  });
}

function dibujarTodo() {
  dibujarResumen(); dibujarResidentes(); dibujarVisitantes();
  dibujarCredenciales(); dibujarEventos(); dibujarVehiculos();
}

// ---------- Formularios de la demostración ----------
$('formResidente').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = $('resNombre').value.trim();
  const unidad = $('resUnidad').value.trim();
  if (nombre.length < 2 || unidad.length < 1) { $('errResidente').textContent = 'Escribe el nombre y la unidad.'; return; }
  $('errResidente').textContent = '';
  datos.residentes.push({ nombre, unidad, activo: true });
  e.target.reset();
  dibujarResidentes(); dibujarResumen();
});

$('formVisitante').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = $('visNombre').value.trim();
  const unidad = $('visUnidad').value.trim();
  if (nombre.length < 2 || unidad.length < 1) { $('errVisitante').textContent = 'Escribe el nombre del visitante y el destino.'; return; }
  $('errVisitante').textContent = '';
  const codigo = 'AX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  datos.visitantes.unshift({ nombre, unidad, horas: Number($('visHoras').value), codigo });
  e.target.reset();
  $('visHoras').value = '2';
  dibujarVisitantes(); dibujarResumen();
});

$('filtroEventos').addEventListener('change', dibujarEventos);

$('formConfig').addEventListener('submit', (e) => {
  e.preventDefault();
  $('estadoConfig').textContent = 'Guardado solo en esta pantalla de demostración. No se almacenó en ningún servidor.';
});

// El módulo de vehículos se puede ocultar desde Configuración
$('cfgVehiculos').addEventListener('change', (e) => {
  const boton = document.querySelector('#panelMenu [data-vista="vehiculos"]');
  boton.hidden = !e.target.checked;
  if (!e.target.checked && !$('vista-vehiculos').hidden) mostrarVista('configuracion');
});

dibujarTodo();
