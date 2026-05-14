// Funciones de normalización y formato
export const normalizar = (valor = "") =>
  valor
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const crearFecha = (fecha) => {
  if (!fecha) return null;
  const normalizada = typeof fecha === "string" && fecha.length <= 10 ? `${fecha}T00:00:00` : fecha;
  const fechaObjeto = new Date(normalizada);
  return Number.isNaN(fechaObjeto.getTime()) ? null : fechaObjeto;
};

const formatterFecha = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formatearFecha = (fecha) => {
  const fechaObjeto = crearFecha(fecha);
  if (!fechaObjeto) return "Por definir";
  return formatterFecha.format(fechaObjeto).replace(".", "");
};

export const formatearRangoFechas = (inicio, fin) => {
  if (inicio && fin) return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
  return formatearFecha(inicio || fin);
};

export const nombreCompleto = (persona = {}) =>
  `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";

export const crearMapa = (lista, llave) => new Map(lista.map((item) => [String(item[llave]), item]));

export const ordenarPorFechaDesc = (lista, llave) =>
  [...lista].sort((a, b) => {
    const fechaA = crearFecha(a[llave])?.getTime() || 0;
    const fechaB = crearFecha(b[llave])?.getTime() || 0;
    return fechaB - fechaA;
  });

export const hoyISO = () => {
  const fecha = new Date();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

export const formulariosIniciales = {
  cliente: {
    cedula: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    sexo: "M",
    edad: "",
    id_estado: "",
    id_tipo_taller: "",
  },
  taller: {
    nombre: "",
    id_tipo_taller: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_estado: "",
    coach: "",
    coordinador: "",
  },
  inscripcion: {
    cliente_cedula: "",
    id_taller: "",
    id_estado: "",
    fecha_inscripcion: hoyISO(),
  },
  personal: {
    cedula: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    id_rol: "",
    username: "",
    password: "",
    activo: true,
  },
};

export const seccionesAdmin = [
  { id: "panel", etiqueta: "Panel", icono: "grid" },
  { id: "clientes", etiqueta: "Clientes", icono: "users" },
  { id: "talleres", etiqueta: "Talleres", icono: "cap" },
  { id: "inscripciones", etiqueta: "Inscripciones", icono: "clipboard" },
  { id: "personal", etiqueta: "Personal", icono: "person" },
  { id: "progreso", etiqueta: "Progreso", icono: "trend" },
  { id: "auditoria", etiqueta: "Auditoría", icono: "history" },
  { id: "calendario", etiqueta: "Calendario", icono: "calendar" },
];
