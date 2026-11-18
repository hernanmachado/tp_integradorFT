/* ==========================================================================
   Mesa de Ayuda IFTS 18 - JavaScript propio (sin librerías)
   Qué hace:
     1. Menú hamburguesa en pantallas chicas.
     2. Aviso "abierta/cerrada ahora" según el día y la hora.
     3. Lista de tickets filtrable por estado (datos de ejemplo + los del usuario).
     4. Formulario con validación; guarda los tickets nuevos en localStorage.
   ========================================================================== */

/* 1. Elementos del DOM que vamos a usar ------------------------------------ */
const menuBoton = document.querySelector("#menuBoton");
const menu = document.querySelector("#menu");
const atencion = document.querySelector("#atencion");
const filtros = document.querySelector("#filtros");
const listaTickets = document.querySelector("#listaTickets");
const vacio = document.querySelector("#vacio");
const borrarMios = document.querySelector("#borrarMios");
const formulario = document.querySelector("#formTicket");
const resultado = document.querySelector("#resultado");
const contador = document.querySelector("#contador");

/* 2. Datos ----------------------------------------------------------------- */
const CLAVE_STORAGE = "ifts18_mis_tickets";   // nombre con el que se guardan en el navegador

const ticketsEjemplo = [
  { id: 101, titulo: "Sin internet en la sala de profesores", estado: "En Progreso", prioridad: "Crítica", solicitante: "Mónica A.", fecha: "12/11/2026", detalle: "Ninguna computadora de la sala navega. Se revisó el switch del piso 1 y se está reemplazando el cable." },
  { id: 102, titulo: "No puedo entrar al campus virtual", estado: "Resuelto", prioridad: "Alta", solicitante: "Pepe A.", fecha: "10/11/2026", detalle: "Olvidé la contraseña y el correo de recuperación no llega. Se restableció desde el dominio." },
  { id: 103, titulo: "El proyector del aula magna no enciende", estado: "Abierto", prioridad: "Alta", solicitante: "Mónica A.", fecha: "14/11/2026", detalle: "Se probó con otro cable y otro tomacorriente. Parece que la lámpara está quemada." },
  { id: 104, titulo: "Instalar Python en las PC del aula 4", estado: "En Progreso", prioridad: "Media", solicitante: "Juan P.", fecha: "13/11/2026", detalle: "Para la cursada de programación se necesita Python 3.10 y Visual Studio Code en todas las PC." },
  { id: 105, titulo: "Alta de usuario para docente nuevo", estado: "Cerrado", prioridad: "Baja", solicitante: "Juan P.", fecha: "06/11/2026", detalle: "Crear la cuenta de dominio de la profesora de Redes con acceso al aula virtual." },
  { id: 106, titulo: "La impresora del laboratorio 2 no responde", estado: "Abierto", prioridad: "Media", solicitante: "Pepe A.", fecha: "15/11/2026", detalle: "Desde ayer aparece como desconectada en todas las computadoras del laboratorio." }
];

/* 3. localStorage: leer y guardar los tickets del usuario ------------------ */
// try/catch porque el navegador puede bloquear el almacenamiento o el dato puede estar dañado.
function leerMisTickets() {
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
    return Array.isArray(guardados) ? guardados : [];
  } catch (error) {
    return [];
  }
}

function guardarMisTickets(lista) {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lista));
  } catch (error) {
    // si no se puede guardar, el ticket igual se ve hasta que se recargue la página
  }
}

function todosLosTickets() {
  return [...leerMisTickets(), ...ticketsEjemplo];   // los del usuario primero
}

/* 4. Menú hamburguesa ------------------------------------------------------ */
function alternarMenu() {
  const abierto = menu.classList.toggle("abierto");   // agrega o quita la clase
  menuBoton.setAttribute("aria-expanded", abierto);
}
menuBoton.addEventListener("click", alternarMenu);
menu.addEventListener("click", function (evento) {
  if (evento.target.tagName === "A" && menu.classList.contains("abierto")) {
    alternarMenu();   // al elegir una sección, el menú se cierra
  }
});

/* 5. Aviso de atención: lunes a viernes de 08:00 a 18:00 ------------------- */
function estaAbierta(fecha) {
  const dia = fecha.getDay();                                // 0 = domingo ... 6 = sábado
  const hora = fecha.getHours() + fecha.getMinutes() / 60;
  return dia >= 1 && dia <= 5 && hora >= 8 && hora < 18;
}

function mostrarAtencion() {
  const abierta = estaAbierta(new Date());
  atencion.textContent = abierta
    ? "Estamos atendiendo ahora."
    : "Ahora estamos cerrados. Dejá tu ticket y lo respondemos el próximo día hábil.";
  atencion.className = "atencion " + (abierta ? "abierta" : "cerrada");
}

/* 6. Lista de tickets ------------------------------------------------------ */
let estadoElegido = "Todos";

// Crea un elemento con clase y texto. Se usa textContent (no innerHTML) para que
// lo que escribe el usuario nunca se interprete como código HTML.
function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.className = clase;
  elemento.textContent = texto;
  return elemento;
}

function crearTicket(ticket) {
  const item = document.createElement("li");
  const desplegable = crear("details", "ticket", "");
  const resumen = crear("summary", "ticket-resumen", "");
  const claseEstado = "est-" + ticket.estado.toLowerCase().replace(" ", "-");   // "En Progreso" -> "est-en-progreso"
  resumen.append(
    crear("span", "ticket-id", "#" + ticket.id),
    crear("span", "ticket-titulo", ticket.titulo),
    crear("span", "insignia " + claseEstado, ticket.estado)
  );
  const detalle = crear("div", "ticket-detalle", "");
  detalle.append(
    crear("p", "", ticket.detalle),
    crear("p", "ticket-meta", "Prioridad " + ticket.prioridad + ". Pedido por " + ticket.solicitante + " el " + ticket.fecha + ".")
  );
  desplegable.append(resumen, detalle);
  item.append(desplegable);
  return item;
}

