import IconoAdmin from "./IconoAdmin";
import { normalizar } from "./utils";

export function BadgeEstado({ estado = "" }) {
  const clase = normalizar(estado).replace(/\s+/g, "-") || "sin-estado";
  return <span className={`admin-badge admin-badge-${clase}`}>{estado || "Sin estado"}</span>;
}

export function EstadoVacio({ cargando, texto }) {
  return <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;
}

export function AccionesFila({ onEditar, onEliminar, etiqueta }) {
  return (
    <>
      {onEditar && (
        <button type="button" className="admin-icon-button" aria-label={`Editar ${etiqueta}`} onClick={onEditar}>
          <IconoAdmin tipo="edit" />
        </button>
      )}
      {onEliminar && (
        <button
          type="button"
          className="admin-icon-button admin-danger"
          aria-label={`Eliminar ${etiqueta}`}
          onClick={onEliminar}
          style={onEditar ? { marginLeft: 8 } : undefined}
        >
          <IconoAdmin tipo="trash" />
        </button>
      )}
    </>
  );
}
