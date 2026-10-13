import { useCallback, useEffect, useMemo, useState } from "react";
import {
  actualizarContactoCliente,
  cancelarInscripcionCliente,
  descargarCertificadoCliente,
  inscribirClienteTaller,
  obtenerPanelCliente,
} from "../../../../api/usuariosApi";
import { construirCeldasCalendario, crearFecha, normalizarTaller, obtenerGrupoEstado } from "./utils";

export function useDatosCliente(usuario) {
  const [seccionActiva, setSeccionActiva] = useState("talleres");
  const [cliente, setCliente] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [programaCompletado, setProgramaCompletado] = useState(false);
  const [talleresInscritos, setTalleresInscritos] = useState([]);
  const [talleresDisponibles, setTalleresDisponibles] = useState([]);
  const [desplazamientoMes, setDesplazamientoMes] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [tallerPorInscribir, setTallerPorInscribir] = useState(null);
  const [inscribiendo, setInscribiendo] = useState(false);
  const [tallerPorCancelar, setTallerPorCancelar] = useState(null);
  const [cancelando, setCancelando] = useState(false);
  const [guardandoContacto, setGuardandoContacto] = useState(false);
  const [descargandoId, setDescargandoId] = useState(null);

  const cargarPanelCliente = useCallback(async (cedulaCliente, estaActivo = () => true) => {
    try {
      const respuesta = await obtenerPanelCliente(cedulaCliente);
      if (!estaActivo()) return;

      const panel = respuesta.data || {};
      setCliente(panel.perfil || null);
      setProgreso(panel.progreso || null);
      setProgramaCompletado(Boolean(panel.programa_completado));
      setTalleresInscritos((panel.historial_inscripciones || []).map(normalizarTaller));
      setTalleresDisponibles((panel.talleres_disponibles || []).map(normalizarTaller));
    } catch (err) {
      if (!estaActivo()) return;
      setError(err.response?.data?.mensaje || "No se pudo cargar tu información. Intenta de nuevo más tarde.");
    } finally {
      if (estaActivo()) setCargando(false);
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

  const limpiarAvisos = () => {
    setMensaje("");
    setError("");
  };

  const cambiarSeccion = (seccion) => {
    limpiarAvisos();
    setSeccionActiva(seccion);
  };

  const confirmarInscripcion = async () => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente || !tallerPorInscribir || inscribiendo) return;

    setInscribiendo(true);
    limpiarAvisos();
    try {
      await inscribirClienteTaller(cedulaCliente, tallerPorInscribir.id_taller);
      setMensaje(`Te inscribiste en ${tallerPorInscribir.nombre}.`);
      await cargarPanelCliente(cedulaCliente);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo completar la inscripción.");
    } finally {
      setInscribiendo(false);
      setTallerPorInscribir(null);
    }
  };

  const confirmarCancelacion = async () => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente || !tallerPorCancelar?.id_inscripcion || cancelando) return;

    setCancelando(true);
    limpiarAvisos();
    try {
      await cancelarInscripcionCliente(cedulaCliente, tallerPorCancelar.id_inscripcion);
      setMensaje(`Cancelaste tu inscripción en ${tallerPorCancelar.nombre}.`);
      await cargarPanelCliente(cedulaCliente);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo cancelar la inscripción.");
    } finally {
      setCancelando(false);
      setTallerPorCancelar(null);
    }
  };

  const guardarContacto = async (datosContacto) => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente || guardandoContacto) return false;

    setGuardandoContacto(true);
    limpiarAvisos();
    try {
      await actualizarContactoCliente(cedulaCliente, datosContacto);
      setMensaje("Datos de contacto actualizados.");
      await cargarPanelCliente(cedulaCliente);
      return true;
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudieron actualizar tus datos.");
      return false;
    } finally {
      setGuardandoContacto(false);
    }
  };

  const descargarCertificado = async (taller) => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente || !taller?.id_inscripcion || descargandoId) return;

    setDescargandoId(taller.id_inscripcion);
    limpiarAvisos();
    try {
      const respuesta = await descargarCertificadoCliente(cedulaCliente, taller.id_inscripcion);
      const url = URL.createObjectURL(new Blob([respuesta.data], { type: "application/pdf" }));
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `Certificado-${taller.nombre}-${taller.codigo_certificado}.pdf`.replace(/\s+/g, "_");
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      let mensajeError = "No se pudo descargar el certificado.";
      if (err.response?.data instanceof Blob) {
        try {
          mensajeError = JSON.parse(await err.response.data.text()).mensaje || mensajeError;
        } catch {
          // La respuesta de error no era JSON; se conserva el mensaje genérico.
        }
      }
      setError(mensajeError);
    } finally {
      setDescargandoId(null);
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

  const eventosCalendario = useMemo(
    () => [
      ...talleresEnCurso.map((taller) => ({ ...taller, inscrito: true })),
      ...talleresDisponibles.map((taller) => ({ ...taller, inscrito: false })),
    ],
    [talleresDisponibles, talleresEnCurso]
  );

  // El calendario abre en el mes del próximo taller vigente (o en el mes actual si no hay ninguno).
  const fechaBaseCalendario = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechasVigentes = eventosCalendario
      .map((taller) => {
        const inicio = crearFecha(taller.fecha_inicio);
        const fin = crearFecha(taller.fecha_fin) || inicio;
        if (!inicio || fin < hoy) return null;
        return inicio > hoy ? inicio : hoy;
      })
      .filter(Boolean);
    const fecha = fechasVigentes.length > 0 ? new Date(Math.min(...fechasVigentes)) : hoy;
    return new Date(fecha.getFullYear(), fecha.getMonth() + desplazamientoMes, 1);
  }, [desplazamientoMes, eventosCalendario]);

  const celdasCalendario = useMemo(
    () => construirCeldasCalendario(fechaBaseCalendario, eventosCalendario),
    [fechaBaseCalendario, eventosCalendario]
  );

  const nivelActual = progreso?.tipo_taller || "";

  return {
    usuario,
    seccionActiva,
    setSeccionActiva: cambiarSeccion,
    cargando,
    mensaje,
    error,
    cliente,
    talleresInscritos,
    talleresDisponibles,
    desplazamientoMes,
    setDesplazamientoMes,
    tallerPorInscribir,
    setTallerPorInscribir,
    inscribiendo,
    confirmarInscripcion,
    tallerPorCancelar,
    setTallerPorCancelar,
    cancelando,
    confirmarCancelacion,
    guardandoContacto,
    guardarContacto,
    descargandoId,
    descargarCertificado,
    nombreCliente,
    talleresEnCurso,
    estadisticas,
    fechaBaseCalendario,
    celdasCalendario,
    nivelActual,
    programaCompletado,
  };
}
