import { useCallback, useEffect, useMemo, useState } from "react";
import "../../../styles/admin.css";
import logo from "../../../assets/images/logo.png";
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
} from "../../../api/adminApi";

const seccionesAdmin = [
  { id: "panel", etiqueta: "Panel", icono: "grid" },
  { id: "clientes", etiqueta: "Clientes", icono: "users" },
  { id: "talleres", etiqueta: "Talleres", icono: "cap" },
  { id: "inscripciones", etiqueta: "Inscripciones", icono: "clipboard" },
  { id: "personal", etiqueta: "Personal", icono: "person" },
  { id: "progreso", etiqueta: "Progreso", icono: "trend" },
  { id: "auditoria", etiqueta: "Auditoría", icono: "history" },
  { id: "calendario", etiqueta: "Calendario", icono: "calendar" },
];

const formatterFecha = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const hoyISO = () => {
  const fecha = new Date();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

const formulariosIniciales = {
  cliente: {
    cedula: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    sexo: "M",
    edad: "",
    id_estado: "",
    id_tipo_taller: "",
  },
  taller: {
    nombre: "",
    id_tipo_taller: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_estado: "",
    coach: "",
    coordinador: "",
  },
  inscripcion: {
    cliente_cedula: "",
    id_taller: "",
    id_estado: "",
    fecha_inscripcion: hoyISO(),
  },
  personal: {
    cedula: "",
    nombres: "",
    apellidos: "",
    correo: "",
    telefono: "",
    id_rol: "",
    username: "",
    password: "",
    activo: true,
  },
};

function IconoAdmin({ tipo }) {
  const paths = {
    grid: (
      <>
        <path d="M4 4h6v6H4V4Z" />
        <path d="M14 4h6v6h-6V4Z" />
        <path d="M4 14h6v6H4v-6Z" />
        <path d="M14 14h6v6h-6v-6Z" />
      </>
    ),
    users: (
      <>
        <path d="M15 19a6 6 0 0 0-12 0" />
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M22 19a5 5 0 0 0-5-5" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    cap: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 11.5v4.2c1.7 1.4 3.3 2.1 5 2.1s3.3-.7 5-2.1v-4.2" />
        <path d="M21 9v5" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 4h6l1 2H8l1-2Z" />
        <path d="M7 6H5.8A1.8 1.8 0 0 0 4 7.8v10.4A1.8 1.8 0 0 0 5.8 20h12.4a1.8 1.8 0 0 0 1.8-1.8V7.8A1.8 1.8 0 0 0 18.2 6H17" />
        <path d="M8 12h8M8 16h6" />
      </>
    ),
    person: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    trend: (
      <>
        <path d="M4 17 9 12l4 4 7-8" />
        <path d="M15 8h5v5" />
      </>
    ),
    history: (
      <>
        <path d="M4 12a8 8 0 1 0 2.3-5.7" />
        <path d="M4 4v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 4v3M17 4v3M5.8 6h12.4A1.8 1.8 0 0 1 20 7.8v10.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.2V7.8A1.8 1.8 0 0 1 5.8 6Z" />
        <path d="M4 10h16" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <path d="m16 16 4 4" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 13h10l1-13" />
        <path d="M9 7V4h6v3" />
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
    <svg className="admin-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[tipo]}
    </svg>
  );
}

const normalizar = (valor = "") =>
  valor
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const crearFecha = (fecha) => {
  if (!fecha) return null;
  const normalizada = typeof fecha === "string" && fecha.length <= 10 ? `${fecha}T00:00:00` : fecha;
  const fechaObjeto = new Date(normalizada);
  return Number.isNaN(fechaObjeto.getTime()) ? null : fechaObjeto;
};

const formatearFecha = (fecha) => {
  const fechaObjeto = crearFecha(fecha);
  if (!fechaObjeto) return "Por definir";
  return formatterFecha.format(fechaObjeto).replace(".", "");
};

const formatearRangoFechas = (inicio, fin) => {
  if (inicio && fin) return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
  return formatearFecha(inicio || fin);
};

const nombreCompleto = (persona = {}) =>
  `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";

const crearMapa = (lista, llave) => new Map(lista.map((item) => [String(item[llave]), item]));

const ordenarPorFechaDesc = (lista, llave) =>
  [...lista].sort((a, b) => {
    const fechaA = crearFecha(a[llave])?.getTime() || 0;
    const fechaB = crearFecha(b[llave])?.getTime() || 0;
    return fechaB - fechaA;
  });

function PanelCoordinador({ usuario, onLogout }) {
  const [seccionActiva, setSeccionActiva] = useState("panel");
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
  const [busqueda, setBusqueda] = useState("");
  const [modalActivo, setModalActivo] = useState(null);
  const [formularios, setFormularios] = useState(formulariosIniciales);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
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

  const obtenerEstado = useCallback(
    (idEstado) => estadoPorId.get(String(idEstado))?.nombre || "",
    [estadoPorId]
  );

  const obtenerRol = useCallback(
    (idRol) => rolPorId.get(String(idRol))?.nombre || "",
    [rolPorId]
  );

  const obtenerTipo = useCallback(
    (idTipo) => tipoPorId.get(String(idTipo))?.nombre || "",
    [tipoPorId]
  );

  const obtenerRolPorNombre = useCallback(
    (nombre) => roles.find((rol) => normalizar(rol.nombre).includes(normalizar(nombre))),
    [roles]
  );

  const obtenerEstadoPorNombre = useCallback(
    (nombre) => estados.find((estado) => normalizar(estado.nombre).includes(normalizar(nombre))),
    [estados]
  );

  const personalPorRolNombre = useCallback(
    (nombreRol) => {
      const filtrado = personal.filter((persona) => normalizar(obtenerRol(persona.id_rol)).includes(normalizar(nombreRol)));
      return filtrado.length > 0 ? filtrado : personal.filter((persona) => !normalizar(obtenerRol(persona.id_rol)).includes("cliente"));
    },
    [obtenerRol, personal]
  );

  const obtenerNombreCliente = useCallback(
    (cedula) => nombreCompleto(clientePorCedula.get(String(cedula)) || { cedula }),
    [clientePorCedula]
  );

  const obtenerNombreTaller = useCallback(
    (idTaller) => tallerPorId.get(String(idTaller))?.nombre || `Taller ${idTaller}`,
    [tallerPorId]
  );

  const obtenerPersonalAsignado = useCallback(
    (idTaller, rolBuscado) => {
      const asignaciones = asignacionesPorTaller.get(String(idTaller)) || [];
      return asignaciones
        .filter((asignacion) => normalizar(obtenerRol(asignacion.id_rol)).includes(normalizar(rolBuscado)))
        .map((asignacion) => nombreCompleto(personalPorCedula.get(String(asignacion.cedula_personal)) || asignacion))
        .join(", ");
    },
    [asignacionesPorTaller, obtenerRol, personalPorCedula]
  );

  const clientesFiltrados = useMemo(() => {
    const texto = normalizar(busqueda);
    if (!texto || seccionActiva !== "clientes") return clientes;
    return clientes.filter((cliente) =>
      [cliente.cedula, cliente.nombres, cliente.apellidos, cliente.correo].some((valor) => normalizar(valor).includes(texto))
    );
  }, [busqueda, clientes, seccionActiva]);

  const talleresFiltrados = useMemo(() => {
    const texto = normalizar(busqueda);
    if (!texto || seccionActiva !== "talleres") return talleres;
    return talleres.filter((taller) =>
      [taller.nombre, obtenerTipo(taller.id_tipo_taller), obtenerEstado(taller.id_estado)].some((valor) =>
        normalizar(valor).includes(texto)
      )
    );
  }, [busqueda, obtenerEstado, obtenerTipo, seccionActiva, talleres]);

  const inscripcionesFiltradas = useMemo(() => {
    const texto = normalizar(busqueda);
    if (!texto || seccionActiva !== "inscripciones") return inscripciones;
    return inscripciones.filter((inscripcion) =>
      [
        obtenerNombreCliente(inscripcion.cliente_cedula),
        obtenerNombreTaller(inscripcion.id_taller),
        obtenerEstado(inscripcion.id_estado),
      ].some((valor) => normalizar(valor).includes(texto))
    );
  }, [busqueda, inscripciones, obtenerEstado, obtenerNombreCliente, obtenerNombreTaller, seccionActiva]);

  const personalFiltrado = useMemo(() => {
    const texto = normalizar(busqueda);
    if (!texto || seccionActiva !== "personal") return personal;
    return personal.filter((persona) =>
      [persona.cedula, persona.nombres, persona.apellidos, persona.correo, obtenerRol(persona.id_rol)].some((valor) =>
        normalizar(valor).includes(texto)
      )
    );
  }, [busqueda, obtenerRol, personal, seccionActiva]);

  const estadisticas = useMemo(() => {
    const activos = clientes.filter((cliente) => normalizar(obtenerEstado(cliente.id_estado)).includes("activo")).length;
    const talleresActivos = talleres.filter((taller) => {
      const estado = normalizar(obtenerEstado(taller.id_estado));
      return estado && !estado.includes("finalizado") && !estado.includes("inactivo");
    }).length;

    const niveles = tiposTaller.map((tipo) => ({
      id_tipo_taller: tipo.id_tipo_taller,
      nombre: tipo.nombre,
      total: clientes.filter((cliente) => {
        const progreso = progresoPorCliente.get(String(cliente.cedula));
        return String(progreso?.id_tipo_taller) === String(tipo.id_tipo_taller);
      }).length,
    }));

    return {
      totalClientes: clientes.length,
      clientesActivos: activos,
      talleresActivos,
      totalInscripciones: inscripciones.length,
      niveles,
    };
  }, [clientes, inscripciones.length, obtenerEstado, progresoPorCliente, talleres, tiposTaller]);

  const inscripcionesRecientes = useMemo(
    () => ordenarPorFechaDesc(inscripciones, "fecha_inscripcion").slice(0, 5),
    [inscripciones]
  );

  const resumenProgreso = useMemo(() => {
    return clientes.map((cliente) => {
      const inscripcionesCliente = inscripciones.filter((inscripcion) => inscripcion.cliente_cedula === cliente.cedula);
      const inscripcionesOrdenadas = ordenarPorFechaDesc(inscripcionesCliente, "fecha_inscripcion");
      const progreso = progresoPorCliente.get(String(cliente.cedula));
      const completados = inscripcionesCliente.filter((inscripcion) =>
        normalizar(obtenerEstado(inscripcion.id_estado)).includes("finalizado")
      ).length;
      const activas = inscripcionesCliente.filter((inscripcion) => {
        const estado = normalizar(obtenerEstado(inscripcion.id_estado));
        return estado && !estado.includes("finalizado") && !estado.includes("inactivo");
      }).length;

      return {
        cliente,
        nivel: obtenerTipo(progreso?.id_tipo_taller),
        completados,
        activas,
        ultimoTaller: obtenerNombreTaller(inscripcionesOrdenadas[0]?.id_taller),
        estado: obtenerEstado(cliente.id_estado),
      };
    });
  }, [clientes, inscripciones, obtenerEstado, obtenerNombreTaller, obtenerTipo, progresoPorCliente]);

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

  const renderBadgeEstado = (estado = "") => {
    const clase = normalizar(estado).replace(/\s+/g, "-") || "sin-estado";
    return <span className={`admin-badge admin-badge-${clase}`}>{estado || "Sin estado"}</span>;
  };

  const renderVacio = (texto) => <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;

  const renderAccionEliminar = (tipo, id, etiqueta) => (
    <button type="button" className="admin-icon-button admin-danger" aria-label={etiqueta} onClick={() => eliminarRegistro(tipo, id)}>
      <IconoAdmin tipo="trash" />
    </button>
  );

  const renderPanel = () => (
    <>
      <header className="admin-header">
        <h2>Panel</h2>
      </header>

      <section className="admin-stat-grid" aria-label="Resumen general">
        <article className="admin-stat">
          <span>Total Clientes</span>
          <strong>{estadisticas.totalClientes}</strong>
          <small>{estadisticas.clientesActivos} activos actualmente</small>
        </article>
        <article className="admin-stat">
          <span>Talleres Activos</span>
          <strong>{estadisticas.talleresActivos}</strong>
          <small>En progreso o planificados</small>
        </article>
        <article className="admin-stat">
          <span>Total Inscripciones</span>
          <strong>{estadisticas.totalInscripciones}</strong>
          <small>Histórico general</small>
        </article>
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel-box">
          <h3>Inscripciones Recientes</h3>
          {inscripcionesRecientes.length === 0
            ? renderVacio("No hay inscripciones registradas.")
            : inscripcionesRecientes.map((inscripcion) => (
                <article className="admin-recent-row" key={inscripcion.id_inscripcion}>
                  <div>
                    <strong>{obtenerNombreCliente(inscripcion.cliente_cedula)}</strong>
                    <span>{obtenerNombreTaller(inscripcion.id_taller)}</span>
                  </div>
                  <time>{formatearFecha(inscripcion.fecha_inscripcion)}</time>
                </article>
              ))}
        </section>

        <section className="admin-panel-box">
          <h3>Niveles de Clientes</h3>
          {estadisticas.niveles.length === 0
            ? renderVacio("No hay niveles registrados.")
            : estadisticas.niveles.map((nivel) => (
                <article className="admin-level-row" key={nivel.id_tipo_taller}>
                  <span>{nivel.nombre}</span>
                  <strong>{nivel.total}</strong>
                </article>
              ))}
        </section>
      </div>
    </>
  );

  const renderClientes = () => (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Clientes</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar clientes..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("cliente")}>
            <IconoAdmin tipo="plus" />
            Nuevo Cliente
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Nivel</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => {
              const progreso = progresoPorCliente.get(String(cliente.cedula));
              return (
                <tr key={cliente.cedula}>
                  <td>{cliente.cedula}</td>
                  <td>{nombreCompleto(cliente)}</td>
                  <td>{obtenerTipo(progreso?.id_tipo_taller) || "Sin nivel"}</td>
                  <td>{renderBadgeEstado(obtenerEstado(cliente.id_estado))}</td>
                  <td className="admin-table-actions">{renderAccionEliminar("cliente", cliente.cedula, "Eliminar cliente")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {clientesFiltrados.length === 0 && renderVacio("No hay clientes para mostrar.")}
      </section>
    </>
  );

  const renderTalleres = () => (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Talleres</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar talleres..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("taller")}>
            <IconoAdmin tipo="plus" />
            Nuevo Taller
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fechas</th>
              <th>Coach / Coord</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {talleresFiltrados.map((taller) => {
              const coach = obtenerPersonalAsignado(taller.id_taller, "coach");
              const coordinador = obtenerPersonalAsignado(taller.id_taller, "coordinador");
              return (
                <tr key={taller.id_taller}>
                  <td>{taller.nombre}</td>
                  <td>{obtenerTipo(taller.id_tipo_taller) || "Sin tipo"}</td>
                  <td>{formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}</td>
                  <td>
                    <strong>{coach || "Sin coach"}</strong>
                    <span>{coordinador || "Sin coordinador"}</span>
                  </td>
                  <td>{renderBadgeEstado(obtenerEstado(taller.id_estado))}</td>
                  <td className="admin-table-actions">{renderAccionEliminar("taller", taller.id_taller, "Eliminar taller")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {talleresFiltrados.length === 0 && renderVacio("No hay talleres para mostrar.")}
      </section>
    </>
  );

  const renderInscripciones = () => (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Inscripciones</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar inscripciones..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("inscripcion")}>
            <IconoAdmin tipo="plus" />
            Inscribir Cliente
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Taller</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripcionesFiltradas.map((inscripcion) => (
              <tr key={inscripcion.id_inscripcion}>
                <td>
                  <strong>{obtenerNombreCliente(inscripcion.cliente_cedula)}</strong>
                  <span>{inscripcion.cliente_cedula}</span>
                </td>
                <td>{obtenerNombreTaller(inscripcion.id_taller)}</td>
                <td>{renderBadgeEstado(obtenerEstado(inscripcion.id_estado))}</td>
                <td>{formatearFecha(inscripcion.fecha_inscripcion)}</td>
                <td className="admin-table-actions">
                  {renderAccionEliminar("inscripcion", inscripcion.id_inscripcion, "Eliminar inscripción")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inscripcionesFiltradas.length === 0 && renderVacio("No hay inscripciones para mostrar.")}
      </section>
    </>
  );

  const renderPersonal = () => (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Personal</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar personal..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("personal")}>
            <IconoAdmin tipo="plus" />
            Nuevo Personal
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personalFiltrado.map((persona) => {
              const usuarioPersonal = usuarioPorPersonal.get(String(persona.cedula));
              return (
                <tr key={persona.cedula}>
                  <td>{nombreCompleto(persona)}</td>
                  <td>{usuarioPersonal?.username || "Sin usuario"}</td>
                  <td>{renderBadgeEstado(obtenerRol(persona.id_rol))}</td>
                  <td>
                    <strong>{persona.correo || "Sin correo"}</strong>
                    <span>{persona.telefono || "Sin teléfono"}</span>
                  </td>
                  <td className="admin-table-actions">{renderAccionEliminar("personal", persona.cedula, "Eliminar personal")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {personalFiltrado.length === 0 && renderVacio("No hay personal para mostrar.")}
      </section>
    </>
  );

  const renderProgreso = () => (
    <>
      <header className="admin-header">
        <h2>Progreso de Clientes</h2>
        <p>Visión general del avance de cada cliente en el programa.</p>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Nivel Actual</th>
              <th>Talleres Completados</th>
              <th>Inscripciones Activas</th>
              <th>Último Taller</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {resumenProgreso.map((fila) => (
              <tr key={fila.cliente.cedula}>
                <td>
                  <strong>{nombreCompleto(fila.cliente)}</strong>
                  <span>{fila.cliente.cedula}</span>
                </td>
                <td>{fila.nivel || "Sin nivel"}</td>
                <td>
                  <span className="admin-count-pill">{fila.completados}</span>
                </td>
                <td>
                  <span className="admin-count-pill admin-count-active">{fila.activas}</span>
                </td>
                <td>{fila.ultimoTaller || "Sin taller"}</td>
                <td>{renderBadgeEstado(fila.estado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {resumenProgreso.length === 0 && renderVacio("No hay progreso para mostrar.")}
      </section>
    </>
  );

  const renderAuditoria = () => (
    <>
      <header className="admin-header">
        <h2>Auditoría</h2>
      </header>
      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tabla</th>
              <th>Acción</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {ordenarPorFechaDesc(auditorias, "fecha").map((auditoria) => (
              <tr key={auditoria.id_auditoria}>
                <td>{formatearFecha(auditoria.fecha)}</td>
                <td>{auditoria.tabla || "Sin tabla"}</td>
                <td>{auditoria.accion || "Sin acción"}</td>
                <td>{auditoria.descripcion || "Sin descripción"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {auditorias.length === 0 && renderVacio("No hay auditoría registrada.")}
      </section>
    </>
  );

  const renderCalendario = () => (
    <>
      <header className="admin-header">
        <h2>Calendario</h2>
      </header>
      <section className="admin-calendar-list">
        {ordenarPorFechaDesc(talleres, "fecha_inicio").map((taller) => (
          <article className="admin-calendar-item" key={`calendar-${taller.id_taller}`}>
            <time>{formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}</time>
            <div>
              <strong>{taller.nombre}</strong>
              <span>{obtenerTipo(taller.id_tipo_taller) || "Sin tipo"} · {obtenerEstado(taller.id_estado) || "Sin estado"}</span>
            </div>
          </article>
        ))}
        {talleres.length === 0 && renderVacio("No hay talleres programados.")}
      </section>
    </>
  );

  const renderContenido = () => {
    if (seccionActiva === "clientes") return renderClientes();
    if (seccionActiva === "talleres") return renderTalleres();
    if (seccionActiva === "inscripciones") return renderInscripciones();
    if (seccionActiva === "personal") return renderPersonal();
    if (seccionActiva === "progreso") return renderProgreso();
    if (seccionActiva === "auditoria") return renderAuditoria();
    if (seccionActiva === "calendario") return renderCalendario();
    return renderPanel();
  };

  const renderSelectEstados = (tipo, value = "id_estado") => (
    <select name={value} value={formularios[tipo][value]} onChange={(event) => cambiarFormulario(tipo, event)} required>
      <option value="">Selecciona un estado</option>
      {estados.map((estado) => (
        <option value={estado.id_estado} key={estado.id_estado}>
          {estado.nombre}
        </option>
      ))}
    </select>
  );

  const renderModalCliente = () => (
    <form className="admin-form" onSubmit={guardarCliente}>
      <div className="admin-form-grid">
        <label>
          Cédula
          <input name="cedula" value={formularios.cliente.cedula} onChange={(event) => cambiarFormulario("cliente", event)} required />
        </label>
        <label>
          Nombres
          <input name="nombres" value={formularios.cliente.nombres} onChange={(event) => cambiarFormulario("cliente", event)} required />
        </label>
        <label>
          Apellidos
          <input name="apellidos" value={formularios.cliente.apellidos} onChange={(event) => cambiarFormulario("cliente", event)} required />
        </label>
        <label>
          Correo
          <input name="correo" type="email" value={formularios.cliente.correo} onChange={(event) => cambiarFormulario("cliente", event)} />
        </label>
        <label>
          Teléfono
          <input name="telefono" value={formularios.cliente.telefono} onChange={(event) => cambiarFormulario("cliente", event)} />
        </label>
        <label>
          Sexo
          <select name="sexo" value={formularios.cliente.sexo} onChange={(event) => cambiarFormulario("cliente", event)} required>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
        <label>
          Edad
          <input name="edad" type="number" min="1" value={formularios.cliente.edad} onChange={(event) => cambiarFormulario("cliente", event)} required />
        </label>
        <label>
          Estado
          {renderSelectEstados("cliente")}
        </label>
        <label>
          Nivel inicial
          <select name="id_tipo_taller" value={formularios.cliente.id_tipo_taller} onChange={(event) => cambiarFormulario("cliente", event)} required>
            <option value="">Selecciona un nivel</option>
            {tiposTaller.map((tipo) => (
              <option value={tipo.id_tipo_taller} key={tipo.id_tipo_taller}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : "Crear cliente"}
        </button>
      </div>
    </form>
  );

  const renderModalTaller = () => (
    <form className="admin-form" onSubmit={guardarTaller}>
      <div className="admin-form-grid">
        <label className="admin-form-full">
          Nombre
          <input name="nombre" value={formularios.taller.nombre} onChange={(event) => cambiarFormulario("taller", event)} required />
        </label>
        <label>
          Tipo
          <select name="id_tipo_taller" value={formularios.taller.id_tipo_taller} onChange={(event) => cambiarFormulario("taller", event)} required>
            <option value="">Selecciona un tipo</option>
            {tiposTaller.map((tipo) => (
              <option value={tipo.id_tipo_taller} key={tipo.id_tipo_taller}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estado
          {renderSelectEstados("taller")}
        </label>
        <label>
          Fecha inicio
          <input name="fecha_inicio" type="date" value={formularios.taller.fecha_inicio} onChange={(event) => cambiarFormulario("taller", event)} required />
        </label>
        <label>
          Fecha fin
          <input name="fecha_fin" type="date" value={formularios.taller.fecha_fin} onChange={(event) => cambiarFormulario("taller", event)} required />
        </label>
        <label>
          Coach
          <select name="coach" value={formularios.taller.coach} onChange={(event) => cambiarFormulario("taller", event)}>
            <option value="">Selecciona un coach</option>
            {personalPorRolNombre("coach").map((persona) => (
              <option value={persona.cedula} key={`coach-${persona.cedula}`}>
                {nombreCompleto(persona)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Coordinador
          <select name="coordinador" value={formularios.taller.coordinador} onChange={(event) => cambiarFormulario("taller", event)}>
            <option value="">Selecciona un coordinador</option>
            {personalPorRolNombre("coordinador").map((persona) => (
              <option value={persona.cedula} key={`coord-${persona.cedula}`}>
                {nombreCompleto(persona)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : "Crear taller"}
        </button>
      </div>
    </form>
  );

  const renderModalInscripcion = () => (
    <form className="admin-form" onSubmit={guardarInscripcion}>
      <div className="admin-form-grid">
        <label className="admin-form-full">
          Cliente
          <select name="cliente_cedula" value={formularios.inscripcion.cliente_cedula} onChange={(event) => cambiarFormulario("inscripcion", event)} required>
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option value={cliente.cedula} key={cliente.cedula}>
                {nombreCompleto(cliente)} - {cliente.cedula}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-form-full">
          Taller
          <select name="id_taller" value={formularios.inscripcion.id_taller} onChange={(event) => cambiarFormulario("inscripcion", event)} required>
            <option value="">Selecciona un taller</option>
            {talleres.map((taller) => (
              <option value={taller.id_taller} key={taller.id_taller}>
                {taller.nombre} - {obtenerTipo(taller.id_tipo_taller)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estado
          {renderSelectEstados("inscripcion")}
        </label>
        <label>
          Fecha inscripción
          <input
            name="fecha_inscripcion"
            type="date"
            value={formularios.inscripcion.fecha_inscripcion}
            onChange={(event) => cambiarFormulario("inscripcion", event)}
            required
          />
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : "Inscribir cliente"}
        </button>
      </div>
    </form>
  );

  const renderModalPersonal = () => (
    <form className="admin-form" onSubmit={guardarPersonal}>
      <div className="admin-form-grid">
        <label>
          Cédula
          <input name="cedula" value={formularios.personal.cedula} onChange={(event) => cambiarFormulario("personal", event)} required />
        </label>
        <label>
          Nombres
          <input name="nombres" value={formularios.personal.nombres} onChange={(event) => cambiarFormulario("personal", event)} required />
        </label>
        <label>
          Apellidos
          <input name="apellidos" value={formularios.personal.apellidos} onChange={(event) => cambiarFormulario("personal", event)} required />
        </label>
        <label>
          Rol
          <select name="id_rol" value={formularios.personal.id_rol} onChange={(event) => cambiarFormulario("personal", event)} required>
            <option value="">Selecciona un rol</option>
            {roles
              .filter((rol) => !normalizar(rol.nombre).includes("cliente"))
              .map((rol) => (
                <option value={rol.id_rol} key={rol.id_rol}>
                  {rol.nombre}
                </option>
              ))}
          </select>
        </label>
        <label>
          Correo
          <input name="correo" type="email" value={formularios.personal.correo} onChange={(event) => cambiarFormulario("personal", event)} required />
        </label>
        <label>
          Teléfono
          <input name="telefono" value={formularios.personal.telefono} onChange={(event) => cambiarFormulario("personal", event)} required />
        </label>
        <label>
          Usuario
          <input name="username" value={formularios.personal.username} onChange={(event) => cambiarFormulario("personal", event)} required />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            minLength="8"
            value={formularios.personal.password}
            onChange={(event) => cambiarFormulario("personal", event)}
            required
          />
        </label>
        <label className="admin-check">
          <input name="activo" type="checkbox" checked={formularios.personal.activo} onChange={(event) => cambiarFormulario("personal", event)} />
          Usuario activo
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : "Crear personal"}
        </button>
      </div>
    </form>
  );

  const titulosModal = {
    cliente: "Nuevo Cliente",
    taller: "Nuevo Taller",
    inscripcion: "Inscribir Cliente",
    personal: "Nuevo Personal",
  };

  const renderModal = () => {
    if (!modalActivo) return null;

    return (
      <div className="admin-modal-backdrop" role="presentation" onMouseDown={cerrarModal}>
        <section className="admin-modal" role="dialog" aria-modal="true" aria-label={titulosModal[modalActivo]} onMouseDown={(event) => event.stopPropagation()}>
          <header className="admin-modal-header">
            <h3>{titulosModal[modalActivo]}</h3>
            <button type="button" onClick={cerrarModal} aria-label="Cerrar formulario">×</button>
          </header>
          {modalActivo === "cliente" && renderModalCliente()}
          {modalActivo === "taller" && renderModalTaller()}
          {modalActivo === "inscripcion" && renderModalInscripcion()}
          {modalActivo === "personal" && renderModalPersonal()}
        </section>
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={logo} alt="Lidera360" />
          <strong>Lidera360</strong>
        </div>
        <span className="admin-menu-label">Navegación</span>
        <nav className="admin-menu" aria-label="Navegación del coordinador">
          {seccionesAdmin.map((seccion) => (
            <button
              type="button"
              key={seccion.id}
              className={`admin-menu-item ${seccionActiva === seccion.id ? "admin-menu-item-active" : ""}`}
              onClick={() => {
                setSeccionActiva(seccion.id);
                setBusqueda("");
              }}
            >
              <IconoAdmin tipo={seccion.icono} />
              <span>{seccion.etiqueta}</span>
            </button>
          ))}
        </nav>
        <button type="button" className="admin-menu-item admin-logout" onClick={onLogout}>
          <IconoAdmin tipo="logout" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <section className="admin-main">
        <div className="admin-user-line">Bienvenido, {usuario.username}</div>
        {mensaje && <p className="admin-alert admin-alert-success">{mensaje}</p>}
        {error && <p className="admin-alert admin-alert-error">{error}</p>}
        {renderContenido()}
      </section>

      {renderModal()}
    </div>
  );
}

export default PanelCoordinador;
