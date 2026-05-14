import { useCallback, useMemo, useState } from "react";
import logo from "../../../../assets/images/logo.png";
import { IconoAdmin } from "../utils/IconoAdmin";
import { Panel } from "./Panel";
import { Clientes } from "./Clientes";
import { Talleres } from "./Talleres";
import { Inscripciones } from "./Inscripciones";
import { Personal } from "./Personal";
import { Progreso } from "./Progreso";
import { Auditoria } from "./Auditoria";
import { Calendario } from "./Calendario";
import { crearMapa, normalizar, formulariosIniciales, seccionesAdmin, hoyISO } from "../utils/helpers";
import { useCoordinadorData } from "../hooks/useCoordinadorData";

function PanelCoordinador({ usuario, onLogout }) {
  const [seccionActiva, setSeccionActiva] = useState("panel");
  const [busqueda, setBusqueda] = useState("");
  const [modalActivo, setModalActivo] = useState(null);
  const [formularios, setFormularios] = useState(formulariosIniciales);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const {
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
    cargarDatos,
    crearCliente,
    crearInscripcion,
    crearPersonal,
    crearTaller,
    eliminarCliente,
    eliminarInscripcion,
    eliminarPersonal,
    eliminarTaller,
  } = useCoordinadorData();

  // Crear mapas para búsquedas rápidas
  const estadoPorId = useMemo(() => crearMapa(estados, "id_estado"), [estados]);
  const rolPorId = useMemo(() => crearMapa(roles, "id_rol"), [roles]);
  const tipoPorId = useMemo(() => crearMapa(tiposTaller, "id_tipo_taller"), [tiposTaller]);
  const clientePorCedula = useMemo(() => crearMapa(clientes, "cedula"), [clientes]);
  const tallerPorId = useMemo(() => crearMapa(talleres, "id_taller"), [talleres]);
  const personalPorCedula = useMemo(() => crearMapa(personal, "cedula"), [personal]);

  const progresoPorCliente = useMemo(
    () => new Map(progresos.map((progreso) => [String(progreso.cliente_cedula), progreso])),
    [progresos]
  );

  const usuarioPorPersonal = useMemo(
    () => new Map(usuarios.filter((item) => item.cedula_personal).map((item) => [String(item.cedula_personal), item])),
    [usuarios]
  );

  const asignacionesPorTaller = useMemo(() => {
    const mapa = new Map();
    tallerPersonal.forEach((asignacion) => {
      const idTaller = String(asignacion.id_taller);
      const lista = mapa.get(idTaller) || [];
      lista.push(asignacion);
      mapa.set(idTaller, lista);
    });
    return mapa;
  }, [tallerPersonal]);

  // Funciones de mapeo
  const obtenerEstado = useCallback((idEstado) => estadoPorId.get(String(idEstado))?.nombre || "", [estadoPorId]);
  const obtenerRol = useCallback((idRol) => rolPorId.get(String(idRol))?.nombre || "", [rolPorId]);
  const obtenerTipo = useCallback((idTipo) => tipoPorId.get(String(idTipo))?.nombre || "", [tipoPorId]);

  const obtenerRolPorNombre = useCallback(
    (nombre) => roles.find((rol) => normalizar(rol.nombre).includes(normalizar(nombre))),
    [roles]
  );

  const obtenerEstadoPorNombre = useCallback(
    (nombre) => estados.find((estado) => normalizar(estado.nombre).includes(normalizar(nombre))),
    [estados]
  );

  const obtenerNombreTaller = useCallback(
    (idTaller) => tallerPorId.get(String(idTaller))?.nombre || `Taller ${idTaller}`,
    [tallerPorId]
  );

  // Funciones de UI
  const renderBadgeEstado = (estado = "") => {
    const clase = normalizar(estado).replace(/\s+/g, "-") || "sin-estado";
    return <span className={`admin-badge admin-badge-${clase}`}>{estado || "Sin estado"}</span>;
  };

  const renderAccionEliminar = (tipo, id, etiqueta) => (
    <button type="button" className="admin-icon-button admin-danger" aria-label={etiqueta} onClick={() => eliminarRegistro(tipo, id)}>
      <IconoAdmin tipo="trash" />
    </button>
  );

  // Modal
  const abrirModal = (tipo) => {
    const estadoActivo = obtenerEstadoPorNombre("activo") || estados[0];
    const estadoIniciado = obtenerEstadoPorNombre("iniciado") || estadoActivo;
    const rolPersonal = roles.find((rol) => !normalizar(rol.nombre).includes("cliente")) || roles[0];

    setMensaje("");
    setError("");
    setFormularios((actuales) => ({
      ...actuales,
      [tipo]: {
        ...formulariosIniciales[tipo],
        ...(tipo === "cliente" && {
          id_estado: estadoActivo?.id_estado || "",
          id_tipo_taller: tiposTaller[0]?.id_tipo_taller || "",
        }),
        ...(tipo === "taller" && {
          id_estado: estadoIniciado?.id_estado || "",
          id_tipo_taller: tiposTaller[0]?.id_tipo_taller || "",
        }),
        ...(tipo === "inscripcion" && {
          cliente_cedula: clientes[0]?.cedula || "",
          id_taller: talleres[0]?.id_taller || "",
          id_estado: estadoIniciado?.id_estado || "",
          fecha_inscripcion: hoyISO(),
        }),
        ...(tipo === "personal" && {
          id_rol: rolPersonal?.id_rol || "",
          activo: true,
        }),
      },
    }));
    setModalActivo(tipo);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalActivo(null);
  };

  const cambiarFormulario = (tipo, event) => {
    const { name, value, type, checked } = event.target;
    setFormularios((actuales) => ({
      ...actuales,
      [tipo]: {
        ...actuales[tipo],
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  const ejecutarGuardado = async (callback, mensajeExito) => {
    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      await callback();
      setMensaje(mensajeExito);
      setModalActivo(null);
      await cargarDatos();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo guardar la información.");
    } finally {
      setGuardando(false);
    }
  };

  const guardarCliente = (event) => {
    event.preventDefault();
    const data = formularios.cliente;
    ejecutarGuardado(
      () =>
        crearCliente({
          ...data,
          edad: Number(data.edad),
          id_estado: Number(data.id_estado),
          id_tipo_taller: Number(data.id_tipo_taller),
        }),
      "Cliente creado correctamente."
    );
  };

  const guardarTaller = (event) => {
    event.preventDefault();
    const data = formularios.taller;
    const rolCoach = obtenerRolPorNombre("coach");
    const rolCoordinador = obtenerRolPorNombre("coordinador");
    const asignaciones = [
      data.coach && {
        cedula_personal: data.coach,
        id_rol: rolCoach?.id_rol || personalPorCedula.get(String(data.coach))?.id_rol,
      },
      data.coordinador && {
        cedula_personal: data.coordinador,
        id_rol: rolCoordinador?.id_rol || personalPorCedula.get(String(data.coordinador))?.id_rol,
      },
    ].filter(Boolean);

    ejecutarGuardado(
      () =>
        crearTaller({
          nombre: data.nombre,
          id_tipo_taller: Number(data.id_tipo_taller),
          fecha_inicio: data.fecha_inicio,
          fecha_fin: data.fecha_fin,
          id_estado: Number(data.id_estado),
          personal_asignado: asignaciones,
        }),
      "Taller creado correctamente."
    );
  };

  const guardarInscripcion = (event) => {
    event.preventDefault();
    const data = formularios.inscripcion;
    ejecutarGuardado(
      () =>
        crearInscripcion({
          cliente_cedula: data.cliente_cedula,
          id_taller: Number(data.id_taller),
          id_estado: Number(data.id_estado),
          fecha_inscripcion: data.fecha_inscripcion,
        }),
      "Inscripción creada correctamente."
    );
  };

  const guardarPersonal = (event) => {
    event.preventDefault();
    const data = formularios.personal;
    ejecutarGuardado(
      () =>
        crearPersonal({
          ...data,
          id_rol: Number(data.id_rol),
          activo: Boolean(data.activo),
        }),
      "Personal y usuario creados correctamente."
    );
  };

  const eliminarRegistro = async (tipo, id) => {
    const confirmado = window.confirm("¿Deseas eliminar este registro?");
    if (!confirmado) return;

    const acciones = {
      cliente: () => eliminarCliente(id),
      taller: () => eliminarTaller(id),
      inscripcion: () => eliminarInscripcion(id),
      personal: () => eliminarPersonal(id),
    };

    setError("");
    setMensaje("");

    try {
      await acciones[tipo]();
      setMensaje("Registro eliminado correctamente.");
      await cargarDatos();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo eliminar el registro.");
    }
  };

  const renderContenido = () => {
    if (seccionActiva === "clientes") {
      return (
        <Clientes
          clientes={clientes}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          abrirModal={abrirModal}
          obtenerTipo={obtenerTipo}
          obtenerEstado={obtenerEstado}
          progresoPorCliente={progresoPorCliente}
          cargando={cargando}
          renderBadgeEstado={renderBadgeEstado}
          renderAccionEliminar={renderAccionEliminar}
        />
      );
    }
    if (seccionActiva === "talleres") {
      return (
        <Talleres
          talleres={talleres}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          abrirModal={abrirModal}
          obtenerTipo={obtenerTipo}
          obtenerEstado={obtenerEstado}
          asignacionesPorTaller={asignacionesPorTaller}
          obtenerRol={obtenerRol}
          personalPorCedula={personalPorCedula}
          cargando={cargando}
          renderBadgeEstado={renderBadgeEstado}
          renderAccionEliminar={renderAccionEliminar}
        />
      );
    }
    if (seccionActiva === "inscripciones") {
      return (
        <Inscripciones
          inscripciones={inscripciones}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          abrirModal={abrirModal}
          obtenerEstado={obtenerEstado}
          clientes={clientes}
          talleres={talleres}
          cargando={cargando}
          renderBadgeEstado={renderBadgeEstado}
          renderAccionEliminar={renderAccionEliminar}
        />
      );
    }
    if (seccionActiva === "personal") {
      return (
        <Personal
          personal={personal}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          abrirModal={abrirModal}
          obtenerRol={obtenerRol}
          usuarios={usuarios}
          cargando={cargando}
          renderBadgeEstado={renderBadgeEstado}
          renderAccionEliminar={renderAccionEliminar}
        />
      );
    }
    if (seccionActiva === "progreso") {
      return (
        <Progreso
          clientes={clientes}
          inscripciones={inscripciones}
          obtenerEstado={obtenerEstado}
          obtenerNombreTaller={obtenerNombreTaller}
          obtenerTipo={obtenerTipo}
          progresos={progresos}
          cargando={cargando}
          renderBadgeEstado={renderBadgeEstado}
        />
      );
    }
    if (seccionActiva === "auditoria") {
      return <Auditoria auditorias={auditorias} cargando={cargando} />;
    }
    if (seccionActiva === "calendario") {
      return <Calendario talleres={talleres} obtenerTipo={obtenerTipo} obtenerEstado={obtenerEstado} cargando={cargando} />;
    }
    return (
      <Panel
        clientes={clientes}
        talleres={talleres}
        inscripciones={inscripciones}
        tiposTaller={tiposTaller}
        progresos={progresos}
        estados={estados}
        obtenerEstado={obtenerEstado}
      />
    );
  };

  const renderModal = () => {
    if (!modalActivo) return null;

    const modalContent = {
      cliente: {
        titulo: "Nuevo Cliente",
        guardar: guardarCliente,
        campos: [
          { name: "cedula", label: "Cédula", type: "text", required: true },
          { name: "nombres", label: "Nombres", type: "text", required: true },
          { name: "apellidos", label: "Apellidos", type: "text", required: true },
          { name: "correo", label: "Correo", type: "email", required: true },
          { name: "telefono", label: "Teléfono", type: "text" },
          { name: "edad", label: "Edad", type: "number" },
          {
            name: "id_estado",
            label: "Estado",
            type: "select",
            options: estados,
            optionLabel: "nombre",
            optionValue: "id_estado",
          },
          {
            name: "id_tipo_taller",
            label: "Tipo de Taller",
            type: "select",
            options: tiposTaller,
            optionLabel: "nombre",
            optionValue: "id_tipo_taller",
          },
        ],
      },
      taller: {
        titulo: "Nuevo Taller",
        guardar: guardarTaller,
        campos: [
          { name: "nombre", label: "Nombre", type: "text", required: true },
          {
            name: "id_tipo_taller",
            label: "Tipo de Taller",
            type: "select",
            options: tiposTaller,
            optionLabel: "nombre",
            optionValue: "id_tipo_taller",
          },
          { name: "fecha_inicio", label: "Fecha Inicio", type: "date", required: true },
          { name: "fecha_fin", label: "Fecha Fin", type: "date", required: true },
          {
            name: "id_estado",
            label: "Estado",
            type: "select",
            options: estados,
            optionLabel: "nombre",
            optionValue: "id_estado",
          },
          {
            name: "coach",
            label: "Coach",
            type: "select",
            options: personal,
            optionLabel: "cedula",
            optionValue: "cedula",
          },
          {
            name: "coordinador",
            label: "Coordinador",
            type: "select",
            options: personal,
            optionLabel: "cedula",
            optionValue: "cedula",
          },
        ],
      },
      inscripcion: {
        titulo: "Inscribir Cliente",
        guardar: guardarInscripcion,
        campos: [
          {
            name: "cliente_cedula",
            label: "Cliente",
            type: "select",
            options: clientes,
            optionLabel: "cedula",
            optionValue: "cedula",
          },
          {
            name: "id_taller",
            label: "Taller",
            type: "select",
            options: talleres,
            optionLabel: "nombre",
            optionValue: "id_taller",
          },
          {
            name: "id_estado",
            label: "Estado",
            type: "select",
            options: estados,
            optionLabel: "nombre",
            optionValue: "id_estado",
          },
          { name: "fecha_inscripcion", label: "Fecha Inscripción", type: "date" },
        ],
      },
      personal: {
        titulo: "Nuevo Personal",
        guardar: guardarPersonal,
        campos: [
          { name: "cedula", label: "Cédula", type: "text", required: true },
          { name: "nombres", label: "Nombres", type: "text", required: true },
          { name: "apellidos", label: "Apellidos", type: "text", required: true },
          { name: "correo", label: "Correo", type: "email", required: true },
          { name: "telefono", label: "Teléfono", type: "text" },
          {
            name: "id_rol",
            label: "Rol",
            type: "select",
            options: roles,
            optionLabel: "nombre",
            optionValue: "id_rol",
          },
          { name: "username", label: "Usuario", type: "text", required: true },
          { name: "password", label: "Contraseña", type: "password", required: true },
          { name: "activo", label: "Activo", type: "checkbox" },
        ],
      },
    };

    const config = modalContent[modalActivo];
    const formData = formularios[modalActivo];

    return (
      <div className="admin-modal-overlay" onClick={cerrarModal}>
        <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
          <header>
            <h2>{config.titulo}</h2>
            <button type="button" className="admin-modal-close" onClick={cerrarModal}>
              ×
            </button>
          </header>

          {error && <div className="admin-alert admin-alert-error">{error}</div>}
          {mensaje && <div className="admin-alert admin-alert-success">{mensaje}</div>}

          <form onSubmit={config.guardar}>
            <div className="admin-form-grid">
              {config.campos.map((campo) => (
                <div key={campo.name} className="admin-form-group">
                  {campo.type === "checkbox" ? (
                    <>
                      <input
                        type="checkbox"
                        id={campo.name}
                        name={campo.name}
                        checked={formData[campo.name] || false}
                        onChange={(e) => cambiarFormulario(modalActivo, e)}
                      />
                      <label htmlFor={campo.name}>{campo.label}</label>
                    </>
                  ) : campo.type === "select" ? (
                    <>
                      <label htmlFor={campo.name}>{campo.label}</label>
                      <select
                        id={campo.name}
                        name={campo.name}
                        value={formData[campo.name] || ""}
                        onChange={(e) => cambiarFormulario(modalActivo, e)}
                        required={campo.required}
                      >
                        <option value="">Seleccionar...</option>
                        {campo.options.map((opt) => (
                          <option key={opt[campo.optionValue]} value={opt[campo.optionValue]}>
                            {opt[campo.optionLabel]}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <label htmlFor={campo.name}>{campo.label}</label>
                      <input
                        type={campo.type}
                        id={campo.name}
                        name={campo.name}
                        value={formData[campo.name] || ""}
                        onChange={(e) => cambiarFormulario(modalActivo, e)}
                        required={campo.required}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="admin-modal-footer">
              <button type="button" className="admin-secondary-button" onClick={cerrarModal} disabled={guardando}>
                Cancelar
              </button>
              <button type="submit" className="admin-primary-button" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={logo} alt="Lidera360" />
          <div>
            <strong>Lidera360</strong>
            <span>Panel Coordinador</span>
          </div>
        </div>

        <div className="admin-user">
          <div>
            <strong>Coordinador</strong>
            <span>{usuario.username || usuario.cedula_personal || "Usuario"}</span>
          </div>
        </div>

        <nav className="admin-menu" aria-label="Opciones de administración">
          {seccionesAdmin.map((seccion) => (
            <button
              type="button"
              key={seccion.id}
              aria-label={seccion.etiqueta}
              className={`admin-menu-item ${seccionActiva === seccion.id ? "admin-menu-item-active" : ""}`}
              onClick={() => setSeccionActiva(seccion.id)}
            >
              <IconoAdmin tipo={seccion.icono} />
              <span>{seccion.etiqueta}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="admin-logout" onClick={onLogout}>
          <IconoAdmin tipo="logout" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <section className="admin-panel">{renderContenido()}</section>

      {renderModal()}
    </div>
  );
}

export default PanelCoordinador;
