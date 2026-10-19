# Invitación web — XV Josefina Günther

## Archivos
- `index.html`: contenido de la invitación y formulario.
- `style.css`: diseño floral lila/blanco con formato vertical angosto tipo celular, sobre animado y parlante fijo.
- `script.js`: sobre, cuenta regresiva al 20 de febrero de 2027 a las 21:00, música, mapa, enlaces y envío del formulario.
- `guardar_respuestas.gs`: código para guardar respuestas en Google Sheets con Apps Script.

## Solución para guardar las confirmaciones
GitHub Pages solo publica la web: no guarda respuestas. Para guardarlas en una planilla:

1. Creá una hoja de cálculo de Google llamada `Respuestas XV Josefina`.
2. En la hoja, entrá en **Extensiones → Apps Script**.
3. Borrá el código de ejemplo y pegá todo el contenido de `guardar_respuestas.gs`.
4. Guardá el proyecto.
5. Elegí **Implementar → Nueva implementación → Aplicación web**.
6. En “Ejecutar como”, elegí tu cuenta. En acceso, elegí la opción que permita recibir envíos de cualquier persona que tenga la invitación.
7. Tocá **Implementar**, autorizá los permisos y copiá la URL que termina en `/exec`.
8. Abrí `script.js` y reemplazá el valor de `formEndpoint` por esa URL exacta. No pegues la URL dentro del formulario en `index.html`.
9. Cada vez que cambies el código de Apps Script, volvé a **Implementar → Administrar implementaciones → Editar → Nueva versión → Implementar**.
10. Subí los archivos actualizados `index.html`, `style.css` y `script.js` al repositorio de GitHub, reemplazando los anteriores.
11. Hacé una prueba con un nombre ficticio y comprobá que se cree una fila en la hoja `Respuestas`.

**Importante:** la web usa `no-cors` para enviar el formulario a Apps Script. El navegador no permite leer la respuesta del servidor; por eso el mensaje de la página confirma que el envío se intentó, pero la comprobación real es ver la nueva fila en Google Sheets. Hacé esa prueba antes de compartir la invitación con todos.

## Fotos y música
- Fotos: colocá `foto1.jpg`, `foto2.jpg` y `foto3.jpg` dentro de una carpeta `fotos` en la raíz del repositorio.
- Música: subí el archivo de audio a la raíz del repositorio (o a una carpeta `audio`) y actualizá `musicFile` en `script.js` con la ruta exacta. Los navegadores pueden impedir el inicio automático del sonido; si sucede, el invitado debe tocar el parlante.

## Publicar
Subí `index.html`, `style.css`, `script.js` y las carpetas/archivos que uses a la raíz del repositorio. En GitHub, abrí **Settings → Pages**, elegí la rama `main` y la carpeta `/(root)`.
