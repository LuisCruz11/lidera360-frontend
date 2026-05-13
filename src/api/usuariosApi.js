import axiosClient from "./axiosClient";

export const registrarUsuario = (data) => {
  return axiosClient.post("/usuarios/registro", data);
};

export const loginUsuario = (data) => {
  return axiosClient.post("/usuarios/login", data);
};

export const obtenerPanelCliente = (cedula) => {
  return axiosClient.get(`/clientes/${cedula}/panel`);
};

export const inscribirClienteTaller = (cedula, idTaller) => {
  return axiosClient.post(`/clientes/${cedula}/inscripciones`, {
    id_taller: idTaller,
  });
};
