import axiosClient from "./axiosClient";

export const obtenerClientes = () => axiosClient.get("/clientes/");
export const crearCliente = (data) => axiosClient.post("/clientes/", data);
export const actualizarCliente = (cedula, data) => axiosClient.put(`/clientes/${cedula}`, data);
export const eliminarCliente = (cedula) => axiosClient.delete(`/clientes/${cedula}`);

export const obtenerTalleres = () => axiosClient.get("/talleres/");
export const crearTaller = (data) => axiosClient.post("/talleres/", data);
export const actualizarTaller = (idTaller, data) => axiosClient.put(`/talleres/${idTaller}`, data);
export const eliminarTaller = (idTaller) => axiosClient.delete(`/talleres/${idTaller}`);

export const obtenerInscripciones = () => axiosClient.get("/inscripciones/");
export const crearInscripcion = (data) => axiosClient.post("/inscripciones/", data);
export const eliminarInscripcion = (idInscripcion) => axiosClient.delete(`/inscripciones/${idInscripcion}`);

export const obtenerPersonal = () => axiosClient.get("/personal/");
export const crearPersonal = (data) => axiosClient.post("/personal/", data);
export const actualizarPersonal = (cedula, data) => axiosClient.put(`/personal/${cedula}`, data);
export const eliminarPersonal = (cedula) => axiosClient.delete(`/personal/${cedula}`);

export const obtenerUsuarios = () => axiosClient.get("/usuarios/");
export const obtenerEstados = () => axiosClient.get("/estados/");
export const obtenerRoles = () => axiosClient.get("/roles/");
export const obtenerTiposTaller = () => axiosClient.get("/tipos-taller/");
export const obtenerProgresosClientes = () => axiosClient.get("/progresos-clientes/");
export const obtenerTallerPersonal = () => axiosClient.get("/taller-personal/");
export const obtenerAuditorias = () => axiosClient.get("/auditorias/");
