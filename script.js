/* Invitación XV Josefina Günther — versión simplificada y adaptada a celular */
const CONFIG = {
  eventYear: 2027,
  eventMonth: 1, // febrero: enero=0
  eventDay: 20,
  eventHour: 21,
  venueAddress: "Altos Álamos Eventos",
  musicFile: "I See The Light (From Tangled) - Royal Philharmonic Orchestra.mp3",
  spotifyUrl: "https://open.spotify.com/playlist/3p9KdLksmJ1PxLYJjSvuZG?si=epg-rHxVTf-y5X23X3TgnA&utm_source=copy-link&pt=f26e9aa71449e25198682a39301bd6c7&pi=FMetXXflTcacd",
  paymentUrl: "https://link.mercadopago.com.ar/xvjuji",
  // Usá la URL /exec del despliegue de Apps Script que vas a configurar con el código .gs incluido.
  formEndpoint: ""
};

const $ = (selector) => document.querySelector(selector);

function setupOptionalLink(selector, url) {
  const link = $(selector);
  if (!link) return;
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
  const target = new Date(CONFIG.eventYear, CONFIG.eventMonth, CONFIG.eventDay, CONFIG.eventHour, 0, 0).getTime();
  function update() {
    const remaining = target - Date.now();
    if (remaining <= 0) {
      ["#days", "#hours", "#minutes", "#seconds"].forEach(id => { if ($(id)) $(id).textContent = "0"; });
      if (note) note.textContent = remaining > -86400000 ? "¡Llegó el gran día! ¡A celebrar!" : "¡Gracias por haber sido parte de esta noche especial!";
      return;
    }
    const seconds = Math.floor(remaining / 1000);
    $("#days").textContent = Math.floor(seconds / 86400);
    $("#hours").textContent = Math.floor((seconds % 86400) / 3600);
    $("#minutes").textContent = Math.floor((seconds % 3600) / 60);
    $("#seconds").textContent = seconds % 60;
    if (note) note.textContent = "Prepará tu mejor sonrisa: ¡nos vemos pronto!";
    window.setTimeout(update, 1000);
  }
  update();
}

function setupMap() {
  const link = $("#map-link");
  if (!link || !CONFIG.venueAddress.trim()) return;
  link.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.venueAddress.trim());
  link.removeAttribute("aria-disabled");
}

function setupMusic() {
  const audio = $("#background-music");
  const speaker = $("#speaker-toggle");
  const note = $("#music-note");
  if (!audio || !speaker) return;
  if (CONFIG.musicFile.trim()) {
    audio.src = CONFIG.musicFile;
    audio.volume = 0.55;
  } else {
    if (note) note.textContent = "Para activar la música, subí un archivo de audio al repositorio y completá musicFile en script.js.";
    speaker.disabled = true;
    speaker.textContent = "♫";
    return;
  }
  async function tryPlay() {
    try {
      await audio.play();
      speaker.textContent = audio.muted ? "🔇" : "🔊";
      speaker.setAttribute("aria-pressed", String(audio.muted));
      if (note) note.textContent = audio.muted ? "Música silenciada." : "La música está sonando. Usá el parlante para silenciarla.";
    } catch (_) {
      if (note) note.textContent = "Si no comienza sola, tocá el parlante para activar la música.";
    }
  }
  speaker.addEventListener("click", async () => {
    if (audio.paused) {
      audio.muted = false;
      await tryPlay();
    } else {
      audio.muted = !audio.muted;
      speaker.textContent = audio.muted ? "🔇" : "🔊";
      speaker.setAttribute("aria-pressed", String(audio.muted));
      if (note) note.textContent = audio.muted ? "Música silenciada." : "La música está sonando.";
    }
  });
  // Los navegadores suelen bloquear el autoplay hasta que la persona toque la pantalla.
  window.startInvitationMusic = tryPlay;
}

function setupEnvelope() {
  const screen = $("#envelope-screen");
  const openButton = $("#open-envelope");
  const skipButton = $("#skip-envelope");
  const content = $("#invitation-content");
  if (!screen || !openButton || !content) return;
  let opened = false;
  function openInvitation() {
    if (opened) return;
    opened = true;
    screen.classList.add("is-opening");
    if (typeof window.startInvitationMusic === "function") window.startInvitationMusic();
    window.setTimeout(() => {
      screen.classList.add("hidden");
      screen.setAttribute("aria-hidden", "true");
      content.classList.add("invitation-visible");
      content.setAttribute("aria-hidden", "false");
      document.body.classList.add("envelope-opened");
    }, 650);
  }
  openButton.addEventListener("click", openInvitation);
  if (skipButton) skipButton.addEventListener("click", openInvitation);
}

function setupGuestForm() {
  const form = $("#guest-form");
  const status = $("#form-status");
  if (!form || !status) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!CONFIG.formEndpoint || !CONFIG.formEndpoint.includes("/exec")) {
      status.textContent = "El formulario todavía no está conectado. Falta configurar la URL de Google Apps Script.";
      return;
    }
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Enviando…"; }
    status.textContent = "Enviando tu confirmación…";
    const data = new FormData(form);
    // URLSearchParams funciona con el Apps Script incluido y evita el preflight de CORS.
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) params.append(key, value);
    try {
      await fetch(CONFIG.formEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: params.toString()
      });
      status.textContent = "¡Gracias! Tu confirmación se envió. Si necesitás corregirla, contactá a la familia organizadora.";
      form.reset();
    } catch (error) {
      status.textContent = "No se pudo enviar. Revisá la conexión e intentá nuevamente.";
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.textContent = "Enviar confirmación"; }
    }
  });
}

setupOptionalLink("#spotify-link", CONFIG.spotifyUrl);
setupOptionalLink("#payment-link", CONFIG.paymentUrl);
setupCountdown();
setupMap();
setupMusic();
setupEnvelope();
setupGuestForm();
