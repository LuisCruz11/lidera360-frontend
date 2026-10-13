import { normalizar } from "../personalCapacitado/utils";

export { formatearFechaHora, formatearRangoFechas, normalizar } from "../personalCapacitado/utils";

const ETIQUETAS_REGISTRO = {
  actividad: "Actividad",
  evaluacion: "Evaluación",
  nota: "Nota de apoyo",
  avance_nivel: "Avance de nivel",
  cancelacion: "Cancelación",
  asistencia: "Asistencia",
};

export const etiquetaRegistro = (accion = "") => ETIQUETAS_REGISTRO[normalizar(accion)] || "Registro";
