import "../../../styles/admin.css";
import logo from "../../../assets/images/logo.png";
import IconoAdmin from "./coordinador/IconoAdmin";
import CambiarPasswordForm from "./CambiarPasswordForm";
import TalleresPanel from "./coach/TalleresPanel";
import TallerCoachModal from "./coach/TallerCoachModal";
import { useDatosCoach } from "./coach/useDatosCoach";

const secciones = [
  { id: "talleres", etiqueta: "Mis Talleres", icono: "cap" },
  { id: "cuenta", etiqueta: "Mi Cuenta", icono: "lock" },
];

function PanelCoach({ usuario, onLogout }) {
  const datos = useDatosCoach();
  const { seccionActiva, setSeccionActiva, setBusqueda, error } = datos;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={logo} alt="Lidera360" />
          <strong>Lidera360</strong>
        </div>
        <span className="admin-menu-label">Navegación</span>
        <nav className="admin-menu" aria-label="Navegación del coach">
          {secciones.map((seccion) => (
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
        {error && <p className="admin-alert admin-alert-error">{error}</p>}
        {seccionActiva === "cuenta" ? (
          <>
            <header className="admin-header">
              <h2>Mi Cuenta</h2>
            </header>
            <section className="admin-panel-box">
              <CambiarPasswordForm idUsuario={usuario.id_usuario} />
            </section>
          </>
        ) : (
          <TalleresPanel datos={datos} />
        )}
      </section>

      <TallerCoachModal datos={datos} />
    </div>
  );
}

export default PanelCoach;
