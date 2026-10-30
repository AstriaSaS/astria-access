/* ==========================================================
   ASTRIA ACCESS · App de demostración (residente y portero)
   Todo vive en la memoria del navegador: no hay servidor, no hay
   cuentas y no se envía ni se guarda nada. Los códigos son de mentira
   y no sirven para entrar a ningún lugar.
   ========================================================== */

// ---------- Utilidades ----------
// Crea elementos con textContent: lo que escriba una persona nunca se interpreta como HTML.
function el(etiqueta, props = {}, hijos = []) {
  const nodo = document.createElement(etiqueta);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'texto') nodo.textContent = v;
    else if (k === 'clase') nodo.className = v;
    else if (k === 'alClick') nodo.addEventListener('click', v);
    else nodo.setAttribute(k, v);
  });
  hijos.forEach((h) => nodo.append(h));
  return nodo;
}
const $ = (id) => document.getElementById(id);
const limpiar = (n) => { while (n.firstChild) n.removeChild(n.firstChild); };
const boton = (texto, clase, alClick, extra = {}) => el('button', Object.assign({ type: 'button', clase: 'ap-boton ' + (clase || ''), texto, alClick }, extra));

// QR ilustrativo: un patrón de cuadros calculado a partir del código. No es un QR real.
function qrIlustrativo(codigo) {
  const n = 11;
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

// ---------- Estado compartido ----------
const NOMBRE = 'Residente de ejemplo';
const UNIDAD = 'T2-A201';
const estadoInicial = () => ({
  pantalla: 'login', cedula: '', ultima: null,
  tarjetaBloqueada: false, confirmarBloqueo: false,
  visitas: [], eventos: [], desfaseH: 0, resultado: null, contador: 0
});
let E = estadoInicial();

const ahora = () => new Date(Date.now() + E.desfaseH * 3600 * 1000);
const hhmm = (d) => d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

function estadoVisita(v) {
  if (v.usada) return 'Ingresó';
  return ahora().getTime() > v.vence ? 'Vencida' : 'Pendiente';
}

function codigoNuevo() {
  // Solo para la demostración: no es seguro y no se usa para nada real.
  const letras = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 6; i++) c += letras[Math.floor(Math.random() * letras.length)];
  return c.slice(0, 3) + '-' + c.slice(3);
}

function registrar(texto, resultado, ok) {
  E.eventos.unshift({ hora: hhmm(ahora()), texto, resultado, ok });
  dibujarRegistro();
}

function aviso(contenedor, texto) {
  const a = el('div', { clase: 'ap-aviso', role: 'status', texto });
  contenedor.append(a);
  a.scrollIntoView({ block: 'nearest' });
  setTimeout(() => a.remove(), 3200);
}

function chipVisita(v) {
  const e = estadoVisita(v);
  const clase = e === 'Pendiente' ? 'pend' : e === 'Ingresó' ? 'ok' : 'gris';
  return el('span', { clase: 'ap-chip ap-chip--' + clase, texto: e });
}

function compartir(v, contenedor) {
  const texto = 'Código de visita ' + v.codigo + ', válido hasta las ' + hhmm(new Date(v.vence)) + '. (Mensaje de demostración)';
  try { if (navigator.clipboard) navigator.clipboard.writeText(texto).catch(() => {}); } catch (e) { /* sin portapapeles */ }
  aviso(contenedor, 'Así se compartiría: el mensaje de ejemplo se copió.');
}

// ---------- Celular del residente ----------
function cabecera(titulo, sub, atras) {
  const hijos = [];
  if (atras) hijos.push(el('button', { type: 'button', clase: 'ap-atras', texto: '← Volver', alClick: atras }));
  hijos.push(el('div', { clase: 'ap-marca' }, [el('img', { src: 'logo-aguila.png', alt: '', width: '28', height: '23' }), el('span', { texto: 'ASTRIA ACCESS' })]));
  hijos.push(el('h3', { texto: titulo }));
  if (sub) hijos.push(el('p', { texto: sub }));
  return el('div', { clase: 'ap-cab' }, hijos);
}

