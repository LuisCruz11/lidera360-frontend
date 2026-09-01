export const quitarAcentos = (valor = "") =>
  valor
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formateadorCorto = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formateadorLargo = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const formateadorMes = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

export function crearFecha(fecha) {
  if (!fecha) return null;
  const fechaNormalizada = typeof fecha === "string" && fecha.length <= 10 ? `${fecha}T00:00:00` : fecha;
  const fechaObjeto = new Date(fechaNormalizada);
  return Number.isNaN(fechaObjeto.getTime()) ? null : fechaObjeto;
}

export function formatearFecha(fecha, tipo = "corta") {
  const fechaObjeto = crearFecha(fecha);
  if (!fechaObjeto) return "Por definir";
  return (tipo === "larga" ? formateadorLargo : formateadorCorto).format(fechaObjeto).replace(".", "");
}

export function formatearRangoFechas(fechaInicio, fechaFin) {
  if (fechaInicio && fechaFin) {
    return `${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;
  }

  return formatearFecha(fechaInicio || fechaFin);
}

export function obtenerNivel(categoria = "") {
  const texto = quitarAcentos(categoria);
  if (!texto) return "";
  if (texto.includes("avanz")) return "avanzado";
  if (texto.includes("pl") || texto.includes("planificacion")) return "pl";
  return "basico";
}

export function obtenerGrupoEstado(estado = "") {
  const texto = quitarAcentos(estado);
  if (texto.includes("no aprobado") || texto.includes("reprob") || texto.includes("rechaz")) return "no-aprobado";
  if (texto.includes("aprob") || texto.includes("finaliz") || texto.includes("complet")) return "aprobado";
  return "en-curso";
}

export function obtenerEtiquetaEstado(estado = "") {
  if (!estado) return "";
  const grupo = obtenerGrupoEstado(estado);
  if (grupo === "aprobado") return "Aprobado";
  if (grupo === "no-aprobado") return "No Aprobado";
  if (quitarAcentos(estado).includes("inici")) return "En Progreso";
  return estado;
}

export function obtenerIniciales(nombre = "") {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "CL";
  return partes.slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();
}

export function normalizarTaller(taller) {
  const categoria = taller.categoria || taller.tipo_taller || "";
  const estado = obtenerEtiquetaEstado(taller.estado || taller.estado_taller || "");
  return {
    id_taller: taller.id_taller,
    id_inscripcion: taller.id_inscripcion,
    nombre: taller.nombre || "",
    categoria,
    fecha_inicio: taller.fecha_inicio,
    fecha_fin: taller.fecha_fin,
    coach: taller.coach || "",
    estado,
    fecha_inscripcion: taller.fecha_inscripcion || null,
    id_tipo_taller: taller.id_tipo_taller,
    nivel: taller.nivel || obtenerNivel(categoria),
  };
}

export function construirCeldasCalendario(fechaBase, talleres) {
  const anio = fechaBase.getFullYear();
  const mes = fechaBase.getMonth();
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const celdas = [];

  for (let i = 0; i < primerDia; i += 1) {
    celdas.push({ clave: `vacio-${i}`, dia: null, eventos: [] });
  }

  for (let dia = 1; dia <= totalDias; dia += 1) {
    const fechaDia = new Date(anio, mes, dia);
    const eventos = talleres.filter((taller) => {
      const inicio = crearFecha(taller.fecha_inicio);
      const fin = crearFecha(taller.fecha_fin) || inicio;
      return inicio && inicio <= fechaDia && fin >= fechaDia;
    });

    celdas.push({ clave: `${anio}-${mes}-${dia}`, dia, eventos });
  }

  while (celdas.length % 7 !== 0) {
    celdas.push({ clave: `final-${celdas.length}`, dia: null, eventos: [] });
  }

  return celdas;
}

export const seccionesCliente = [
  { id: "talleres", etiqueta: "Mis Talleres", icono: "book" },
  { id: "inscripciones", etiqueta: "Inscripciones", icono: "clipboard" },
  { id: "calendario", etiqueta: "Calendario", icono: "calendar" },
  { id: "perfil", etiqueta: "Perfil", icono: "user" },
];
