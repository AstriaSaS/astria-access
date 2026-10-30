# Astria Access · Sitio web

Sitio estático (HTML, CSS y JavaScript, sin instalar nada).

## Ver el sitio en tu computador

Abre `index.html` con doble clic. El panel de demostración está en `panel.html`.

## Qué hay en cada carpeta

| Archivo o carpeta | Qué contiene |
|---|---|
| `index.html` | Página principal |
| `panel.html` | Panel de demostración (datos inventados) |
| `app.html` | App de demostración: celular del residente y del portero (datos inventados) |
| `privacidad.html` | Aviso de privacidad (borrador) |
| `styles.css` | Colores y diseño. Los colores están arriba, en un solo lugar |
| `panel.css` | Estilos del panel |
| `app.css` | Estilos de la app de demostración |
| `main.js` | Menú del celular, resaltado del menú y formulario de contacto |
| `productos.js` | Catálogo de productos y lista de cotización. Aquí se agregan productos |
| `guia.js` | Guía con avatar: recorrido y respuestas rápidas. Las respuestas se editan en la lista `RESPUESTAS` |
| `panel.js` | Lógica del panel de demostración |
| `app.js` | Lógica de la app de demostración |
| `` | Logo, favicon e íconos |

## Qué es real y qué es demostración

- Real: navegación, diseño adaptable, validación del formulario, catálogo y lista de cotización.
- Demostración: el panel y todos sus datos.
- Pendiente: envío real del formulario (se activa con los datos de `EMAILJS` en `main.js`), inicio de sesión, base de datos y conexión con el lector.

## Activar el envío de correo del formulario (EmailJS)

Mientras no hagas esto, el formulario es una demostración: valida los campos, pero no envía nada y lo avisa.

1. Entra a emailjs.com y crea una cuenta (se recomienda usar el correo de la empresa).
2. En **Email Services** pulsa **Add New Service**, elige **Gmail** y conéctalo con el correo que recibirá los mensajes. Copia el **Service ID**.
3. En **Email Templates** crea una plantilla nueva:
   - **To Email:** el correo de la empresa.
   - **Subject:** `Nueva solicitud de {{nombre}} · Astria Access`
   - **Content:** escribe `Nombre: {{nombre}}`, `Correo: {{correo}}`, `Tipo de propiedad: {{tipo}}`, `Tamaño: {{unidades}}`, `Rol: {{rol}}` y `Mensaje: {{mensaje}}` (cada uno en su línea).
   - **Reply To:** `{{correo}}`, para poder responderle directamente a quien escribió.
   - Copia el **Template ID**.
4. En **Account → General** copia tu **Public Key**.
5. Abre `main.js`, busca `const EMAILJS` y pega los tres datos entre las comillas. Los nombres `{{nombre}}`, `{{correo}}`, `{{tipo}}`, `{{unidades}}`, `{{rol}}` y `{{mensaje}}` deben escribirse exactamente así en la plantilla.
6. Prueba enviando un mensaje desde la página. Si llega al correo, listo.
7. Abre `privacidad.html` y cambia la sección «Estado actual del formulario» por el texto que está en el comentario dentro de esa sección.

La Public Key no es una contraseña: está hecha para ir en la página. Aun así, el plan gratis de EmailJS tiene un límite de mensajes por mes, y la página ya incluye una trampa anti-spam y una pausa de 30 segundos entre envíos. Si tu panel de EmailJS permite limitar desde qué dominios se aceptan envíos, actívalo con el enlace de tu página publicada.

## Publicarlo gratis en GitHub Pages

1. Crea una cuenta en github.com (se recomienda usar el correo de la empresa).
2. Pulsa **New repository**, ponle de nombre `astria-access` y déjalo en **Public**.
3. Descomprime este proyecto. En el repositorio pulsa **Add file → Upload files** y arrastra **el contenido** de la carpeta (que `index.html` quede en la raíz del repositorio, no dentro de otra carpeta). Pulsa **Commit changes**.
4. Ve a **Settings → Pages**. En **Source** elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guarda.
5. Espera uno o dos minutos. Arriba de esa misma pantalla aparece el enlace, parecido a `https://TU-USUARIO.github.io/astria-access/`.

Para actualizar el sitio, vuelve a subir los archivos cambiados y confirma los cambios.

## Qué NO subir nunca

Contraseñas, claves privadas ni archivos de cuentas de servicio. Si más adelante usas Firebase, la configuración web de Firebase sí puede ir en el sitio (es pública por diseño); la seguridad la dan las reglas de la base de datos.

## Redes sociales

Los enlaces de Instagram y TikTok (@astria.access) están en la sección de contacto y en el pie de `index.html` (busca `class="redes"`), y en la guía (`guia.js`, respuesta `redes`). Si se crea otra red, se agrega en esos tres lugares y en `privacidad.html`.
