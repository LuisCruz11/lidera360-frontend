export const formatterFecha = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const formateadorMes = new Intl.DateTimeFormat("es-CO", {
  month: "long",
  year: "numeric",
});

export const hoyISO = () => {
  const fecha = new Date();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${fecha.getFullYear()}-${mes}-${dia}`;
};

export const formulariosIniciales = {
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
    username: "",
    password: "",
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

export const normalizar = (valor = "") =>
  valor
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export const crearFecha = (fecha) => {
  if (!fecha) return null;
  const normalizada = typeof fecha === "string" && fecha.length <= 10 ? `${fecha}T00:00:00` : fecha;
  const fechaObjeto = new Date(normalizada);
  return Number.isNaN(fechaObjeto.getTime()) ? null : fechaObjeto;
};

export const formatearFecha = (fecha) => {
  const fechaObjeto = crearFecha(fecha);
  if (!fechaObjeto) return "Por definir";
  return formatterFecha.format(fechaObjeto).replace(".", "");
};

export const formatearRangoFechas = (inicio, fin) => {
  if (inicio && fin) return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
  return formatearFecha(inicio || fin);
};

export const nombreCompleto = (persona = {}) =>
  `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";

export const crearMapa = (lista, llave) => new Map(lista.map((item) => [String(item[llave]), item]));

export const ordenarPorFechaDesc = (lista, llave) =>
  [...lista].sort((a, b) => {
    const fechaA = crearFecha(a[llave])?.getTime() || 0;
    const fechaB = crearFecha(b[llave])?.getTime() || 0;
    return fechaB - fechaA;
  });

export const construirCeldasCalendario = (fechaBase, talleres) => {
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
};