function dibujarResidente() {
  const c = $('telResidente'); limpiar(c);
  const ir = (p) => () => { E.pantalla = p; E.confirmarBloqueo = false; dibujarTodo(); };
  const wrap = (cab, cuerpo) => { c.append(cab, el('div', { clase: 'ap-cuerpo' }, cuerpo)); c.scrollTop = 0; };

  if (E.pantalla === 'login') {
    const entrada = el('input', { id: 'cedula', type: 'text', inputmode: 'numeric', maxlength: '12', autocomplete: 'off', 'aria-describedby': 'notaCedula' });
    const entrar = boton('Ingresar', '', () => { E.cedula = ''; E.pantalla = 'codigo'; dibujarTodo(); }, { disabled: 'disabled' });
    entrada.addEventListener('input', () => { entrada.value = entrada.value.replace(/\D/g, ''); entrar.disabled = !/^\d{5,12}$/.test(entrada.value); });
    entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !entrar.disabled) entrar.click(); });
    wrap(cabecera('Entra a tu conjunto', 'Invita visitantes, revisa quién entró y cuida tu tarjeta desde el celular.'), [
      el('div', { clase: 'ap-campo' }, [
        el('label', { for: 'cedula', texto: 'Número de identificación' }), entrada,
        el('span', { clase: 'ap-nota', id: 'notaCedula', texto: 'Demostración: escribe cualquier número de 5 a 12 dígitos. No uses tu número real; no se guarda.' })
      ]),
      entrar
    ]);
    return;
  }

  if (E.pantalla === 'codigo') {
    const entrada = el('input', { id: 'codigoIn', clase: 'ap-codigo', type: 'text', inputmode: 'numeric', maxlength: '6', autocomplete: 'off', 'aria-describedby': 'notaCodigo' });
    const ok = boton('Confirmar', '', ir('inicio'), { disabled: 'disabled' });
    entrada.addEventListener('input', () => { entrada.value = entrada.value.replace(/\D/g, ''); ok.disabled = entrada.value.length !== 6; });
    entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !ok.disabled) ok.click(); });
    wrap(cabecera('Escribe el código', 'Verificamos que seas tú.', ir('login')), [
      el('div', { clase: 'ap-campo' }, [
        el('label', { for: 'codigoIn', texto: 'Código de 6 dígitos' }), entrada,
        el('span', { clase: 'ap-nota', id: 'notaCodigo', texto: 'En la versión real, el código llegaría por correo o WhatsApp. Aquí escribe cualquier código de 6 dígitos.' })
      ]),
      ok
    ]);
    return;
  }

  if (E.pantalla === 'inicio') {
    const lista = el('ul', { clase: 'ap-lista' });
    E.visitas.slice(0, 5).forEach((v) => {
      const pend = estadoVisita(v) === 'Pendiente';
      lista.append(el('li', { clase: 'ap-visita' }, [
        el('span', {}, [el('b', { texto: v.nombre }), el('small', { texto: v.codigo + ' · hasta ' + hhmm(new Date(v.vence)) })]),
        el('span', {}, [chipVisita(v)].concat(pend ? [' ', boton('Compartir', 'ap-boton--borde ap-boton--chico', () => compartir(v, c))] : []))
      ]));
    });
    const vacio = E.visitas.length === 0 ? [el('p', { clase: 'ap-nota', texto: 'Todavía no has invitado a nadie. Toca «Invitar» para crear el primer código.' })] : [];
    wrap(cabecera('Hola, ' + NOMBRE, 'Apartamento ' + UNIDAD), [
      el('button', { type: 'button', clase: 'ap-tile ap-tile--principal', alClick: ir('invitar') }, [el('strong', { texto: 'Invitar' }), el('span', { texto: 'Crea un código para tu visitante' })]),
      el('div', { clase: 'ap-dos', style: 'margin-top:.6rem' }, [
        el('button', { type: 'button', clase: 'ap-tile', alClick: ir('tarjeta') }, [el('strong', { texto: 'Mi tarjeta' }), el('span', { texto: E.tarjetaBloqueada ? 'Bloqueada' : 'Activa' })]),
        el('button', { type: 'button', clase: 'ap-tile', alClick: ir('reportar') }, [el('strong', { texto: 'Reportar' }), el('span', { texto: 'Avisa a la administración' })])
      ]),
      el('h3', { texto: 'Visitas recientes' }), lista
    ].concat(vacio).concat([
      el('div', { style: 'margin-top:1rem' }, [boton('Salir', 'ap-boton--borde', () => { E.pantalla = 'login'; dibujarTodo(); })])
    ]));
    return;
  }

  if (E.pantalla === 'invitar') {
    const nombre = el('input', { id: 'visNombre', type: 'text', maxlength: '40', autocomplete: 'off', placeholder: 'Por ejemplo: Visitante de ejemplo' });
    const dur = el('select', { id: 'visDur' }, [
      el('option', { value: '2', texto: '2 horas' }),
      el('option', { value: 'hoy', texto: 'Hasta el final de hoy' }),
      el('option', { value: '24', texto: '24 horas' })
    ]);
    const crear = boton('Crear código', '', () => {
      let horas = dur.value === 'hoy' ? null : Number(dur.value);
      const t = ahora();
      let vence;
      if (horas === null) { const f = new Date(t); f.setHours(23, 59, 0, 0); vence = f.getTime(); }
      else vence = t.getTime() + horas * 3600 * 1000;
      E.contador += 1;
      const v = { id: E.contador, nombre: (nombre.value.trim() || 'Visitante ' + E.contador), codigo: codigoNuevo(), vence, usada: false };
      E.visitas.unshift(v); E.ultima = v;
      registrar('Código creado para «' + v.nombre + '» (' + UNIDAD + ')', 'Creado', true);
      E.pantalla = 'qr'; dibujarTodo();
    });
    wrap(cabecera('Invitar a un visitante', 'El código sirve una sola vez.', ir('inicio')), [
      el('div', { clase: 'ap-campo' }, [el('label', { for: 'visNombre', texto: 'Nombre del visitante (opcional)' }), nombre]),
      el('div', { clase: 'ap-campo' }, [el('label', { for: 'visDur', texto: '¿Por cuánto tiempo?' }), dur]),
      crear
    ]);
    return;
  }

  if (E.pantalla === 'qr' && E.ultima) {
    const v = E.ultima;
    wrap(cabecera('Código listo', 'Compártelo con ' + v.nombre + '.', ir('inicio')), [
      el('div', { clase: 'ap-qr' }, [qrIlustrativo(v.codigo), el('p', { clase: 'ap-qr__codigo', texto: v.codigo }), el('p', { clase: 'ap-nota', texto: 'Válido hasta las ' + hhmm(new Date(v.vence)) + '. QR ilustrativo, no escaneable.' })]),
      el('div', { clase: 'ap-fila' }, [boton('Compartir', '', () => compartir(v, c)), boton('Listo', 'ap-boton--borde', ir('inicio'))])
    ]);
    return;
  }

  if (E.pantalla === 'tarjeta') {
    const bloq = E.tarjetaBloqueada;
    const accion = bloq
      ? boton('Reactivar mi tarjeta', '', () => { E.tarjetaBloqueada = false; registrar('Tarjeta de ' + UNIDAD + ' reactivada', 'Reactivada', true); dibujarTodo(); })
      : boton(E.confirmarBloqueo ? 'Sí, bloquear ahora' : 'Bloquear mi tarjeta', 'ap-boton--peligro', () => {
          if (!E.confirmarBloqueo) { E.confirmarBloqueo = true; dibujarTodo(); return; }
          E.tarjetaBloqueada = true; E.confirmarBloqueo = false;
          registrar('Tarjeta de ' + UNIDAD + ' bloqueada por el residente', 'Bloqueada', false);
          dibujarTodo();
        });
    wrap(cabecera('Mi tarjeta', 'Si la perdiste, bloquéala.', ir('inicio')), [
      el('div', { clase: 'ap-tarjeta' + (bloq ? ' ap-tarjeta--bloqueada' : '') }, [el('b', { texto: 'TARJETA 0001' }), el('small', { texto: NOMBRE + ' · ' + UNIDAD }), el('small', { texto: bloq ? 'Estado: bloqueada' : 'Estado: activa' })]),
      el('p', { texto: bloq ? 'Esta tarjeta ya no abre. Pruébalo en la pantalla del portero.' : (E.confirmarBloqueo ? 'Se bloqueará de inmediato. Podrás reactivarla cuando quieras.' : 'Al bloquearla, dejará de abrir en la portería.') }),
      accion,
      el('p', { clase: 'ap-nota', style: 'margin-top:.8rem', texto: 'En el sistema real, el bloqueo lo aplicaría el servidor y llegaría al lector; eso todavía está por construir.' })
    ]);
    return;
  }

  if (E.pantalla === 'reportar') {
    const cat = el('select', { id: 'repCat' }, ['Ruido', 'Daño en una zona común', 'Paquete o domicilio', 'Otro'].map((t) => el('option', { value: t, texto: t })));
    const txt = el('textarea', { id: 'repTxt', rows: '4', maxlength: '200', placeholder: 'Cuéntanos qué pasó (demostración, no se envía)' });
    const enviar = boton('Enviar reporte', '', () => {
      registrar('Reporte del residente: ' + cat.value, 'Enviado', true);
      E.pantalla = 'inicio'; dibujarTodo();
      aviso($('telResidente'), 'Reporte enviado (demostración).');
    });
    wrap(cabecera('Reportar', 'Avisa a la administración.', ir('inicio')), [
      el('div', { clase: 'ap-campo' }, [el('label', { for: 'repCat', texto: 'Tipo de reporte' }), cat]),
      el('div', { clase: 'ap-campo' }, [el('label', { for: 'repTxt', texto: 'Detalle' }), txt]),
      enviar
    ]);
    return;
  }

  E.pantalla = 'login'; dibujarResidente();
}

