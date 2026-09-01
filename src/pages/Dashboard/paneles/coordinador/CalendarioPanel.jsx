import { useMemo, useState } from "react";
import ModalShell from "./ModalShell";
import { construirCeldasCalendario, formateadorMes, formatearRangoFechas } from "./utils";

const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function CalendarioPanel({ datos }) {
  const { talleres, obtenerTipo, obtenerEstado, obtenerPersonalAsignado } = datos;
  const [desplazamientoMes, setDesplazamientoMes] = useState(0);
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);

  const fechaBase = useMemo(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth() + desplazamientoMes, 1);
  }, [desplazamientoMes]);

  const celdasCalendario = useMemo(
    () => construirCeldasCalendario(fechaBase, talleres),
    [fechaBase, talleres]
  );

  return (
    <>
      <header className="admin-header">
        <h2>Calendario</h2>
      </header>

      <section className="admin-calendar-card">
        <div className="admin-calendar-toolbar">
          <button type="button" aria-label="Mes anterior" onClick={() => setDesplazamientoMes((mes) => mes - 1)}>
            ‹
          </button>
          <h3>{formateadorMes.format(fechaBase)}</h3>
          <button type="button" aria-label="Mes siguiente" onClick={() => setDesplazamientoMes((mes) => mes + 1)}>
            ›
          </button>
        </div>
        <div className="admin-calendar-weekdays">
          {diasSemana.map((dia) => (
            <span key={dia}>{dia}</span>
          ))}
        </div>
        <div className="admin-calendar-grid">
          {celdasCalendario.map((celda) => (
            <div
              className={`admin-calendar-day ${celda.dia ? "" : "admin-calendar-day-vacio"}`}
              key={celda.clave}
            >
              {celda.dia && <span className="admin-calendar-numero">{celda.dia}</span>}
              {celda.eventos.slice(0, 3).map((taller) => (
                <button
                  type="button"
                  className="admin-calendar-evento"
                  key={`${celda.clave}-${taller.id_taller}`}
                  aria-label={`Ver información de ${taller.nombre}`}
                  onClick={() => setTallerSeleccionado(taller)}
                >
                  {taller.nombre}
                </button>
              ))}
              {celda.eventos.length > 3 && (
                <span className="admin-calendar-mas">+ {celda.eventos.length - 3} más</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {tallerSeleccionado && (
        <ModalShell titulo={tallerSeleccionado.nombre} onCerrar={() => setTallerSeleccionado(null)}>
          <div className="admin-calendar-detalle">
            <p>
              <strong>Fechas: </strong>
              {formatearRangoFechas(tallerSeleccionado.fecha_inicio, tallerSeleccionado.fecha_fin)}
            </p>
            <p>
              <strong>Tipo: </strong>
              {obtenerTipo(tallerSeleccionado.id_tipo_taller) || "Sin tipo"}
            </p>
            <p>
              <strong>Estado: </strong>
              {obtenerEstado(tallerSeleccionado.id_estado) || "Sin estado"}
            </p>
            <p>
              <strong>Coach: </strong>
              {obtenerPersonalAsignado(tallerSeleccionado.id_taller, "coach") || "Sin asignar"}
            </p>
            <p>
              <strong>Coordinador: </strong>
              {obtenerPersonalAsignado(tallerSeleccionado.id_taller, "coordinador") || "Sin asignar"}
            </p>
          </div>
        </ModalShell>
      )}
    </>
  );
}

export default CalendarioPanel;
