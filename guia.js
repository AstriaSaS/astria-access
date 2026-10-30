/* ==========================================================
   ASTRIA ACCESS · Guía con avatar
   Un asistente sencillo (sin inteligencia artificial): hace un
   recorrido por la página y responde preguntas frecuentes.

   PARA CAMBIAR O AGREGAR RESPUESTAS: edita la lista RESPUESTAS.
   Escribe solo lo que sea cierto hoy. Si algo está en desarrollo,
   dilo así. Las "palabras" sirven para entender lo que escribe la persona.
   ========================================================== */
(function () {
  'use strict';

  const NOMBRE_GUIA = 'Guía de Astria';   // cámbialo si el equipo le pone nombre a la mascota
  const CORREO = 'gerenciaastriaaccess@gmail.com';

  // ---------- Contenido ----------
  const RESPUESTAS = [
    {
      id: 'que-es', pregunta: '¿Qué es Astria Access?',
      palabras: ['que es', 'astria', 'proyecto', 'empresa', 'sena', 'de que se trata'],
      texto: 'Astria Access es un proyecto productivo del SENA, en Madrid, Cundinamarca. Busca que administrar quién entra a un conjunto residencial sea más fácil, con una plataforma web y dispositivos de control de acceso. Todavía está en desarrollo.',
      acciones: [{ texto: 'Ver la solución', ir: '#solucion' }]
    },
    {
      id: 'como-funciona', pregunta: '¿Cómo funciona?',
      palabras: ['como funciona', 'funciona', 'pasos', 'etapas', 'proceso'],
      texto: 'Son cuatro etapas. Uno: el administrador configura residentes y permisos. Dos: se habilitan las autorizaciones. Tres: la persona usa su código QR o su tarjeta. Cuatro: el sistema registra el evento, siempre que la infraestructura necesaria esté instalada.',
      acciones: [{ texto: 'Ver cómo funciona', ir: '#funcionamiento' }]
    },
    {
      id: 'qr-tarjetas', pregunta: '¿QR o tarjeta?',
      palabras: ['qr', 'tarjeta', 'chip', 'rfid', 'nfc', 'visitante', 'credencial'],
      texto: 'Los códigos QR son para visitantes: son temporales y los crea el residente o la administración. Las tarjetas o chips de proximidad (RFID/NFC) son para los residentes, y si se pierden, el administrador las puede bloquear desde el panel.',
      acciones: [{ texto: 'Ver los productos', ir: '#productos' }]
    },
    {
      id: 'sin-internet', pregunta: '¿Funciona sin internet?',
      palabras: ['internet', 'sin red', 'se cae', 'caida', 'luz', 'offline', 'sin conexion', 'wifi'],
      texto: 'Es un objetivo de diseño: que el lector guarde las autorizaciones en su memoria para seguir abriendo si falla la red. Todavía lo estamos desarrollando, así que no lo damos por garantizado.',
      acciones: []
    },
    {
      id: 'precio', pregunta: '¿Cuánto cuesta?',
      palabras: ['precio', 'cuesta', 'costo', 'cotiza', 'valor', 'cuanto', 'pagar', 'barato'],
      texto: 'Todavía no hay precios publicados. Cada propiedad es distinta, así que se cotiza según lo que necesite: la plataforma según el tamaño del conjunto y los equipos aparte. Puedes ver el detalle y pedir información.',
      acciones: [{ texto: 'Qué se paga y qué no', ir: '#costos' }, { texto: 'Pedir información', ir: '#contacto' }]
    },
    {
      id: 'compatibilidad', pregunta: '¿Sirve para mi conjunto?',
      palabras: ['mi conjunto', 'sirve', 'compatible', 'puerta', 'reja', 'parqueadero', 'vehicul', 'edificio', 'casa', 'conjunto'],
      texto: 'Depende de cada propiedad. Antes de instalar cualquier componente se revisa si es compatible con la puerta, la reja o el equipo que ya existe. Cuéntanos cómo es tu conjunto y lo revisamos.',
      acciones: [{ texto: 'Ver entornos', ir: '#entornos' }, { texto: 'Pedir información', ir: '#contacto' }]
    },
    {
      id: 'camaras', pregunta: '¿Tienen cámaras?',
      palabras: ['camara', 'video', 'vigilancia', 'grabar'],
      texto: 'Las cámaras de seguridad están en estudio. Todavía no tenemos modelos ni características confirmadas.',
      acciones: [{ texto: 'Ver los productos', ir: '#productos' }]
    },
    {
      id: 'panel', pregunta: '¿Puedo probar el panel?',
      palabras: ['panel', 'administrador', 'administrar', 'demo', 'demostracion', 'probar', 'app', 'aplicacion', 'celular', 'residente', 'portero'],
      texto: 'Sí. El panel de demostración te deja probar cómo sería administrar residentes, visitantes y credenciales, y la app de demostración muestra cómo lo vería un residente y un portero. Todos los datos son inventados y no se guarda nada.',
      acciones: [{ texto: 'Abrir el panel demo', href: 'panel.html' }, { texto: 'Ver la app demo', href: 'app.html' }]
    },
    {
      id: 'servicios', pregunta: '¿Qué servicios ofrecen?',
      palabras: ['servicio', 'instalacion', 'instalar', 'soporte', 'capacitacion', 'mantenimiento'],
      texto: 'Proyectamos ofrecer configuración de la plataforma, adaptación a cada propiedad, integración de equipos compatibles, capacitación y soporte técnico. Por ahora son servicios proyectados.',
      acciones: [{ texto: 'Ver servicios', ir: '#servicios' }]
    },
    {
      id: 'datos', pregunta: '¿Qué pasa con mis datos?',
      palabras: ['datos', 'privacidad', 'privado', 'informacion personal', 'habeas'],
      texto: 'El formulario solo pide nombre, correo, tipo y tamaño de la propiedad, tu rol y un mensaje, y se usan únicamente para responderte. Puedes leer el aviso de privacidad completo (es un borrador).',
      acciones: [{ texto: 'Aviso de privacidad', href: 'privacidad.html' }]
    },
    {
      id: 'equipo', pregunta: '¿Quiénes son?',
      palabras: ['quienes son', 'equipo', 'integrantes', 'nosotros', 'gerente'],
      texto: 'Somos el equipo de Astria Access: Sergio Colorado (gerencia y producción), Ethan González (marketing y ventas), Kevin Casallas (atención al cliente) y Wilson Hernández (contabilidad y finanzas).',
      acciones: [{ texto: 'Ver el equipo', ir: '#nosotros' }]
    },
    {
      id: 'redes', pregunta: '¿Tienen redes sociales?',
      palabras: ['redes', 'instagram', 'tiktok', 'seguir', 'social', 'facebook', 'insta'],
      texto: 'Sí, estamos en Instagram y en TikTok como @astria.access.',
      acciones: [{ texto: 'Instagram', href: 'https://www.instagram.com/astria.access/' }, { texto: 'TikTok', href: 'https://www.tiktok.com/@astria.access' }]
    },
    {
      id: 'por-que', pregunta: '¿Por qué elegirlos?',
      palabras: ['por que', 'elegir', 'elegirlos', 'diferente', 'ventaja', 'competencia', 'mejor', 'comparar', 'comparacion'],
      texto: 'Somos un equipo de la zona, te decimos claro qué está listo y qué no, y estamos construyendo un lector propio con QR y tarjeta. Cosas como funcionar sin internet son objetivos que todavía probamos. Mira la comparación en la página.',
      acciones: [{ texto: 'Ver por qué elegirnos', ir: '#elegirnos' }]
    },
    {
      id: 'contacto', pregunta: 'Quiero contactarlos',
      palabras: ['contacto', 'correo', 'escribir', 'hablar', 'whatsapp', 'telefono', 'llamar', 'asesor', 'cotizacion'],
      // esta respuesta cambia según el formulario esté activo o no
      texto: function () {
        const activo = typeof EMAIL_ACTIVO !== 'undefined' && EMAIL_ACTIVO;
        return activo
          ? 'Puedes escribirnos con el formulario de contacto o al correo ' + CORREO + '.'
          : 'Puedes escribirnos al correo ' + CORREO + '. El formulario de la página todavía es una demostración y no envía el mensaje.';
      },
      acciones: [{ texto: 'Ir al formulario', ir: '#contacto' }]
    }
  ];

  const MENU = ['que-es', 'como-funciona', 'por-que', 'precio', 'panel', 'redes', 'contacto'];

  const RECORRIDO = [
    { ir: '#inicio', texto: 'Aquí empieza todo: Astria Access ayuda a gestionar quién entra a un conjunto residencial, desde un solo lugar.' },
    { ir: '#solucion', texto: 'Estos son los cuatro componentes posibles: autorizaciones digitales, códigos QR, tarjetas de proximidad y accesos vehiculares.' },
    { ir: '#funcionamiento', texto: 'Así funciona, en cuatro etapas. Las tarjetas de ejemplo usan datos simulados, y está marcado.' },
    { ir: '#entornos', texto: 'Cada propiedad es distinta. Por eso la compatibilidad se revisa antes de instalar cualquier cosa.' },
    { ir: '#productos', texto: 'Estos son los equipos en desarrollo. Agrega a tu lista los que te interesen y pide información.' },
    { ir: '#panel', texto: 'Aquí puedes entrar al panel de demostración del administrador. Es una simulación, sin datos reales.' },
    { ir: '#elegirnos', texto: 'Aquí te contamos qué queremos hacer distinto y cómo se compara con papel y llamadas o con otras plataformas.' },
    { ir: '#servicios', texto: 'Estos son los servicios que proyectamos ofrecer. Todavía no hay precios ni contratos.' },
    { ir: '#nosotros', texto: 'Y este es el equipo detrás del proyecto, con su misión y su visión.' },
    { ir: '#contacto', texto: 'Para terminar: aquí puedes pedir información. ¡Gracias por el recorrido!' }
  ];

  // ---------- Utilidades ----------
  const sinMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const porId = (id) => RESPUESTAS.find((r) => r.id === id);

  function crear(etiqueta, props, hijos) {
    const nodo = document.createElement(etiqueta);
    Object.entries(props || {}).forEach(([k, v]) => {
      if (k === 'texto') nodo.textContent = v;
      else if (k === 'clase') nodo.className = v;
      else nodo.setAttribute(k, v);
    });
    (hijos || []).forEach((h) => nodo.append(h));
    return nodo;
  }

  function irA(selector) {
    const destino = document.querySelector(selector);
    if (destino) destino.scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth', block: 'start' });
  }

  // ---------- Estructura ----------
  const boton = crear('button', { type: 'button', clase: 'guia-boton', 'aria-label': 'Abrir ' + NOMBRE_GUIA, 'aria-expanded': 'false', 'aria-controls': 'guiaPanel' });
  const avatar = crear('img', { src: 'logo-aguila.png', alt: '', width: '40', height: '32' });
  boton.append(avatar);

  const aviso = crear('div', { clase: 'guia-aviso', role: 'status' });
  aviso.hidden = true;
  const avisoTexto = crear('button', { type: 'button', clase: 'guia-aviso__texto', texto: '¿Te hago un recorrido por Astria Access?' });
  const avisoCerrar = crear('button', { type: 'button', clase: 'guia-aviso__cerrar', 'aria-label': 'Cerrar mensaje', texto: '×' });
  aviso.append(avisoTexto, avisoCerrar);

  const panel = crear('section', { clase: 'guia-panel', id: 'guiaPanel', role: 'dialog', 'aria-label': NOMBRE_GUIA, tabindex: '-1' });
  panel.hidden = true;
  const cerrar = crear('button', { type: 'button', clase: 'guia-panel__cerrar', 'aria-label': 'Cerrar guía', texto: '×' });
  const cabeza = crear('header', { clase: 'guia-panel__cabeza' }, [
    crear('span', { clase: 'guia-panel__avatar' }, [crear('img', { src: 'logo-aguila.png', alt: '', width: '28', height: '22' })]),
    crear('div', {}, [crear('strong', { texto: NOMBRE_GUIA }), crear('small', { texto: 'Respuestas rápidas y recorrido' })]),
    cerrar
  ]);
  const mensajes = crear('div', { clase: 'guia-mensajes', 'aria-live': 'polite' });
  const entrada = crear('input', { type: 'text', id: 'guiaTexto', maxlength: '120', placeholder: 'Escribe tu pregunta…', 'aria-label': 'Escribe tu pregunta', autocomplete: 'off' });
  const enviar = crear('button', { type: 'submit', clase: 'guia-enviar', 'aria-label': 'Enviar pregunta', texto: '➤' });
  const formulario = crear('form', { clase: 'guia-form' }, [entrada, enviar]);
  panel.append(cabeza, mensajes, formulario);

  document.body.append(aviso, panel, boton);

  // ---------- Conversación ----------
  let opcionesActuales = null;
  let pasoActual = -1;
  let ocupado = false;

  function quitarOpciones() { if (opcionesActuales) { opcionesActuales.remove(); opcionesActuales = null; } }
  function bajar() { mensajes.scrollTop = mensajes.scrollHeight; }

  function burbuja(quien, texto) {
    mensajes.append(crear('div', { clase: 'guia-msg guia-msg--' + quien, texto: texto }));
    bajar();
  }

  function opciones(lista) {
    quitarOpciones();
    const caja = crear('div', { clase: 'guia-opciones' });
    lista.forEach((o) => {
      let nodo;
      if (o.href) {
        nodo = crear('a', { href: o.href, clase: 'guia-chip guia-chip--enlace', texto: o.texto });
        if (/^https?:/.test(o.href)) { nodo.target = '_blank'; nodo.rel = 'noopener noreferrer'; }
      }
      else { nodo = crear('button', { type: 'button', clase: 'guia-chip', texto: o.texto }); nodo.addEventListener('click', o.alElegir); }
      caja.append(nodo);
    });
    mensajes.append(caja);
    opcionesActuales = caja;
    bajar();
  }

  // El guía "escribe" un momento antes de responder (se omite si la persona prefiere menos movimiento)
  function responder(fn) {
    ocupado = true; quitarOpciones();
    const escribiendo = crear('div', { clase: 'guia-msg guia-msg--bot guia-escribiendo', texto: '…' });
    if (!sinMovimiento) { mensajes.append(escribiendo); bajar(); }
    setTimeout(() => { escribiendo.remove(); ocupado = false; fn(); }, sinMovimiento ? 0 : 450);
  }

  function menuPrincipal(intro) {
    if (intro) burbuja('bot', intro);
    const lista = [{ texto: 'Hazme un recorrido', alElegir: () => { burbuja('yo', 'Hazme un recorrido'); iniciarRecorrido(); } }];
    MENU.forEach((id) => { const r = porId(id); lista.push({ texto: r.pregunta, alElegir: () => { burbuja('yo', r.pregunta); contestar(r); } }); });
    opciones(lista);
  }

  function contestar(r) {
    responder(() => {
      burbuja('bot', typeof r.texto === 'function' ? r.texto() : r.texto);
      const lista = r.acciones.map((a) => a.href
        ? { texto: a.texto, href: a.href }
        : { texto: a.texto, alElegir: () => { irA(a.ir); if (window.innerWidth < 700) cerrarPanel(); } });
      lista.push({ texto: 'Otras preguntas', alElegir: () => { burbuja('yo', 'Otras preguntas'); responder(() => menuPrincipal('Claro, ¿qué más quieres saber?')); } });
      opciones(lista);
    });
  }

  function iniciarRecorrido() { pasoActual = -1; siguientePaso(); }
  function siguientePaso() {
    pasoActual += 1;
    if (pasoActual >= RECORRIDO.length) { responder(() => menuPrincipal('Ese fue el recorrido. ¿Quieres preguntarme algo?')); return; }
    const paso = RECORRIDO[pasoActual];
    irA(paso.ir);
    responder(() => {
      burbuja('bot', (pasoActual + 1) + ' de ' + RECORRIDO.length + ' · ' + paso.texto);
      opciones([
        { texto: pasoActual === RECORRIDO.length - 1 ? 'Terminar' : 'Siguiente', alElegir: () => { burbuja('yo', pasoActual === RECORRIDO.length - 1 ? 'Terminar' : 'Siguiente'); siguientePaso(); } },
        { texto: 'Salir del recorrido', alElegir: () => { burbuja('yo', 'Salir del recorrido'); responder(() => menuPrincipal('Listo. ¿Qué quieres saber?')); } }
      ]);
    });
  }

  // Busca la respuesta con más palabras clave coincidentes
  function buscar(texto) {
    const t = ' ' + normalizar(texto) + ' ';
    let mejor = null, puntos = 0;
    RESPUESTAS.forEach((r) => {
      const p = r.palabras.reduce((s, w) => s + (t.includes(' ' + w + ' ') || t.includes(w) ? 1 : 0), 0);
      if (p > puntos) { puntos = p; mejor = r; }
    });
    return mejor;
  }

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = entrada.value.trim();
    if (!texto || ocupado) return;
    entrada.value = '';
    burbuja('yo', texto);
    if (/recorrido|tour|guiame|guia me/.test(normalizar(texto))) { iniciarRecorrido(); return; }
    const r = buscar(texto);
    if (r) contestar(r);
    else responder(() => {
      burbuja('bot', 'Esa no la tengo a la mano. Puedes escribirnos al correo ' + CORREO + ' y te respondemos, o elegir una de estas opciones.');
      menuPrincipal();
    });
  });

  // ---------- Abrir y cerrar ----------
  let saludado = false;
  function abrirPanel() {
    ocultarAviso(true);
    panel.hidden = false;
    boton.setAttribute('aria-expanded', 'true');
    if (!saludado) { saludado = true; menuPrincipal('¡Hola! Soy la ' + NOMBRE_GUIA + '. Puedo llevarte a conocer la página o responder dudas. ¿Qué prefieres?'); }
    panel.focus();
  }
  function cerrarPanel() { panel.hidden = true; boton.setAttribute('aria-expanded', 'false'); boton.focus(); }
  boton.addEventListener('click', () => (panel.hidden ? abrirPanel() : cerrarPanel()));
  cerrar.addEventListener('click', cerrarPanel);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) cerrarPanel(); });

  // ---------- Mensaje de bienvenida (una sola vez por visita) ----------
  function ocultarAviso(recordar) {
    aviso.hidden = true;
    if (recordar) { try { sessionStorage.setItem('guiaAviso', '1'); } catch (e) { /* sin almacenamiento: no pasa nada */ } }
  }
  avisoCerrar.addEventListener('click', () => ocultarAviso(true));
  avisoTexto.addEventListener('click', () => { abrirPanel(); burbuja('yo', 'Hazme un recorrido'); iniciarRecorrido(); });

  let yaVisto = false;
  try { yaVisto = sessionStorage.getItem('guiaAviso') === '1'; } catch (e) { /* ignorar */ }
  if (!yaVisto) {
    setTimeout(() => { if (panel.hidden) { aviso.hidden = false; setTimeout(() => ocultarAviso(true), 12000); } }, 5000);
  }
})();
