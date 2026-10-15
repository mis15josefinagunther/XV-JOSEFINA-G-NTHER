/*
 * CONFIGURACIÓN: completá los valores cuando tengas la información confirmada.
 * No agregues datos privados que no quieras publicar en una página pública.
 */
const CONFIG = {
  // Año de la fiesta, en formato numérico. Ejemplo: 2027
  eventYear: 2027,
  // Dirección completa para ubicar el salón en Google Maps.
  venueAddress: "Altos Álamos Eventos",
  // Ruta a un archivo de audio que tengas derecho a usar, por ejemplo: "audio/musica.mp3"
  musicFile: "I See The Light (From Tangled) - Royal Philharmonic Orchestra.mp3",
  // Enlace completo de la playlist de Spotify.
  spotifyUrl: "https://open.spotify.com/playlist/3p9KdLksmJ1PxLYJjSvuZG?si=epg-rHxVTf-y5X23X3TgnA&utm_source=copy-link&pt=f26e9aa71449e25198682a39301bd6c7&pi=FMetXXflTcacd",
  // Enlace completo y verificado para pagar la entrada.
  paymentUrl: "https://link.mercadopago.com.ar/xvjuji",
  /*
   * URL de un endpoint de formulario que acepte POST, por ejemplo uno creado
   * con Formspree u otro servicio. Si queda vacío, el formulario NO envía ni
   * almacena datos: solo muestra un aviso de demostración.
   */
  formEndpoint: "https://script.google.com/macros/s/AKfycbx8T3DC6Q-IiDFXFVSqQ6Uck_KdOFyP4PgewecjWniW3sff9PSkx2M4h1XfBArBd6tY/exec"
};

const $ = (selector) => document.querySelector(selector);

function setOptionalLink(selector, url) {
  const link = $(selector);
  if (url && /^https:\/\/\S+/i.test(url)) {
    link.href = url;
    link.removeAttribute("aria-disabled");
  } else {
    link.href = "#";
    link.setAttribute("aria-disabled", "true");
  }
}

function setupCountdown() {
  const note = $("#countdown-note");
  if (!Number.isInteger(CONFIG.eventYear) || CONFIG.eventYear < 2020) {
    note.textContent = "La cuenta regresiva se activará cuando se configure el año del evento.";
    return;
  }

  // Se usa la hora local del dispositivo de quien visita la invitación.
  const target = new Date(CONFIG.eventYear, 1, 16, 21, 0, 0); // Febrero = 1
  const update = () => {
    const remaining = target.getTime() - Date.now();
    if (remaining <= 0) {
      ["#days", "#hours", "#minutes", "#seconds"].forEach(id => $(id).textContent = "0");
      note.textContent = remaining > -86400000 ? "¡Llegó el gran día! ¡A celebrar!" : "¡Gracias por haber sido parte de esta noche especial!";
      return;
    }
    const seconds = Math.floor(remaining / 1000);
    $("#days").textContent = Math.floor(seconds / 86400);
    $("#hours").textContent = Math.floor((seconds % 86400) / 3600);
    $("#minutes").textContent = Math.floor((seconds % 3600) / 60);
    $("#seconds").textContent = seconds % 60;
    note.textContent = "Prepará tu mejor sonrisa: ¡nos vemos pronto!";
    window.setTimeout(update, 1000);
  };
  update();
}

function setupMap() {
  const link = $("#map-link");
  if (CONFIG.venueAddress.trim()) {
    link.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.venueAddress.trim());
    link.removeAttribute("aria-disabled");
  }
}

function setupMusic() {
  const audio = $("#background-music");
  const speaker = $("#speaker-toggle");
  const note = $("#music-note");
  let hasTriedPlayback = false;
  if (CONFIG.musicFile.trim()) {
    audio.src = CONFIG.musicFile;
    audio.volume = 0.65;
  } else {
    note.textContent = "Para que suene música, agregá un archivo propio en la carpeta audio y completá musicFile en script.js.";
    speaker.setAttribute("aria-label", "Música sin configurar");
    speaker.title = "Primero agregá un archivo de música";
    speaker.disabled = true;
  }
  async function startMusicFromOpeningGesture() {
    if (!CONFIG.musicFile.trim() || hasTriedPlayback) return;
    hasTriedPlayback = true;
    try {
      await audio.play();
      speaker.textContent = audio.muted ? "🔇" : "🔊";
      speaker.setAttribute("aria-pressed", String(audio.muted));
      speaker.setAttribute("aria-label", audio.muted ? "Activar sonido" : "Silenciar música");
      note.textContent = "La música está sonando. Usá el parlante para silenciarla.";
    } catch (error) {
      note.textContent = "El navegador no permitió iniciar la música automáticamente. Tocá el parlante para intentarlo de nuevo.";
      hasTriedPlayback = false;
    }
  }
  $("#open-envelope").addEventListener("click", startMusicFromOpeningGesture);
  $("#skip-envelope").addEventListener("click", startMusicFromOpeningGesture);
  speaker.addEventListener("click", async () => {
    if (!CONFIG.musicFile.trim()) return;
    try {
      if (audio.paused) { audio.muted = false; await audio.play(); }
      else { audio.muted = !audio.muted; }
      speaker.textContent = audio.muted ? "🔇" : "🔊";
      speaker.setAttribute("aria-pressed", String(audio.muted));
      speaker.setAttribute("aria-label", audio.muted ? "Activar sonido" : "Silenciar música");
      note.textContent = audio.muted ? "Música silenciada." : "La música está sonando.";
    } catch (error) { note.textContent = "No se pudo reproducir la música. Revisá el archivo configurado."; }
  });
}

