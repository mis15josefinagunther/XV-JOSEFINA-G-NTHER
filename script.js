/* ==========================================================
   Invitación XV Josefina Günther
   ----------------------------------------------------------
   SI QUERÉS CAMBIAR ALGO, TOCÁ SOLO ESTE BLOQUE "CONFIG".
   Lo que está debajo de la línea larga no hace falta modificarlo.
   ========================================================== */
const CONFIG = {
  // Fecha y hora del evento (hora de Argentina). Formato: AAAA-MM-DDThh:mm:00-03:00
  fecha: "2027-02-20T21:00:00-03:00",
  duracionHoras: 6, // se usa solo para "Agendar la fecha" (calendario del celular)

  lugarNombre: "Salón Altos Álamos",
  // Dirección que se muestra en la tarjeta (opcional). Ej.: "Calle 123, Localidad, Provincia"
  lugarDireccion: "",
  // Texto que usa Google Maps para ubicar el salón. Cuanto más completo, mejor.
  // Ej.: "Altos Álamos Eventos, Localidad, Provincia"
  mapaBusqueda: "Altos Álamos Eventos",

  // Nombre EXACTO del archivo de música subido a GitHub (dejalo vacío "" para no usar música).
  // Recomendado: renombrar el archivo a musica.mp3 y poner aquí "musica.mp3".
  musica: "I See The Light (From Tangled) - Royal Philharmonic Orchestra.mp3",

  spotify: "https://open.spotify.com/playlist/3p9KdLksmJ1PxLYJjSvuZG?si=epg-rHxVTf-y5X23X3TgnA&utm_source=copy-link&pt=f26e9aa71449e25198682a39301bd6c7&pi=FMetXXflTcacd",
  mercadoPago: "https://link.mercadopago.com.ar/xvjuji",

  // URL de Google Apps Script que termina en /exec (ver README.md, paso 8).
  formulario: ""
};

/* ---------------------------------------------------------- */

const $ = (selector) => document.querySelector(selector);
const ZONA = "America/Argentina/Buenos_Aires";
const fechaEvento = new Date(CONFIG.fecha);

document.documentElement.classList.add("js");

/* ---------- Fecha en pantalla ---------- */
function capitalizar(texto) { return texto.charAt(0).toUpperCase() + texto.slice(1); }

function mostrarFecha() {
  if (isNaN(fechaEvento)) return;
  const fmt = (opts) => new Intl.DateTimeFormat("es-AR", { timeZone: ZONA, ...opts }).format(fechaEvento);
  const semana = capitalizar(fmt({ weekday: "long" }));
  const dia = fmt({ day: "numeric" });
  const mes = capitalizar(fmt({ month: "long" }));
  const anio = fmt({ year: "numeric" });
  const hora = fmt({ hour: "2-digit", minute: "2-digit", hour12: false }) + " hs";
  const set = (sel, txt) => { const el = $(sel); if (el) el.textContent = txt; };
  set("#dia-semana", semana);
  set("#dia-num", dia);
  set("#mes-anio", `${mes} ${anio}`);
  set("#hora-txt", hora);
  set("#fecha-larga", `${semana} ${dia} de ${mes.toLowerCase()} de ${anio} · ${hora}`);
}

/* ---------- Enlaces ---------- */
function configurarEnlace(selector, url) {
  const link = $(selector);
  if (!link) return;
  if (url && /^https:\/\/\S+/i.test(url)) {
    link.href = url;
    link.removeAttribute("aria-disabled");
  } else {
    link.hidden = true; // si no hay enlace, el botón no se muestra (no queda un botón "muerto")
  }
}

function configurarLugar() {
  const nombre = $(".place-name");
  if (nombre && CONFIG.lugarNombre) nombre.textContent = CONFIG.lugarNombre;
  const dir = $("#place-address");
  if (dir && CONFIG.lugarDireccion.trim()) {
    dir.textContent = CONFIG.lugarDireccion.trim();
    dir.hidden = false;
  }
  const busqueda = (CONFIG.mapaBusqueda || CONFIG.lugarDireccion || "").trim();
  const mapa = $("#map-link");
  if (!mapa) return;
  if (busqueda) {
    mapa.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(busqueda);
  } else {
    mapa.hidden = true;
  }
}

