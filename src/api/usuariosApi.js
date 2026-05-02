import axiosClient from "./axiosClient";

export const registrarUsuario = (data) => {
  return axiosClient.post("/usuarios/registro", data);
};

export const loginUsuario = (data) => {
  return axiosClient.post("/usuarios/login", data);
};