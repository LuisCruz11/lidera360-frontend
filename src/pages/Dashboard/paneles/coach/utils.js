import { normalizar } from "../personalCapacitado/utils";

export { formatearFechaHora, formatearRangoFechas, normalizar } from "../personalCapacitado/utils";

const PALABRAS_EVALUACION = ["inici", "aprob", "reprob"];

export const filtrarEstadosEvaluacion = (estados) => {
  const filtrados = estados.filter((estado) =>
    PALABRAS_EVALUACION.some((palabra) => normalizar(estado.nombre).includes(palabra))
  );
  return filtrados.length > 0 ? filtrados : estados;
};

const ETIQUETAS_REGISTRO = {
  actividad: "Actividad",
  evaluacion: "Evaluación",
  nota: "Nota de apoyo",
  avance_nivel: "Avance de nivel",
  cancelacion: "Cancelación",
};

export const etiquetaRegistro = (accion = "") => ETIQUETAS_REGISTRO[normalizar(accion)] || "Registro";
