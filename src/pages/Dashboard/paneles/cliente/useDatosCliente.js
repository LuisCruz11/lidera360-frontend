import { useCallback, useEffect, useMemo, useState } from "react";
import { inscribirClienteTaller, obtenerPanelCliente } from "../../../../api/usuariosApi";
import { construirCeldasCalendario, crearFecha, normalizarTaller, obtenerGrupoEstado } from "./utils";

export function useDatosCliente(usuario) {
  const [seccionActiva, setSeccionActiva] = useState("talleres");
  const [cliente, setCliente] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [talleresInscritos, setTalleresInscritos] = useState([]);
  const [talleresDisponibles, setTalleresDisponibles] = useState([]);
  const [desplazamientoMes, setDesplazamientoMes] = useState(0);
  const [inscribiendoId, setInscribiendoId] = useState(null);

  const cargarPanelCliente = useCallback(async (cedulaCliente, estaActivo = () => true) => {
    try {
      const respuesta = await obtenerPanelCliente(cedulaCliente);
      if (!estaActivo()) return;

      const panel = respuesta.data || {};
      setCliente(panel.perfil || null);
      setProgreso(panel.progreso || null);
      setTalleresInscritos((panel.historial_inscripciones || []).map(normalizarTaller));
      setTalleresDisponibles((panel.talleres_disponibles || []).map(normalizarTaller));
    } catch {
      if (!estaActivo()) return;
      setCliente(null);
      setProgreso(null);
      setTalleresInscritos([]);
      setTalleresDisponibles([]);
    }
  }, []);

  useEffect(() => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente) return undefined;

    let componenteActivo = true;
    queueMicrotask(() => {
      if (componenteActivo) {
        cargarPanelCliente(cedulaCliente, () => componenteActivo);
      }
    });

    return () => {
      componenteActivo = false;
    };
  }, [cargarPanelCliente, usuario.cedula_cliente]);

  const manejarInscripcion = async (idTaller) => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente || !idTaller || inscribiendoId) return;

    setInscribiendoId(idTaller);
    try {
      await inscribirClienteTaller(cedulaCliente, idTaller);
      await cargarPanelCliente(cedulaCliente);
    } catch {
      // Si el backend rechaza la inscripción, se conserva la información actual.
    } finally {
      setInscribiendoId(null);
    }
  };

  const nombreCliente = useMemo(() => {
    const nombreCompleto = `${cliente?.nombres || ""} ${cliente?.apellidos || ""}`.trim();
    return nombreCompleto || usuario.username || "Cliente";
  }, [cliente, usuario.username]);

  const talleresEnCurso = useMemo(
    () => talleresInscritos.filter((taller) => obtenerGrupoEstado(taller.estado) === "en-curso"),
    [talleresInscritos]
  );

  const estadisticas = useMemo(
    () => ({
      aprobados: talleresInscritos.filter((taller) => obtenerGrupoEstado(taller.estado) === "aprobado").length,
      enCurso: talleresInscritos.filter((taller) => obtenerGrupoEstado(taller.estado) === "en-curso").length,
      noAprobados: talleresInscritos.filter((taller) => obtenerGrupoEstado(taller.estado) === "no-aprobado").length,
    }),
    [talleresInscritos]
  );

  const fechaBaseCalendario = useMemo(() => {
    const primerTaller = talleresDisponibles.find((taller) => taller.fecha_calendario || taller.fecha_inicio);
    const fecha = crearFecha(primerTaller?.fecha_calendario || primerTaller?.fecha_inicio) || new Date();
    return new Date(fecha.getFullYear(), fecha.getMonth() + desplazamientoMes, 1);
  }, [desplazamientoMes, talleresDisponibles]);

  const celdasCalendario = useMemo(
    () => construirCeldasCalendario(fechaBaseCalendario, talleresDisponibles),
    [fechaBaseCalendario, talleresDisponibles]
  );

  const nivelActual = progreso?.tipo_taller || talleresDisponibles[0]?.categoria || "";

  return {
    usuario,
    seccionActiva,
    setSeccionActiva,
    cliente,
    talleresInscritos,
    talleresDisponibles,
    desplazamientoMes,
    setDesplazamientoMes,
    inscribiendoId,
    manejarInscripcion,
    nombreCliente,
    talleresEnCurso,
    estadisticas,
    fechaBaseCalendario,
    celdasCalendario,
    nivelActual,
  };
}