function actualizarContadores() {
  const tickets = todosLosTickets();
  document.querySelectorAll("[data-conteo]").forEach(function (numero) {
    numero.textContent = tickets.filter(function (t) { return t.estado === numero.dataset.conteo; }).length;
  });
}

function mostrarTickets() {
  const visibles = todosLosTickets().filter(function (t) {
    return estadoElegido === "Todos" || t.estado === estadoElegido;
  });
  listaTickets.replaceChildren(...visibles.map(crearTicket));
  vacio.hidden = visibles.length > 0;
  borrarMios.hidden = leerMisTickets().length === 0;
  actualizarContadores();
}

filtros.addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");
  if (!boton) { return; }
  estadoElegido = boton.dataset.estado;
  filtros.querySelectorAll("button").forEach(function (b) {
    const activo = b === boton;
    b.classList.toggle("activo", activo);
    b.setAttribute("aria-pressed", activo);
  });
  mostrarTickets();
});

borrarMios.addEventListener("click", function () {
  if (window.confirm("¿Borrar los tickets que abriste desde este navegador?")) {
    guardarMisTickets([]);
    mostrarTickets();
  }
});

/* 7. Formulario: validación ------------------------------------------------ */
// Cada validador recibe el valor del campo y devuelve un mensaje de error, o "" si está bien.
const validadores = {
  nombre: function (valor) {
    if (valor.length < 3) { return "Escribí tu nombre y apellido (mínimo 3 letras)."; }
    if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' .-]+$/.test(valor)) { return "El nombre solo puede tener letras."; }
    return "";
  },
  dato: function (valor) {
    const esCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    const digitos = valor.replace(/\D/g, "").length;
    const esTelefono = /^[\d\s()+-]+$/.test(valor) && digitos >= 8 && digitos <= 13;
    return esCorreo || esTelefono ? "" : "Ingresá un correo válido (nombre@dominio.com) o un teléfono de 8 a 13 dígitos.";
  },
  categoria: function (valor) {
    return valor === "" ? "Elegí una categoría de la lista." : "";
  },
  mensaje: function (valor) {
    return valor.length < 10 ? "Contanos el problema con al menos 10 caracteres." : "";
  }
};

// Muestra u oculta el error de un campo. Devuelve true si el campo es válido.
function mostrarError(campo, mensaje) {
  const grupo = campo.closest(".campo");
  grupo.classList.toggle("invalido", mensaje !== "");
  grupo.querySelector(".error").textContent = mensaje;
  campo.setAttribute("aria-invalid", mensaje !== "");
  return mensaje === "";
}

function validarCampo(campo) {
  const validar = validadores[campo.name];
  return validar ? mostrarError(campo, validar(campo.value.trim())) : true;   // la prioridad no necesita validador
}

// Validación en vivo: al salir de un campo, y al escribir si ya tenía error.
formulario.addEventListener("focusout", function (evento) {
  if (evento.target.name) { validarCampo(evento.target); }
});
formulario.addEventListener("input", function (evento) {
  if (evento.target === formulario.elements.mensaje) {
    contador.textContent = evento.target.value.length + " / " + evento.target.maxLength;
  }
  if (evento.target.closest(".invalido")) { validarCampo(evento.target); }
});

function siguienteId() {
  const ids = todosLosTickets().map(function (t) { return t.id; });
  return Math.max(100, ...ids) + 1;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();   // evita que el navegador recargue la página

  const campos = Array.from(formulario.elements).filter(function (c) { return c.name; });
  const resultados = campos.map(validarCampo);   // valida todos para mostrar todos los errores juntos

  if (resultados.includes(false)) {
    resultado.textContent = "Revisá los campos marcados en rojo.";
    resultado.className = "resultado fallo";
    campos[resultados.indexOf(false)].focus();   // lleva el foco al primer error
    return;
  }

  const mensaje = formulario.elements.mensaje.value.trim();
  const nuevo = {
    id: siguienteId(),
    titulo: formulario.elements.categoria.value + ": " + (mensaje.length > 45 ? mensaje.slice(0, 45) + "..." : mensaje),
    estado: "Abierto",
    prioridad: formulario.elements.prioridad.value,
    solicitante: formulario.elements.nombre.value.trim(),
    fecha: new Date().toLocaleDateString("es-AR"),
    detalle: mensaje
  };
  guardarMisTickets([nuevo, ...leerMisTickets()]);

  formulario.reset();
  contador.textContent = "0 / " + formulario.elements.mensaje.maxLength;
  campos.forEach(function (c) { mostrarError(c, ""); });
  resultado.textContent = "Ticket #" + nuevo.id + " enviado. Ya figura como Abierto en el seguimiento.";
  resultado.className = "resultado exito";

  estadoElegido = "Todos";
  filtros.querySelectorAll("button").forEach(function (b) {
    b.classList.toggle("activo", b.dataset.estado === "Todos");
    b.setAttribute("aria-pressed", b.dataset.estado === "Todos");
  });
  mostrarTickets();
});

/* 8. Arranque -------------------------------------------------------------- */
mostrarAtencion();
mostrarTickets();
