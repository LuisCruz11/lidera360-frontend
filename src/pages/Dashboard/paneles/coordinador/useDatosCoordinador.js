import { useCallback, useEffect, useMemo, useState } from "react";
import {
  actualizarCliente,
  actualizarInscripcion,
  actualizarPersonal,
  actualizarTaller,
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
import { crearMapa, formulariosIniciales, hoyISO, nombreCompleto, normalizar, ordenarPorFechaDesc } from "./utils";

export function useDatosCoordinador() {
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
  const [modoModal, setModoModal] = useState("crear");
  const [idEnEdicion, setIdEnEdicion] = useState(null);
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
    queueMicrotask(cargarDatos);
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
        .filter((asignacion) => normalizar(asignacion.rol_en_taller).includes(normalizar(rolBuscado)))
        .map((asignacion) => nombreCompleto(personalPorCedula.get(String(asignacion.cedula_personal)) || asignacion))
        .join(", ");
    },
    [asignacionesPorTaller, personalPorCedula]
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

  const abrirModalCrear = (tipo) => {
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
    setModoModal("crear");
    setIdEnEdicion(null);
    setModalActivo(tipo);
  };

  const abrirModalEditar = (tipo, registro) => {
    setMensaje("");
    setError("");

    if (tipo === "cliente") {
      const progreso = progresoPorCliente.get(String(registro.cedula));
      setFormularios((actuales) => ({
        ...actuales,
        cliente: {
          cedula: registro.cedula,
          nombres: registro.nombres || "",
          apellidos: registro.apellidos || "",
          correo: registro.correo || "",
          telefono: registro.telefono || "",
          sexo: registro.sexo || "M",
          edad: registro.edad ?? "",
          id_estado: registro.id_estado ?? "",
          id_tipo_taller: progreso?.id_tipo_taller ?? "",
        },
      }));
      setIdEnEdicion(registro.cedula);
    } else if (tipo === "taller") {
      const asignaciones = asignacionesPorTaller.get(String(registro.id_taller)) || [];
      const coach = asignaciones.find((asignacion) => normalizar(asignacion.rol_en_taller).includes("coach"));
      const coordinador = asignaciones.find((asignacion) => normalizar(asignacion.rol_en_taller).includes("coordinador"));
      setFormularios((actuales) => ({
        ...actuales,
        taller: {
          nombre: registro.nombre || "",
          id_tipo_taller: registro.id_tipo_taller ?? "",
          fecha_inicio: (registro.fecha_inicio || "").slice(0, 10),
          fecha_fin: (registro.fecha_fin || "").slice(0, 10),
          id_estado: registro.id_estado ?? "",
          coach: coach?.cedula_personal || "",
          coordinador: coordinador?.cedula_personal || "",
        },
      }));
      setIdEnEdicion(registro.id_taller);
    } else if (tipo === "inscripcion") {
      setFormularios((actuales) => ({
        ...actuales,
        inscripcion: {
          cliente_cedula: registro.cliente_cedula,
          id_taller: registro.id_taller,
          id_estado: registro.id_estado ?? "",
          fecha_inscripcion: (registro.fecha_inscripcion || "").slice(0, 10) || hoyISO(),
        },
      }));
      setIdEnEdicion(registro.id_inscripcion);
    } else if (tipo === "personal") {
      setFormularios((actuales) => ({
        ...actuales,
        personal: {
          ...formulariosIniciales.personal,
          cedula: registro.cedula,
          nombres: registro.nombres || "",
          apellidos: registro.apellidos || "",
          correo: registro.correo || "",
          telefono: registro.telefono || "",
          id_rol: registro.id_rol ?? "",
        },
      }));
      setIdEnEdicion(registro.cedula);
    }

    setModoModal("editar");
    setModalActivo(tipo);
  };

  const cerrarModal = () => {
    if (guardando) return;
    setModalActivo(null);
    setModoModal("crear");
    setIdEnEdicion(null);
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
      setModoModal("crear");
      setIdEnEdicion(null);
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
    const payload = {
      ...data,
      edad: Number(data.edad),
      id_estado: Number(data.id_estado),
      id_tipo_taller: Number(data.id_tipo_taller),
    };

    if (modoModal === "editar") {
      ejecutarGuardado(() => actualizarCliente(idEnEdicion, payload), "Cliente actualizado correctamente.");
    } else {
      ejecutarGuardado(() => crearCliente(payload), "Cliente creado correctamente.");
    }
  };

  const guardarTaller = (event) => {
    event.preventDefault();
    const data = formularios.taller;
    const asignaciones = [
      data.coach && { cedula_personal: data.coach, rol_en_taller: "Coach" },
      data.coordinador && { cedula_personal: data.coordinador, rol_en_taller: "Coordinador" },
    ].filter(Boolean);

    const payload = {
      nombre: data.nombre,
      id_tipo_taller: Number(data.id_tipo_taller),
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      id_estado: Number(data.id_estado),
      personal_asignado: asignaciones,
    };

    if (modoModal === "editar") {
      ejecutarGuardado(() => actualizarTaller(idEnEdicion, payload), "Taller actualizado correctamente.");
    } else {
      ejecutarGuardado(() => crearTaller(payload), "Taller creado correctamente.");
    }
  };

  const guardarInscripcion = (event) => {
    event.preventDefault();
    const data = formularios.inscripcion;
    const payload = {
      cliente_cedula: data.cliente_cedula,
      id_taller: Number(data.id_taller),
      id_estado: Number(data.id_estado),
      fecha_inscripcion: data.fecha_inscripcion,
    };

    if (modoModal === "editar") {
      ejecutarGuardado(() => actualizarInscripcion(idEnEdicion, payload), "Inscripción actualizada correctamente.");
    } else {
      ejecutarGuardado(() => crearInscripcion(payload), "Inscripción creada correctamente.");
    }
  };

  const guardarPersonal = (event) => {
    event.preventDefault();
    const data = formularios.personal;

    if (modoModal === "editar") {
      const payload = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        correo: data.correo,
        telefono: data.telefono,
        id_rol: Number(data.id_rol),
      };
      ejecutarGuardado(() => actualizarPersonal(idEnEdicion, payload), "Personal actualizado correctamente.");
    } else {
      ejecutarGuardado(
        () =>
          crearPersonal({
            ...data,
            id_rol: Number(data.id_rol),
            activo: Boolean(data.activo),
          }),
        "Personal y usuario creados correctamente."
      );
    }
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

  return {
    seccionActiva,
    setSeccionActiva,
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
    busqueda,
    setBusqueda,
    modalActivo,
    modoModal,
    formularios,
    cargando,
    guardando,
    mensaje,
    error,
    progresoPorCliente,
    usuarioPorPersonal,
    obtenerEstado,
    obtenerRol,
    obtenerTipo,
    obtenerNombreCliente,
    obtenerNombreTaller,
    obtenerPersonalAsignado,
    personalPorRolNombre,
    personalPorCedula,
    clientesFiltrados,
    talleresFiltrados,
    inscripcionesFiltradas,
    personalFiltrado,
    estadisticas,
    inscripcionesRecientes,
    resumenProgreso,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    cambiarFormulario,
    guardarCliente,
    guardarTaller,
    guardarInscripcion,
    guardarPersonal,
    eliminarRegistro,
  };
}