/* ---------- Agendar en el calendario (.ics) ---------- */
function configurarCalendario() {
  const boton = $("#calendar-button");
  if (!boton) return;
  if (isNaN(fechaEvento)) { boton.hidden = true; return; }
  boton.addEventListener("click", () => {
    const fin = new Date(fechaEvento.getTime() + CONFIG.duracionHoras * 3600 * 1000);
    const f = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1");
    const lugar = [CONFIG.lugarNombre, CONFIG.lugarDireccion].filter(Boolean).join(", ");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//XV Josefina//ES", "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:xv-josefina-guenther@invitacion",
      "DTSTAMP:" + f(new Date()),
      "DTSTART:" + f(fechaEvento),
      "DTEND:" + f(fin),
      "SUMMARY:" + esc("XV de Josefina Günther"),
      "LOCATION:" + esc(lugar),
      "DESCRIPTION:" + esc("¡Te espero para celebrar mis quince años!"),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Mañana son los XV de Josefina", "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "XV-Josefina.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  });
}

/* ---------- Cuenta regresiva ---------- */
function configurarCuentaRegresiva() {
  const nota = $("#countdown-note");
  if (isNaN(fechaEvento)) return;
  const ids = { d: $("#days"), h: $("#hours"), m: $("#minutes"), s: $("#seconds") };
  function actualizar() {
    const restante = fechaEvento.getTime() - Date.now();
    if (restante <= 0) {
      Object.values(ids).forEach((el) => { if (el) el.textContent = "0"; });
      if (nota) nota.textContent = restante > -86400000
        ? "¡Llegó el gran día! ¡A celebrar!"
        : "¡Gracias por haber sido parte de esta noche especial!";
      return;
    }
    const seg = Math.floor(restante / 1000);
    ids.d.textContent = Math.floor(seg / 86400);
    ids.h.textContent = String(Math.floor((seg % 86400) / 3600)).padStart(2, "0");
    ids.m.textContent = String(Math.floor((seg % 3600) / 60)).padStart(2, "0");
    ids.s.textContent = String(seg % 60).padStart(2, "0");
    setTimeout(actualizar, 1000);
  }
  actualizar();
}

/* ---------- Música ---------- */
function configurarMusica() {
  const audio = $("#background-music");
  const boton = $("#speaker-toggle");
  if (!audio || !boton || !CONFIG.musica.trim()) return;

  audio.src = encodeURI(CONFIG.musica.trim());
  audio.volume = 0.55;
  let disponible = true;

  // Si el archivo no existe o no se puede reproducir, el botón queda oculto (sin mostrar errores)
  audio.addEventListener("error", () => { disponible = false; boton.hidden = true; });

  function actualizarBoton() {
    const sonando = !audio.paused;
    boton.classList.toggle("is-muted", !sonando);
    boton.setAttribute("aria-pressed", String(!sonando));
    boton.setAttribute("aria-label", sonando ? "Silenciar música" : "Activar música");
  }

  boton.addEventListener("click", async () => {
    try {
      if (audio.paused) await audio.play(); else audio.pause();
    } catch (_) { /* el navegador no permitió reproducir */ }
    actualizarBoton();
  });
  audio.addEventListener("play", actualizarBoton);
  audio.addEventListener("pause", actualizarBoton);

  // Se llama cuando la persona toca el sobre (los navegadores solo permiten sonido después de un toque)
  window.iniciarMusica = async () => {
    if (!disponible) return;
    boton.hidden = false;
    try { await audio.play(); } catch (_) { /* queda en pausa; la persona puede tocar el botón */ }
    actualizarBoton();
  };
}

/* ---------- Sobre ---------- */
function configurarSobre() {
  const pantalla = $("#envelope-screen");
  const abrir = $("#open-envelope");
  const saltar = $("#skip-envelope");
  const contenido = $("#invitation-content");
  if (!pantalla || !abrir || !contenido) return;
  let abierto = false;

  function abrirInvitacion() {
    if (abierto) return;
    abierto = true;
    pantalla.classList.add("is-opening");
    if (typeof window.iniciarMusica === "function") window.iniciarMusica();
    setTimeout(() => {
      pantalla.classList.add("hidden");
      pantalla.setAttribute("aria-hidden", "true");
      contenido.classList.add("invitation-visible");
      contenido.setAttribute("aria-hidden", "false");
      window.scrollTo(0, 0);
      activarAparicion();
    }, 750);
  }
  abrir.addEventListener("click", abrirInvitacion);
  if (saltar) saltar.addEventListener("click", abrirInvitacion);
}

/* ---------- Aparición suave al hacer scroll ---------- */
function activarAparicion() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) { items.forEach((el) => el.classList.add("in")); return; }
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach((el) => obs.observe(el));
}

