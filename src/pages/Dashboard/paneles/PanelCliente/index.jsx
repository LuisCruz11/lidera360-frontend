import { useCallback, useEffect, useMemo, useState } from "react";
import logo from "../../../../assets/images/logo.png";
import { Icono } from "./utils/Icono";
import { MisTalleres } from "./components/MisTalleres";
import { Inscripciones } from "./components/Inscripciones";
import { Calendario } from "./components/Calendario";
import { Perfil } from "./components/Perfil";
import {
  obtenerGrupoEstado,
  obtenerIniciales,
  formatearFecha,
  construirCeldasCalendario,
  seccionesCliente,
} from "./utils/helpers";
import { useClienteData } from "./hooks/useClienteData";

function PanelCliente({ usuario, onLogout }) {
  const [seccionActiva, setSeccionActiva] = useState("talleres");
  const [desplazamientoMes, setDesplazamientoMes] = useState(0);
  const [inscribiendoId, setInscribiendoId] = useState(null);

  const { cliente, progreso, talleresInscritos, talleresDisponibles, cargarPanelCliente, manejarInscripcion } =
    useClienteData(usuario);

  const manejarInscripcionConCarga = async (idTaller) => {
    setInscribiendoId(idTaller);
    try {
      await manejarInscripcion(idTaller);
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

  const crearFecha = (fecha) => {
    if (!fecha) return null;
    const fechaNormalizada = typeof fecha === "string" && fecha.length <= 10 ? `${fecha}T00:00:00` : fecha;
    const fechaObjeto = new Date(fechaNormalizada);
    return Number.isNaN(fechaObjeto.getTime()) ? null : fechaObjeto;
  };

  const celdasCalendario = useMemo(
    () => construirCeldasCalendario(fechaBaseCalendario, talleresDisponibles),
    [fechaBaseCalendario, talleresDisponibles]
  );

  const nivelActual = progreso?.tipo_taller || talleresDisponibles[0]?.categoria || "";

  const renderEncabezado = (titulo, subtitulo) => (
    <header className="cliente-panel-header">
      <h2>{titulo}</h2>
      <p>{subtitulo}</p>
    </header>
  );

  const renderContenido = () => {
    if (seccionActiva === "inscripciones") {
      return (
        <Inscripciones
          talleresInscritos={talleresInscritos}
          estadisticas={estadisticas}
          renderEncabezado={renderEncabezado}
        />
      );
    }
    if (seccionActiva === "calendario") {
      return (
        <Calendario
          celdasCalendario={celdasCalendario}
          fechaBaseCalendario={fechaBaseCalendario}
          desplazamientoMes={desplazamientoMes}
          setDesplazamientoMes={setDesplazamientoMes}
          talleresDisponibles={talleresDisponibles}
          nivelActual={nivelActual}
          manejarInscripcion={manejarInscripcionConCarga}
          inscribiendoId={inscribiendoId}
          renderEncabezado={renderEncabezado}
        />
      );
    }
    if (seccionActiva === "perfil") {
      return (
        <Perfil
          nombreCliente={nombreCliente}
          usuario={usuario}
          cliente={cliente}
          nivelActual={nivelActual}
          obtenerIniciales={obtenerIniciales}
          renderEncabezado={renderEncabezado}
        />
      );
    }
    return <MisTalleres talleresEnCurso={talleresEnCurso} renderEncabezado={renderEncabezado} />;
  };

  return (
    <div className="cliente-dashboard">
      <aside className="cliente-sidebar">
        <div className="cliente-brand">
          <img src={logo} alt="Lidera360" />
          <div>
            <strong>Lidera360</strong>
            <span>Portal Participante</span>
          </div>
        </div>

        <div className="cliente-user">
          <span className="cliente-avatar">{obtenerIniciales(nombreCliente)}</span>
          <div>
            <strong>{nombreCliente}</strong>
            <span>{usuario.cedula_cliente ? `V-${usuario.cedula_cliente}` : usuario.id_usuario || ""}</span>
          </div>
        </div>

        <nav className="cliente-menu" aria-label="Opciones del cliente">
          {seccionesCliente.map((seccion) => (
            <button
              type="button"
              key={seccion.id}
              aria-label={seccion.etiqueta}
              className={`cliente-menu-item ${seccionActiva === seccion.id ? "cliente-menu-item-active" : ""}`}
              onClick={() => setSeccionActiva(seccion.id)}
            >
              <Icono tipo={seccion.icono} />
              <span>{seccion.etiqueta}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="cliente-logout" onClick={onLogout}>
          <Icono tipo="logout" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <section className="cliente-panel">{renderContenido()}</section>
    </div>
  );
}

export default PanelCliente;