// ---------- Celular del portero ----------
function validarCodigo(texto) {
  const limpio = texto.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const v = E.visitas.find((x) => x.codigo.replace('-', '') === limpio);
  if (!limpio) return { ok: false, titulo: 'Escribe un código', detalle: 'Ingresa el código del visitante.' };
  if (!v) { registrar('Código no registrado', 'Denegado', false); return { ok: false, titulo: 'Denegado', detalle: 'Ese código no existe.' }; }
  const e = estadoVisita(v);
  if (e === 'Ingresó') { registrar('Código ya usado de «' + v.nombre + '»', 'Denegado', false); return { ok: false, titulo: 'Denegado', detalle: 'Ese código ya se usó.' }; }
  if (e === 'Vencida') { registrar('Código vencido de «' + v.nombre + '»', 'Denegado', false); return { ok: false, titulo: 'Denegado', detalle: 'El código ya venció.' }; }
  v.usada = true;
  registrar('Ingreso de «' + v.nombre + '» a ' + UNIDAD, 'Permitido', true);
  return { ok: true, titulo: 'Permitido', detalle: v.nombre + ' va a ' + UNIDAD + '.' };
}

function probarTarjeta() {
  if (E.tarjetaBloqueada) { registrar('Tarjeta bloqueada de ' + UNIDAD, 'Denegado', false); return { ok: false, titulo: 'Denegado', detalle: 'Tarjeta bloqueada por el residente.' }; }
  registrar('Ingreso de ' + NOMBRE + ' con tarjeta', 'Permitido', true);
  return { ok: true, titulo: 'Permitido', detalle: NOMBRE + ' · ' + UNIDAD + '.' };
}