function setupGuestForm() {
  const form = $("#guest-form");
  const status = $("#form-status");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    if (!CONFIG.formEndpoint.trim()) {
      status.textContent = "La demostración funciona, pero todavía no se envió ni guardó ninguna respuesta. Configurá un servicio de formularios para recibir confirmaciones.";
      return;
    }

    try {
      const response = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      if (!response.ok) throw new Error("El servicio rechazó la respuesta.");
      status.textContent = "¡Gracias! Tu respuesta fue enviada.";
      form.reset();
    } catch (error) {
      status.textContent = "No se pudo enviar. Verificá la conexión y la configuración del formulario, o contactá a quien organiza el evento.";
    }
  });
}

setOptionalLink("#spotify-link", CONFIG.spotifyUrl);
setOptionalLink("#payment-link", CONFIG.paymentUrl);
setupCountdown();
setupMap();
setupMusic();
setupGuestForm();


/* Compatibilidad y reparación de apertura del sobre */
function openEnvelopeFallback() {
  const envelopeScreen = document.querySelector("#envelope-screen, .envelope-screen, .envelope-overlay, #envelope");
  const mainContent = document.querySelector("main");
  if (envelopeScreen) {
    envelopeScreen.classList.add("is-open", "opened", "hidden");
    envelopeScreen.setAttribute("aria-hidden", "true");
    envelopeScreen.style.pointerEvents = "none";
    envelopeScreen.style.opacity = "0";
    envelopeScreen.style.visibility = "hidden";
    envelopeScreen.style.transition = "opacity .5s ease, visibility .5s ease";
  }
  if (mainContent) {
    mainContent.classList.add("invitation-visible");
    mainContent.style.visibility = "visible";
    mainContent.style.opacity = "1";
    mainContent.style.display = "";
  }
  document.body.classList.add("envelope-opened");
  const audio = document.querySelector("#background-music");
  if (audio && audio.src) audio.play().catch(() => {});
}
document.addEventListener("DOMContentLoaded", () => {
  const opener = document.querySelector("#open-envelope, #skip-envelope, [data-open-envelope]");
  const envelopeScreen = document.querySelector("#envelope-screen, .envelope-screen, .envelope-overlay, #envelope");
  if (opener) opener.addEventListener("click", openEnvelopeFallback);
  if (envelopeScreen) {
    envelopeScreen.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      if (event.target.closest(".envelope, .envelope-wrap, .envelope-container, .envelope-card, .envelope-flap, .envelope-body, .envelope-seal")) {
        openEnvelopeFallback();
      }
    });
  }
});

/* Apertura del sobre de XV Josefina */
(() => {
  function configurarSobre() {
    const pantalla = document.getElementById("envelope-screen");
    const sobre = document.getElementById("open-envelope");
    const saltar = document.getElementById("skip-envelope");
    const tarjeta = document.getElementById("invitation-content");

    if (!pantalla || !sobre || !tarjeta) return;

    // Al cargar, mostrar el sobre y ocultar la tarjeta.
    pantalla.classList.remove("hidden", "is-opening", "is-open", "opened");
    pantalla.style.opacity = "1";
    pantalla.style.visibility = "visible";
    pantalla.style.pointerEvents = "auto";

    tarjeta.classList.remove("invitation-visible");
    tarjeta.setAttribute("aria-hidden", "true");

    let abriendo = false;

    function abrirInvitacion() {
      if (abriendo) return;
      abriendo = true;

      pantalla.classList.add("is-opening");

      window.setTimeout(() => {
        pantalla.classList.add("hidden");
        pantalla.setAttribute("aria-hidden", "true");

        tarjeta.classList.add("invitation-visible");
        tarjeta.setAttribute("aria-hidden", "false");

        abriendo = false;
      }, 700);

      // Intenta iniciar la música si está configurada.
      const musica = document.getElementById("background-music");
      if (musica && musica.getAttribute("src")) {
        musica.play().catch(() => {
          // Algunos navegadores requieren iniciar el audio manualmente.
        });
      }
    }

    sobre.addEventListener("click", abrirInvitacion);
    if (saltar) saltar.addEventListener("click", abrirInvitacion);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", configurarSobre);
  } else {
    configurarSobre();
  }
})();

