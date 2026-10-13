import { useState } from "react";
import { descargarReporte } from "../../../../api/adminApi";
import IconoAdmin from "./IconoAdmin";

const REPORTES = [
  {
    tipo: "clientes",
    titulo: "Clientes y progreso",
    descripcion: "Contacto, estado, nivel actual, talleres aprobados y no aprobados, inscripciones en curso y programa completado.",
    filtros: [],
  },
  {
    tipo: "inscripciones",
    titulo: "Inscripciones",
    descripcion: "Cada inscripción con cliente, taller, nivel, coach, fecha y estado.",
    filtros: ["fechas", "taller"],
  },
  {
    tipo: "talleres",
    titulo: "Talleres",
    descripcion: "Fechas, estado, personal asignado, inscritos, aprobados, no aprobados y porcentaje de aprobación.",
    filtros: [],
  },
  {
    tipo: "asistencia",
    titulo: "Asistencia",
    descripcion: "Sesiones registradas, asistencias y porcentaje de asistencia de cada participante.",
    filtros: ["taller"],
  },
  {
    tipo: "auditoria",
    titulo: "Auditoría",
    descripcion: "Todas las acciones registradas: fecha y hora, usuario, rol, módulo, acción y descripción.",
    filtros: ["fechas"],
  },
];

const filtrosIniciales = { fecha_desde: "", fecha_hasta: "", id_taller: "" };

// Las respuestas de error llegan como Blob (se pidió un archivo); se leen para mostrar el mensaje.
async function mensajeDeError(err) {
  const datos = err.response?.data;
  if (datos instanceof Blob) {
    try {
      return JSON.parse(await datos.text()).mensaje;
    } catch {
      return null;
    }
  }
  return datos?.mensaje || null;
}

function guardarArchivo(blob, nombre) {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

function nombreDesdeCabecera(cabecera, respaldo) {
  const coincidencia = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(cabecera || "");
  return coincidencia ? decodeURIComponent(coincidencia[1]) : respaldo;
}

function TarjetaReporte({ reporte, talleres }) {
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState("");

  const cambiarFiltro = (event) => {
    const { name, value } = event.target;
    setFiltros((actuales) => ({ ...actuales, [name]: value }));
  };

  const descargar = async () => {
    setError("");
    if (filtros.fecha_desde && filtros.fecha_hasta && filtros.fecha_hasta < filtros.fecha_desde) {
      setError("La fecha final no puede ser anterior a la inicial.");
      return;
    }

    setDescargando(true);
    try {
      const params = Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor));
      const respuesta = await descargarReporte(reporte.tipo, params);
      const nombre = nombreDesdeCabecera(respuesta.headers?.["content-disposition"], `Lidera360-${reporte.tipo}.xlsx`);
      guardarArchivo(respuesta.data, nombre);
    } catch (err) {
      setError((await mensajeDeError(err)) || "No se pudo generar el reporte.");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <article className="admin-panel-box reporte-tarjeta">
      <div className="reporte-encabezado">
        <span className="reporte-icono">
          <IconoAdmin tipo="report" />
        </span>
        <div>
          <h3>{reporte.titulo}</h3>
          <p>{reporte.descripcion}</p>
        </div>
      </div>

      {reporte.filtros.length > 0 && (
        <div className="reporte-filtros">
          {reporte.filtros.includes("fechas") && (
            <>
              <label>
                Desde
                <input type="date" name="fecha_desde" value={filtros.fecha_desde} onChange={cambiarFiltro} />
              </label>
              <label>
                Hasta
                <input type="date" name="fecha_hasta" value={filtros.fecha_hasta} onChange={cambiarFiltro} />
              </label>
            </>
          )}
          {reporte.filtros.includes("taller") && (
            <label className="reporte-filtro-taller">
              Taller
              <select name="id_taller" value={filtros.id_taller} onChange={cambiarFiltro}>
                <option value="">Todos los talleres</option>
                {talleres.map((taller) => (
                  <option value={taller.id_taller} key={taller.id_taller}>
                    {taller.nombre}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      <button type="button" className="admin-primary-button reporte-boton" onClick={descargar} disabled={descargando}>
        <IconoAdmin tipo="download" />
        {descargando ? "Generando..." : "Descargar Excel"}
      </button>
    </article>
  );
}

function ReportesPanel({ datos }) {
  const { talleres } = datos;

  return (
    <>
      <header className="admin-header">
        <h2>Reportes</h2>
      </header>

      <section className="reporte-grid">
        {REPORTES.map((reporte) => (
          <TarjetaReporte key={reporte.tipo} reporte={reporte} talleres={talleres} />
        ))}
      </section>
    </>
  );
}

export default ReportesPanel;
