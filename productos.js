/* ==========================================================
   ASTRIA ACCESS · Catálogo de productos y lista de cotización
   (la misma idea del carrito de Weave, pero sin pago)

   PARA AGREGAR O CAMBIAR UN PRODUCTO: edita solo la lista
   PRODUCTOS de aquí abajo. La página lo dibuja sola.
   No inventes especificaciones ni precios: si no se sabe, déjalo así.
   ========================================================== */

// estado: 'En desarrollo' (ya se trabaja en él), 'Proyectado' (planeado), 'En estudio' (aún por definir)
const PRODUCTOS = [
  {
    id: 'lector-qr',
    nombre: 'Lector de códigos QR',
    categoria: 'Control de acceso',
    estado: 'En desarrollo',
    descripcion: 'Valida los códigos QR temporales de visitantes y residentes en la entrada.',
    ideas: []
  },
  {
    id: 'tarjetas-rfid',
    nombre: 'Tarjetas y chips de proximidad',
    categoria: 'Control de acceso',
    estado: 'En desarrollo',
    descripcion: 'Credenciales físicas para residentes. Si se pierden, el administrador las puede desactivar desde el panel.',
    ideas: ['RFID', 'NFC']
  },
  {
    id: 'controlador',
    nombre: 'Controlador de acceso',
    categoria: 'Control de acceso',
    estado: 'En desarrollo',
    descripcion: 'Recibe la credencial, decide si se permite el paso y activa la apertura.',
    ideas: ['Memoria interna para seguir abriendo sin internet (objetivo de diseño)']
  },
  {
    id: 'barrera',
    nombre: 'Barrera vehicular',
    categoria: 'Control de acceso',
    estado: 'Proyectado',
    descripcion: 'Para parqueaderos y accesos de vehículos. Depende del mecanismo que ya tenga cada propiedad.',
    ideas: []
  },
  {
    id: 'camaras',
    nombre: 'Cámaras de seguridad',
    categoria: 'Videovigilancia',
    estado: 'En estudio',
    descripcion: 'Línea de videovigilancia en estudio. Las características se definirán al elegir proveedor y hacer pruebas.',
    ideas: ['Visión nocturna', 'Detección de movimiento', 'Energía solar']
  }
];

// ---------- Dibujo de las tarjetas ----------
const ICONOS = {
  'Control de acceso': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h2M13 12h2M9 16h6"/></svg>',
  'Videovigilancia': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h13a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H3z"/><path d="M18 11l3-2v6l-3-2"/><path d="M7 15v4M5 19h6"/></svg>'
};

const catalogo = document.getElementById('catalogo');
const filtros = document.getElementById('filtrosProductos');
let categoriaActiva = 'Todos';
let lista = [];   // ids de los productos que el visitante agregó

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

function dibujarFiltros() {
  filtros.replaceChildren();
  ['Todos', ...new Set(PRODUCTOS.map((p) => p.categoria))].forEach((c) => {
    const b = el('button', { type: 'button', clase: 'filtro' + (c === categoriaActiva ? ' activo' : ''), texto: c, 'aria-pressed': String(c === categoriaActiva) });
    b.addEventListener('click', () => { categoriaActiva = c; dibujarFiltros(); dibujarCatalogo(); });
    filtros.append(b);
  });
}

function dibujarCatalogo() {
  catalogo.replaceChildren();
  PRODUCTOS.filter((p) => categoriaActiva === 'Todos' || p.categoria === categoriaActiva).forEach((p) => {
    const agregado = lista.includes(p.id);
    const icono = el('div', { clase: 'producto__icono', 'aria-hidden': 'true' });
    icono.innerHTML = ICONOS[p.categoria] || '';   // íconos propios, no vienen de usuarios

    const boton = el('button', { type: 'button', clase: 'boton boton--pequeno' + (agregado ? ' boton--borde' : ''), texto: agregado ? 'Quitar de mi lista' : 'Agregar a mi lista' });
    boton.addEventListener('click', () => alternar(p.id));

    const hijos = [
      el('div', { clase: 'producto__cabeza' }, [icono, el('span', { clase: 'insignia', texto: p.estado })]),
      el('p', { clase: 'producto__categoria', texto: p.categoria }),
      el('h3', { texto: p.nombre }),
      el('p', { texto: p.descripcion })
    ];
    if (p.ideas.length) {
      const etiquetas = el('ul', { clase: 'producto__ideas', 'aria-label': 'Ideas en estudio' });
      p.ideas.forEach((i) => etiquetas.append(el('li', { texto: i })));
      hijos.push(etiquetas);
    }
    hijos.push(el('p', { clase: 'producto__precio', texto: 'Precio: por cotizar' }), boton);
    catalogo.append(el('article', { clase: 'producto' }, hijos));
  });
}

// ---------- Lista de cotización ----------
const cotBoton = document.getElementById('cotBoton');
const cotPanel = document.getElementById('cotPanel');
const cotLista = document.getElementById('cotLista');
const cotVacia = document.getElementById('cotVacia');
const cotPie = document.getElementById('cotPie');
const cotEstado = document.getElementById('cotEstado');

function alternar(id) {
  lista = lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id];
  actualizar();
}

function actualizar() {
  dibujarCatalogo();
  document.getElementById('cotN').textContent = String(lista.length);
  cotBoton.hidden = lista.length === 0 && cotPanel.hidden;
  cotLista.replaceChildren();
  lista.forEach((id) => {
    const p = PRODUCTOS.find((x) => x.id === id);
    const quitar = el('button', { type: 'button', 'aria-label': 'Quitar ' + p.nombre, texto: '×' });
    quitar.addEventListener('click', () => alternar(id));
    cotLista.append(el('li', {}, [el('span', { texto: p.nombre }), quitar]));
  });
  cotVacia.hidden = lista.length > 0;
  cotPie.hidden = lista.length === 0;
  cotEstado.textContent = '';
  if (lista.length === 0 && !cotPanel.hidden) cotBoton.hidden = false;
}

function abrirPanel(abrir) {
  cotPanel.hidden = !abrir;
  cotBoton.setAttribute('aria-expanded', String(abrir));
  if (abrir) document.getElementById('cotCerrar').focus(); else cotBoton.focus();
}
cotBoton.addEventListener('click', () => abrirPanel(cotPanel.hidden));
document.getElementById('cotCerrar').addEventListener('click', () => abrirPanel(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !cotPanel.hidden) abrirPanel(false); });
document.getElementById('cotVaciar').addEventListener('click', () => { lista = []; actualizar(); });

document.getElementById('cotCopiar').addEventListener('click', async () => {
  const texto = 'Hola, quiero información y cotización de estos productos de Astria Access:\n' +
    lista.map((id) => '- ' + PRODUCTOS.find((x) => x.id === id).nombre).join('\n');
  try {
    await navigator.clipboard.writeText(texto);
    cotEstado.textContent = 'Texto copiado. Pégalo en un correo o mensaje; todavía no se envía automáticamente.';
  } catch (e) {
    cotEstado.textContent = 'No se pudo copiar solo. Selecciona y copia este texto: ' + texto.replace(/\n/g, ' ');
  }
});

dibujarFiltros();
actualizar();
