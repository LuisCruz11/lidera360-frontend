import ModalShell from "../coordinador/ModalShell";
import { formatearRangoFechas } from "./utils";

function ModalConfirmacion({ titulo, taller, descripcion, textoConfirmar, procesando, peligro, onConfirmar, onCerrar }) {
  if (!taller) return null;

  return (
    <ModalShell titulo={titulo} onCerrar={procesando ? () => {} : onCerrar}>
      <div className="cliente-confirmacion">
        <h4>{taller.nombre}</h4>
        <p>
          {[taller.categoria, formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin), taller.coach && `Coach: ${taller.coach}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <p>{descripcion}</p>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={onCerrar} disabled={procesando}>
          Volver
        </button>
        <button
          type="button"
          className={`admin-primary-button ${peligro ? "cliente-boton-peligro" : ""}`}
          onClick={onConfirmar}
          disabled={procesando}
        >
          {procesando ? "Procesando..." : textoConfirmar}
        </button>
      </div>
    </ModalShell>
  );
}

export default ModalConfirmacion;
