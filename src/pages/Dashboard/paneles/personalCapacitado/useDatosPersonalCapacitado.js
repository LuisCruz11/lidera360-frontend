import { useCallback, useEffect, useMemo, useState } from "react";
import {
  agregarNotaTallerPersonal,
  obtenerClientesPersonal,
  obtenerDetalleTallerPersonal,
  obtenerTalleresPersonal,
} from "../../../../api/personalCapacitadoApi";
import { normalizar } from "./utils";

export function useDatosPersonalCapacitado() {
  const [seccionActiva, setSeccionActiva] = useState("talleres");
  const [talleres, setTalleres] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const [detalleTaller, setDetalleTaller] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [nota, setNota] = useState("");
  const [guardandoNota, setGuardandoNota] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState("");

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      const [talleresRes, clientesRes] = await Promise.all([obtenerTalleresPersonal(), obtenerClientesPersonal()]);
      setTalleres(Array.isArray(talleresRes.data) ? talleresRes.data : []);
      setClientes(Array.isArray(clientesRes.data) ? clientesRes.data : []);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo cargar la información.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(cargarDatos);
  }, [cargarDatos]);

  const talleresFiltrados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    if (!texto) return talleres;
    return talleres.filter((taller) =>
      [taller.nombre, taller.tipo_taller, taller.estado].some((valor) => normalizar(valor || "").includes(texto))
    );
  }, [busqueda, talleres]);

  const clientesFiltrados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    if (!texto) return clientes;
    return clientes.filter((cliente) =>
      [cliente.nombres, cliente.apellidos, cliente.cedula, cliente.estado, cliente.talleres].some((valor) =>
        normalizar(String(valor || "")).includes(texto)
      )
    );
  }, [busqueda, clientes]);

  const estadisticas = useMemo(
    () => ({
      totalTalleres: talleres.length,
      totalParticipantes: talleres.reduce((total, taller) => total + Number(taller.total_inscritos || 0), 0),
    }),
    [talleres]
  );

  const recargarDetalle = async (idTaller) => {
    const respuesta = await obtenerDetalleTallerPersonal(idTaller);
    setDetalleTaller(respuesta.data);
  };

  const abrirDetalleTaller = async (taller) => {
    setTallerSeleccionado(taller);
    setDetalleTaller(null);
    setErrorDetalle("");
    setNota("");
    setCargandoDetalle(true);
    try {
      await recargarDetalle(taller.id_taller);
    } catch (err) {
      setErrorDetalle(err.response?.data?.mensaje || "No se pudo cargar el detalle del taller.");
    } finally {
      setCargandoDetalle(false);
    }
  };

  const cerrarDetalleTaller = () => {
    setTallerSeleccionado(null);
    setDetalleTaller(null);
    setNota("");
    setErrorDetalle("");
  };

  const enviarNota = async (event) => {
    event.preventDefault();
    if (!tallerSeleccionado || !nota.trim() || guardandoNota) return;

    setGuardandoNota(true);
    setErrorDetalle("");
    try {
      await agregarNotaTallerPersonal(tallerSeleccionado.id_taller, { descripcion: nota.trim() });
      setNota("");
      await recargarDetalle(tallerSeleccionado.id_taller);
    } catch (err) {
      setErrorDetalle(err.response?.data?.mensaje || "No se pudo agregar la nota.");
    } finally {
      setGuardandoNota(false);
    }
  };

  return {
    seccionActiva,
    setSeccionActiva,
    busqueda,
    setBusqueda,
    cargando,
    error,
    talleresFiltrados,
    clientesFiltrados,
    estadisticas,
    tallerSeleccionado,
    detalleTaller,
    cargandoDetalle,
    nota,
    setNota,
    guardandoNota,
    errorDetalle,
    abrirDetalleTaller,
    cerrarDetalleTaller,
    enviarNota,
    recargarDetalle,
  };
}
