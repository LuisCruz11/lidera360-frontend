import { useCallback, useEffect, useMemo, useState } from "react";
import {
  crearCliente,
  crearInscripcion,
  crearPersonal,
  crearTaller,
  eliminarCliente,
  eliminarInscripcion,
  eliminarPersonal,
  eliminarTaller,
  obtenerAuditorias,
  obtenerClientes,
  obtenerEstados,
  obtenerInscripciones,
  obtenerPersonal,
  obtenerProgresosClientes,
  obtenerRoles,
  obtenerTalleres,
  obtenerTallerPersonal,
  obtenerTiposTaller,
  obtenerUsuarios,
} from "../../../../api/adminApi";

export function useCoordinadorData() {
  const [clientes, setClientes] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estados, setEstados] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tiposTaller, setTiposTaller] = useState([]);
  const [progresos, setProgresos] = useState([]);
  const [tallerPersonal, setTallerPersonal] = useState([]);
  const [auditorias, setAuditorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");

    try {
      const [
        clientesRes,
        talleresRes,
        inscripcionesRes,
        personalRes,
        usuariosRes,
        estadosRes,
        rolesRes,
        tiposRes,
        progresosRes,
        tallerPersonalRes,
        auditoriasRes,
      ] = await Promise.all([
        obtenerClientes(),
        obtenerTalleres(),
        obtenerInscripciones(),
        obtenerPersonal(),
        obtenerUsuarios(),
        obtenerEstados(),
        obtenerRoles(),
        obtenerTiposTaller(),
        obtenerProgresosClientes(),
        obtenerTallerPersonal(),
        obtenerAuditorias(),
      ]);

      setClientes(Array.isArray(clientesRes.data) ? clientesRes.data : []);
      setTalleres(Array.isArray(talleresRes.data) ? talleresRes.data : []);
      setInscripciones(Array.isArray(inscripcionesRes.data) ? inscripcionesRes.data : []);
      setPersonal(Array.isArray(personalRes.data) ? personalRes.data : []);
      setUsuarios(Array.isArray(usuariosRes.data) ? usuariosRes.data : []);
      setEstados(Array.isArray(estadosRes.data) ? estadosRes.data : []);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
      setTiposTaller(Array.isArray(tiposRes.data) ? tiposRes.data : []);
      setProgresos(Array.isArray(progresosRes.data) ? progresosRes.data : []);
      setTallerPersonal(Array.isArray(tallerPersonalRes.data) ? tallerPersonalRes.data : []);
      setAuditorias(Array.isArray(auditoriasRes.data) ? auditoriasRes.data : []);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo cargar la información del panel.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return {
    clientes,
    talleres,
    inscripciones,
    personal,
    usuarios,
    estados,
    roles,
    tiposTaller,
    progresos,
    tallerPersonal,
    auditorias,
    cargando,
    error,
    cargarDatos,
    crearCliente,
    crearInscripcion,
    crearPersonal,
    crearTaller,
    eliminarCliente,
    eliminarInscripcion,
    eliminarPersonal,
    eliminarTaller,
  };
}