function dibujarPortero() {
  const c = $('telPortero'); limpiar(c);
  const r = E.resultado;
  const bloqueResultado = el('div', { clase: 'ap-resultado' + (r ? (r.ok ? ' ap-resultado--ok' : ' ap-resultado--no') : ''), role: 'status' },
    r ? [el('div', { clase: 'ap-resultado__icono', 'aria-hidden': 'true', texto: r.ok ? '✓' : '✕' }), el('h3', { texto: r.titulo }), el('p', { texto: r.detalle })]
      : [el('p', { texto: 'Esperando una lectura…' })]);

  const entrada = el('input', { id: 'porCodigo', type: 'text', maxlength: '8', autocomplete: 'off', placeholder: 'ABC-123', style: 'text-transform:uppercase' });
  const validar = () => { E.resultado = validarCodigo(entrada.value); dibujarTodo(); };
  entrada.addEventListener('keydown', (e) => { if (e.key === 'Enter') validar(); });

  const esperadas = E.visitas.filter((v) => estadoVisita(v) === 'Pendiente');
  const lista = el('ul', { clase: 'ap-lista' });
  esperadas.forEach((v) => lista.append(el('li', { clase: 'ap-visita' }, [
    el('span', {}, [el('b', { texto: v.nombre }), el('small', { texto: v.codigo + ' · ' + UNIDAD })]),
    boton('Validar', 'ap-boton--chico', () => { E.resultado = validarCodigo(v.codigo); dibujarTodo(); }, { 'aria-label': 'Validar el código de ' + v.nombre })
  ])));

  c.append(
    el('div', { clase: 'ap-cab' }, [
      el('div', { clase: 'ap-marca' }, [el('img', { src: 'logo-aguila.png', alt: '', width: '28', height: '23' }), el('span', { texto: 'ASTRIA ACCESS' })]),
      el('h3', { texto: 'Portería · Conjunto Demo' }),
      el('p', { texto: 'Lectura de códigos y tarjetas' })
    ]),
    el('div', { clase: 'ap-cuerpo' }, [
      bloqueResultado,
      el('h3', { texto: 'Probar un código' }),
      el('div', { clase: 'ap-campo' }, [el('label', { for: 'porCodigo', texto: 'Código del visitante' }), entrada]),
      boton('Validar código', '', validar),
      el('h3', { texto: 'Visitas esperadas' }),
      esperadas.length ? lista : el('p', { clase: 'ap-nota', texto: 'Nadie esperado ahora. Crea una invitación en el celular del residente.' }),
      el('h3', { texto: 'Tarjeta del residente' }),
      boton('Acercar la tarjeta al lector', 'ap-boton--borde', () => { E.resultado = probarTarjeta(); dibujarTodo(); })
    ])
  );
}

