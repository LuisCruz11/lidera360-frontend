import axiosClient from "./axiosClient";

export const registrarClienteUsuario = (data) => {
  return axiosClient.post("/usuarios/registro", data);
};

export const loginUsuario = (data) => {
  return axiosClient.post("/usuarios/login", data);
};