/* ---------- Fotos: cada foto va en su marco; si falta el archivo, el marco no se muestra ---------- */
function configurarFotos() {
  document.querySelectorAll(".photo-frame").forEach((marco) => {
    const img = marco.querySelector("img");
    if (!img) { marco.remove(); return; }
    if (img.complete) { if (img.naturalWidth === 0) marco.remove(); return; }
    img.addEventListener("error", () => marco.remove(), { once: true });
  });
}

/* ---------- Formulario ---------- */
function configurarFormulario() {
  const form = $("#guest-form");
  const estado = $("#form-status");
  const exito = $("#form-success");
  if (!form || !estado) return;
  const boton = $("#submit-button");

  const MENSAJES = {
    integrantes: "Escribí el nombre de quienes asistirán.",
    asistencia: "Elegí si confirmás o no tu asistencia.",
    telefono: "Escribí un teléfono de contacto.",
    menu: "Elegí un menú."
  };

  function limpiarError(campo) {
    campo.classList.remove("invalid");
    const msg = campo.querySelector(".field-error");
    if (msg) msg.remove();
  }
  function marcarError(campo, texto) {
    limpiarError(campo);
    campo.classList.add("invalid");
    const msg = document.createElement("span");
    msg.className = "field-error";
    msg.textContent = texto;
    campo.appendChild(msg);
  }
  function validar() {
    let primerError = null;
    ["integrantes", "asistencia", "telefono", "menu"].forEach((nombre) => {
      const control = form.elements[nombre];
      const campo = (control.length ? control[0] : control).closest(".field");
      let valido;
      if (nombre === "asistencia") valido = !!form.querySelector('input[name="asistencia"]:checked');
      else valido = control.value.trim() !== "";
      if (nombre === "telefono" && valido) valido = control.value.replace(/\D/g, "").length >= 6;
      if (valido) limpiarError(campo);
      else {
        marcarError(campo, nombre === "telefono" && control.value.trim() ? "Revisá el número de teléfono." : MENSAJES[nombre]);
        if (!primerError) primerError = campo;
      }
    });
    if (primerError) primerError.scrollIntoView({ behavior: "smooth", block: "center" });
    return !primerError;
  }

  form.addEventListener("input", (e) => { const campo = e.target.closest(".field"); if (campo) limpiarError(campo); });
  form.addEventListener("change", (e) => { const campo = e.target.closest(".field"); if (campo) limpiarError(campo); });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    estado.className = "form-status";
    if (!validar()) { estado.textContent = "Revisá los campos marcados."; estado.classList.add("error"); return; }
    if (!CONFIG.formulario || !CONFIG.formulario.includes("/exec")) {
      estado.textContent = "El formulario todavía no está conectado. Falta configurar la URL de Google Apps Script.";
      estado.classList.add("error");
      return;
    }
    boton.disabled = true; boton.textContent = "Enviando…";
    estado.textContent = "";

    const params = new URLSearchParams();
    for (const [clave, valor] of new FormData(form).entries()) params.append(clave, String(valor).trim());
    const asiste = form.querySelector('input[name="asistencia"]:checked').value.startsWith("Sí");

    try {
      await fetch(CONFIG.formulario, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: params.toString()
      });
      form.hidden = true;
      $("#success-title").textContent = asiste ? "¡Gracias por confirmar!" : "¡Gracias por avisarnos!";
      $("#success-text").textContent = asiste
        ? "Recibimos tu confirmación. ¡Nos vemos para festejar juntos!"
        : "Recibimos tu respuesta. Lamentamos que no puedas acompañarnos, ¡te vamos a extrañar!";
      exito.hidden = false;
      exito.focus();
      exito.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (_) {
      estado.textContent = "No se pudo enviar. Revisá tu conexión e intentá de nuevo.";
      estado.classList.add("error");
      boton.disabled = false; boton.textContent = "Enviar confirmación";
    }
  });
}

/* ---------- Inicio ---------- */
mostrarFecha();
configurarEnlace("#spotify-link", CONFIG.spotify);
configurarEnlace("#payment-link", CONFIG.mercadoPago);
configurarLugar();
configurarCalendario();
configurarCuentaRegresiva();
configurarMusica();
configurarFotos();
configurarSobre();
configurarFormulario();
