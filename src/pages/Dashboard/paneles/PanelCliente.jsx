import { useCallback, useEffect, useMemo, useState } from "react";
import "../../../styles/dashboard.css";
import "../../../styles/cliente.css";
import logo from "../../../assets/images/logo.png";
import { inscribirClienteTaller, obtenerPanelCliente } from "../../../api/usuariosApi";

const seccionesCliente = [
  { id: "talleres", etiqueta: "Mis Talleres", icono: "book" },
  { id: "inscripciones", etiqueta: "Inscripciones", icono: "clipboard" },
  { id: "calendario", etiqueta: "Calendario", icono: "calendar" },
  { id: "perfil", etiqueta: "Perfil", icono: "user" },
];

function Icono({ tipo }) {
  const paths = {
    book: (
      <>
        <path d="M5 5.8c1.8-.9 3.5-.9 5.2 0v12.4c-1.7-.9-3.4-.9-5.2 0V5.8Z" />
        <path d="M19 5.8c-1.8-.9-3.5-.9-5.2 0v12.4c1.7-.9 3.4-.9 5.2 0V5.8Z" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 4.5h6l1 2H8l1-2Z" />
        <path d="M7 6.5H5.8A1.8 1.8 0 0 0 4 8.3v9.9A1.8 1.8 0 0 0 5.8 20h12.4a1.8 1.8 0 0 0 1.8-1.8V8.3a1.8 1.8 0 0 0-1.8-1.8H17" />
        <path d="M8 12h8M8 16h6" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 4v3M17 4v3M5.8 6h12.4A1.8 1.8 0 0 1 20 7.8v10.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.2V7.8A1.8 1.8 0 0 1 5.8 6Z" />
        <path d="M4 10h16" />
      </>
    ),
    user: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    clock: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    x: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </>
    ),
    logout: (
      <>
        <path d="M10 6H6.8A1.8 1.8 0 0 0 5 7.8v8.4A1.8 1.8 0 0 0 6.8 18H10" />
        <path d="M14 8l4 4-4 4M18 12H9" />
      </>
    ),
  };

  return (
    <svg className="cliente-icono" viewBox="0 0 24 24" aria-hidden="true">
      {paths[tipo]}
    </svg>
  );
}

const quitarAcentos = (valor = "") =>
  valor
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formateadorCorto = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formateadorLargo = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const formateadorMes = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

function crearFecha(fecha) {
  if (!fecha) return null;
  const fechaNormalizada = typeof fecha === "string" && fecha.length <= 10 ? `${fecha}T00:00:00` : fecha;
  const fechaObjeto = new Date(fechaNormalizada);
  return Number.isNaN(fechaObjeto.getTime()) ? null : fechaObjeto;
}

function formatearFecha(fecha, tipo = "corta") {
  const fechaObjeto = crearFecha(fecha);
  if (!fechaObjeto) return "Por definir";
  return (tipo === "larga" ? formateadorLargo : formateadorCorto).format(fechaObjeto).replace(".", "");
}

