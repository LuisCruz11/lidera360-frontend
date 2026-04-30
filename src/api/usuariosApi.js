import axiosClient from "./axiosClient";

export const registrarClienteUsuario = (data) => {
  return axiosClient.post("/usuarios/registro", data);
};
