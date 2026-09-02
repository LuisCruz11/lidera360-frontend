import { useCallback, useEffect, useMemo, useState } from "react";
import {
  agregarNotaTaller,
  obtenerClientes,
  obtenerDetalleTaller,
  obtenerEstados,
  obtenerTalleres,
  obtenerTiposTaller,
} from "../../../../api/adminApi";
import { crearMapa, normalizar } from "./utils";

export function useDatosPersonalCapacitado() {
  const [seccionActiva, setSeccionActiva] = useState("talleres");
  const [talleres, setTalleres] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [tiposTaller, setTiposTaller] = useState([]);
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
      const [talleresRes, clientesRes, estadosRes, tiposRes] = await Promise.all([
        obtenerTalleres(),
        obtenerClientes(),
        obtenerEstados(),
        obtenerTiposTaller(),
      ]);
      setTalleres(Array.isArray(talleresRes.data) ? talleresRes.data : []);
      setClientes(Array.isArray(clientesRes.data) ? clientesRes.data : []);
      setEstados(Array.isArray(estadosRes.data) ? estadosRes.data : []);
      setTiposTaller(Array.isArray(tiposRes.data) ? tiposRes.data : []);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo cargar la información.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(cargarDatos);
  }, [cargarDatos]);

  const estadoPorId = useMemo(() => crearMapa(estados, "id_estado"), [estados]);
  const tipoPorId = useMemo(() => crearMapa(tiposTaller, "id_tipo_taller"), [tiposTaller]);

  const obtenerEstado = useCallback(
    (idEstado) => estadoPorId.get(String(idEstado))?.nombre || "",
    [estadoPorId]
  );

  const obtenerTipo = useCallback(
    (idTipo) => tipoPorId.get(String(idTipo))?.nombre || "",
    [tipoPorId]
  );

  const talleresFiltrados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    if (!texto) return talleres;
    return talleres.filter((taller) =>
      [taller.nombre, obtenerTipo(taller.id_tipo_taller), obtenerEstado(taller.id_estado)].some((valor) =>
        normalizar(valor || "").includes(texto)
      )
    );
  }, [busqueda, obtenerEstado, obtenerTipo, talleres]);

  const clientesFiltrados = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    if (!texto) return clientes;
    return clientes.filter((cliente) =>
      [cliente.nombres, cliente.apellidos, cliente.cedula, obtenerEstado(cliente.id_estado)].some((valor) =>
        normalizar(String(valor || "")).includes(texto)
      )
    );
  }, [busqueda, clientes, obtenerEstado]);

  const abrirDetalleTaller = async (taller) => {
    setTallerSeleccionado(taller);
    setDetalleTaller(null);
    setErrorDetalle("");
    setNota("");
    setCargandoDetalle(true);
    try {
      const respuesta = await obtenerDetalleTaller(taller.id_taller);
      setDetalleTaller(respuesta.data);
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
      await agregarNotaTaller(tallerSeleccionado.id_taller, { descripcion: nota.trim() });
      setNota("");
      const respuesta = await obtenerDetalleTaller(tallerSeleccionado.id_taller);
      setDetalleTaller(respuesta.data);
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
    obtenerEstado,
    obtenerTipo,
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
  };
}