// ---------- Registro, reloj y arranque ----------
function dibujarRegistro() {
  const lista = $('registro'); limpiar(lista);
  if (E.eventos.length === 0) {
    lista.append(el('li', {}, [el('span', { texto: 'Aún no hay eventos. Haz algo en los celulares y aparecerá aquí.' })]));
    return;
  }
  E.eventos.forEach((e) => lista.append(el('li', {}, [
    el('span', { texto: e.hora + ' · ' + e.texto }),
    el('span', { clase: 'estado ' + (e.ok ? 'estado--ok' : 'estado--no'), texto: e.resultado })
  ])));
}

function dibujarReloj() {
  $('relojTexto').textContent = 'Hora de la demostración: ' + hhmm(ahora()) + (E.desfaseH ? ' (adelantada ' + E.desfaseH + ' h)' : '');
}

function dibujarTodo() { dibujarResidente(); dibujarPortero(); dibujarRegistro(); dibujarReloj(); }

$('adelantar').addEventListener('click', () => { E.desfaseH += 3; dibujarTodo(); });
$('reiniciar').addEventListener('click', () => { E = estadoInicial(); dibujarTodo(); });
document.querySelectorAll('.app-tabs button').forEach((b) => b.addEventListener('click', () => {
  $('telefonos').dataset.ver = b.dataset.ver;
  document.querySelectorAll('.app-tabs button').forEach((x) => {
    const act = x === b; x.classList.toggle('activo', act); x.setAttribute('aria-pressed', String(act));
  });
}));

dibujarTodo();
