const formatterFecha = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formatterFechaHora = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const crearFecha = (fecha) => {
  if (!fecha) return null;
  const normalizada = typeof fecha === "string" && fecha.length <= 10 ? `${fecha}T00:00:00` : fecha;
  const fechaObjeto = new Date(normalizada);
  return Number.isNaN(fechaObjeto.getTime()) ? null : fechaObjeto;
};

export const formatearFecha = (fecha) => {
  const fechaObjeto = crearFecha(fecha);
  if (!fechaObjeto) return "Por definir";
  return formatterFecha.format(fechaObjeto).replace(".", "");
};

export const formatearFechaHora = (fecha) => {
  const fechaObjeto = crearFecha(fecha);
  if (!fechaObjeto) return "";
  return formatterFechaHora.format(fechaObjeto).replace(".", "");
};

export const formatearRangoFechas = (inicio, fin) => {
  if (inicio && fin) return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
  return formatearFecha(inicio || fin);
};

export const normalizar = (valor = "") =>
  valor
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const crearMapa = (lista, llave) => new Map(lista.map((item) => [String(item[llave]), item]));

export const nombreCompleto = (persona = {}) =>
  `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";
