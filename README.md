# Invitación web — XV Josefina Günther

## Qué hay que subir a GitHub
Subí estos archivos a la raíz del repositorio (reemplazando los anteriores):

- `index.html`
- `style.css`
- `script.js`
- `guardar_respuestas.gs` (solo se usa para copiarlo a Google Sheets, no hace falta que funcione en la web)
- La carpeta `fotos` con `foto1.jpg`, `foto2.jpg` y `foto3.jpg` (opcional; cada foto aparece en un marco dorado en un lugar distinto de la invitación, y si falta alguna ese marco no se muestra)
- El archivo de música `.mp3` (opcional)

Para publicar: en GitHub, **Settings → Pages**, elegí la rama `main` y la carpeta `/(root)`.

## Qué se puede cambiar (sin saber programar)
Abrí `script.js`. Al principio hay un bloque llamado `CONFIG` con todo lo que se edita, con comentarios en español:

| Qué | Dónde |
|---|---|
| Fecha y hora | `fecha` |
| Dirección que se muestra | `lugarDireccion` |
| Búsqueda en Google Maps | `mapaBusqueda` |
| Música | `musica` |
| Playlist de Spotify | `spotify` |
| Link de pago | `mercadoPago` |
| Conexión del formulario | `formulario` |

Respetá las comillas `"` y las comas al final de cada línea.

## Guardar las confirmaciones en Google Sheets
GitHub Pages solo publica la web: no guarda respuestas. Para guardarlas:

1. Creá una hoja de cálculo de Google llamada `Respuestas XV Josefina`.
2. Entrá en **Extensiones → Apps Script**.
3. Borrá el código de ejemplo y pegá todo el contenido de `guardar_respuestas.gs`.
4. Guardá el proyecto.
5. **Implementar → Nueva implementación → Aplicación web**.
6. En “Ejecutar como” elegí tu cuenta; en “Quién tiene acceso” elegí **Cualquier persona**.
7. **Implementar**, autorizá los permisos y copiá la URL que termina en `/exec`.
8. En `script.js`, pegá esa URL entre las comillas de `formulario: ""`.
9. Si más adelante cambiás el código de Apps Script: **Implementar → Administrar implementaciones → Editar → Nueva versión → Implementar**.
10. Subí `script.js` a GitHub.
11. **Prueba obligatoria:** completá el formulario con un nombre ficticio y comprobá que aparezca una fila nueva en la hoja `Respuestas`. Hacelo antes de compartir la invitación.

Tip: si abrís la URL `/exec` en el navegador y dice “Funcionando”, el script está bien publicado.

**Importante:** por una limitación de los navegadores, la página no puede leer la respuesta de Google. Por eso muestra “¡Gracias!” cuando el envío se realizó, pero la comprobación real es ver la fila en la planilla.

## Música
- Subí el `.mp3` a la raíz del repositorio. Recomendado: renombrarlo a `musica.mp3` (sin espacios ni paréntesis) y ponerlo en `musica` dentro de `CONFIG`.
- Los celulares solo permiten sonido después de un toque; por eso la música arranca cuando la persona toca el sobre. Si el archivo no existe, el botón de música no aparece.

## Fotos
Subí `foto1.jpg`, `foto2.jpg` y `foto3.jpg` dentro de una carpeta llamada `fotos`. La 1 va en marco de arco después del mensaje, la 2 en marco ovalado después de la cuenta regresiva y la 3 en arco antes de confirmar asistencia. Las fotos verticales (retrato) son las que mejor quedan. Conviene que pesen menos de 500 KB cada una para que la invitación cargue rápido.
