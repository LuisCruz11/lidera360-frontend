import axiosClient from "./axiosClient";

const BASE = "/personal-capacitado";

export const obtenerTalleresPersonal = () => axiosClient.get(`${BASE}/talleres`);
export const obtenerClientesPersonal = () => axiosClient.get(`${BASE}/clientes`);
export const obtenerDetalleTallerPersonal = (idTaller) => axiosClient.get(`${BASE}/talleres/${idTaller}`);
export const agregarNotaTallerPersonal = (idTaller, data) => axiosClient.post(`${BASE}/talleres/${idTaller}/notas`, data);
export const obtenerAsistenciaTaller = (idTaller, fecha) =>
  axiosClient.get(`${BASE}/talleres/${idTaller}/asistencia`, { params: { fecha } });
export const registrarAsistenciaTaller = (idTaller, data) => axiosClient.put(`${BASE}/talleres/${idTaller}/asistencia`, data);
