import axiosClient from "./axiosClient";

export const obtenerTalleresCoach = () => axiosClient.get("/coach/talleres");
export const obtenerDetalleTallerCoach = (idTaller) => axiosClient.get(`/coach/talleres/${idTaller}`);
export const registrarActividadCoach = (idTaller, data) => axiosClient.post(`/coach/talleres/${idTaller}/actividades`, data);
export const evaluarParticipanteCoach = (idInscripcion, data) =>
  axiosClient.put(`/coach/inscripciones/${idInscripcion}/evaluacion`, data);
export const obtenerEstadosCoach = () => axiosClient.get("/estados/");