function formatearRangoFechas(fechaInicio, fechaFin) {
  if (fechaInicio && fechaFin) {
    return `${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;
  }

  return formatearFecha(fechaInicio || fechaFin);
}

function obtenerNivel(categoria = "") {
  const texto = quitarAcentos(categoria);
  if (!texto) return "";
  if (texto.includes("avanz")) return "avanzado";
  if (texto.includes("pl") || texto.includes("planificacion")) return "pl";
  return "basico";
}

function obtenerGrupoEstado(estado = "") {
  const texto = quitarAcentos(estado);
  if (texto.includes("no aprobado") || texto.includes("reprob") || texto.includes("rechaz")) return "no-aprobado";
  if (texto.includes("aprob") || texto.includes("finaliz") || texto.includes("complet")) return "aprobado";
  return "en-curso";
}

function obtenerEtiquetaEstado(estado = "") {
  if (!estado) return "";
  const grupo = obtenerGrupoEstado(estado);
  if (grupo === "aprobado") return "Aprobado";
  if (grupo === "no-aprobado") return "No Aprobado";
  if (quitarAcentos(estado).includes("inici")) return "En Progreso";
  return estado;
}

function obtenerIniciales(nombre = "") {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "CL";
  return partes.slice(0, 2).map((parte) => parte[0]).join("").toUpperCase();
}

function normalizarTaller(taller) {
  const categoria = taller.categoria || taller.tipo_taller || "";
  const estado = obtenerEtiquetaEstado(taller.estado || taller.estado_taller || "");
  return {
    id_taller: taller.id_taller,
    id_inscripcion: taller.id_inscripcion,
    nombre: taller.nombre || "",
    categoria,
    fecha_inicio: taller.fecha_inicio,
    fecha_fin: taller.fecha_fin,
    coach: taller.coach || "",
    estado,
    fecha_inscripcion: taller.fecha_inscripcion || null,
    id_tipo_taller: taller.id_tipo_taller,
    nivel: taller.nivel || obtenerNivel(categoria),
  };
}

function construirCeldasCalendario(fechaBase, talleres) {
  const anio = fechaBase.getFullYear();
  const mes = fechaBase.getMonth();
  const primerDia = new Date(anio, mes, 1).getDay();
  const totalDias = new Date(anio, mes + 1, 0).getDate();
  const celdas = [];

  for (let i = 0; i < primerDia; i += 1) {
    celdas.push({ clave: `vacio-${i}`, dia: null, eventos: [] });
  }

  for (let dia = 1; dia <= totalDias; dia += 1) {
    const fechaDia = new Date(anio, mes, dia);
    const eventos = talleres.filter((taller) => {
      const inicio = crearFecha(taller.fecha_inicio);
      const fin = crearFecha(taller.fecha_fin) || inicio;
      return inicio && inicio <= fechaDia && fin >= fechaDia;
    });

    celdas.push({ clave: `${anio}-${mes}-${dia}`, dia, eventos });
  }

  while (celdas.length % 7 !== 0) {
    celdas.push({ clave: `final-${celdas.length}`, dia: null, eventos: [] });
  }

  return celdas;
}

function PanelCliente({ usuario, onLogout }) {
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

  const renderEncabezado = (titulo, subtitulo) => (
    <header className="cliente-panel-header">
      <h2>{titulo}</h2>
      <p>{subtitulo}</p>
    </header>
  );

  const renderTarjetaTaller = (taller) => (
    <article className="cliente-taller-card" key={taller.id_taller}>
      <div className="cliente-taller-top">
        <span className="cliente-taller-icon">
          <Icono tipo="book" />
        </span>
        <div>
          <h3>{taller.nombre}</h3>
          {taller.categoria && <p>{taller.categoria}</p>}
        </div>
        <span className="cliente-status-badge">Inscrito</span>
      </div>
      <div className="cliente-taller-info">
        {(taller.fecha_inicio || taller.fecha_fin) && (
          <p>
            <Icono tipo="calendar" />
            {formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}
          </p>
        )}
        {taller.coach && (
          <p>
            <Icono tipo="user" />
            Coach: {taller.coach}
          </p>
        )}
        {taller.estado && (
          <p>
            <Icono tipo="clock" />
            {taller.estado}
          </p>
        )}
      </div>
      {taller.fecha_inscripcion && (
        <span className="cliente-inscrito-fecha">
          Inscrito el {formatearFecha(taller.fecha_inscripcion, "larga")}
        </span>
      )}
    </article>
  );

  const renderMisTalleres = () => (
    <>
      {renderEncabezado("Mis Talleres", "Talleres en los que estás inscrito")}
      <div className="cliente-talleres-grid">
        {talleresEnCurso.map(renderTarjetaTaller)}
      </div>
    </>
  );

  const renderInscripciones = () => (
    <>
      {renderEncabezado("Mis Inscripciones", "Historial de talleres a los que te has inscrito")}
      {talleresInscritos.length > 0 && (
        <>
          <section className="cliente-stats-grid" aria-label="Resumen de inscripciones">
            <article className="cliente-stat-card cliente-stat-aprobado">
              <Icono tipo="check" />
              <strong>{estadisticas.aprobados}</strong>
              <span>Aprobadas</span>
            </article>
            <article className="cliente-stat-card cliente-stat-curso">
              <Icono tipo="clock" />
              <strong>{estadisticas.enCurso}</strong>
              <span>En Curso</span>
            </article>
            <article className="cliente-stat-card cliente-stat-no-aprobado">
              <Icono tipo="x" />
              <strong>{estadisticas.noAprobados}</strong>
              <span>No Aprobadas</span>
            </article>
          </section>
          <section className="cliente-inscripciones-lista">
            {talleresInscritos.map((taller) => {
              const grupo = obtenerGrupoEstado(taller.estado);
              return (
                <article className="cliente-inscripcion-row" key={`historial-${taller.id_taller}`}>
                  <div>
                    <h3>{taller.nombre}</h3>
                    {taller.fecha_inscripcion && <p>Inscrito: {formatearFecha(taller.fecha_inscripcion, "larga")}</p>}
                  </div>
                  {taller.estado && (
                    <span className={`cliente-chip cliente-chip-${grupo}`}>{obtenerEtiquetaEstado(taller.estado)}</span>
                  )}
                </article>
              );
            })}
          </section>
        </>
      )}
    </>
  );

  const renderCalendario = () => (
    <>
      {renderEncabezado(
        "Calendario de Talleres",
        nivelActual ? `Visualiza los talleres programados para tu nivel: ${nivelActual}` : "Visualiza los talleres programados a los que te puedes inscribir"
      )}
      <section className="cliente-calendar-card">
        <div className="cliente-calendar-toolbar">
          <button type="button" aria-label="Mes anterior" onClick={() => setDesplazamientoMes((mes) => mes - 1)}>
            ‹
          </button>
          <h3>{formateadorMes.format(fechaBaseCalendario)}</h3>
          <button type="button" aria-label="Mes siguiente" onClick={() => setDesplazamientoMes((mes) => mes + 1)}>
            ›
          </button>
        </div>
        <div className="cliente-calendar-weekdays">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((dia) => (
            <span key={dia}>{dia}</span>
          ))}
        </div>
        <div className="cliente-calendar-grid">
          {celdasCalendario.map((celda) => (
            <div className={`cliente-calendar-day ${celda.dia ? "" : "cliente-calendar-empty"}`} key={celda.clave}>
              {celda.dia && <span className="cliente-calendar-number">{celda.dia}</span>}
              {celda.eventos.slice(0, 2).map((evento) => (
                <button
                  type="button"
                  className={`cliente-calendar-event ${evento.nivel ? `cliente-nivel-${evento.nivel}` : ""}`}
                  key={`${celda.clave}-${evento.id_taller}`}
                  aria-label={`Inscribirse a ${evento.nombre}`}
                  disabled={inscribiendoId === evento.id_taller}
                  onClick={() => manejarInscripcion(evento.id_taller)}
                >
                  {evento.nombre}
                </button>
              ))}
              {celda.eventos.length > 2 && <span className="cliente-calendar-more">+ {celda.eventos.length - 2} más</span>}
            </div>
          ))}
        </div>
      </section>
      <div className="cliente-calendar-legend">
        <span><i className="cliente-legend-basico" />Básico</span>
        <span><i className="cliente-legend-avanzado" />Avanzado</span>
        <span><i className="cliente-legend-pl" />PL</span>
      </div>
    </>
  );

  const renderPerfil = () => {
    const estadoUsuario =
      cliente?.estado || (usuario.activo === true ? "Activo" : usuario.activo === false ? "Inactivo" : "");
    const camposPerfil = [
      { etiqueta: "Cédula", valor: cliente?.cedula || usuario.cedula_cliente },
      { etiqueta: "Correo", valor: cliente?.correo },
      { etiqueta: "Teléfono", valor: cliente?.telefono },
      { etiqueta: "Edad", valor: cliente?.edad },
      { etiqueta: "Estado", valor: estadoUsuario },
      { etiqueta: "Nivel actual", valor: nivelActual },
    ].filter((campo) => campo.valor !== undefined && campo.valor !== null && campo.valor !== "");

    return (
      <>
        {renderEncabezado("Perfil", "Información personal")}
        <section className="cliente-perfil-card">
          <div className="cliente-perfil-main">
            <span className="cliente-avatar cliente-avatar-large">{obtenerIniciales(nombreCliente)}</span>
            <div>
              <h3>{nombreCliente}</h3>
              <p>{usuario.username}</p>
            </div>
          </div>
          {camposPerfil.length > 0 && (
            <div className="cliente-perfil-grid">
              {camposPerfil.map((campo) => (
                <div key={campo.etiqueta}>
                  <span>{campo.etiqueta}</span>
                  <strong>{campo.valor}</strong>
                </div>
              ))}
            </div>
          )}
        </section>
      </>
    );
  };

  const renderContenido = () => {
    if (seccionActiva === "inscripciones") return renderInscripciones();
    if (seccionActiva === "calendario") return renderCalendario();
    if (seccionActiva === "perfil") return renderPerfil();
    return renderMisTalleres();
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
