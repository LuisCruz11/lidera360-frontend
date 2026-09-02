import "../../../styles/admin.css";
import logo from "../../../assets/images/logo.png";
import IconoAdmin from "./coordinador/IconoAdmin";
import CambiarPasswordForm from "./CambiarPasswordForm";
import TalleresPanel from "./personalCapacitado/TalleresPanel";
import ClientesPanel from "./personalCapacitado/ClientesPanel";
import TallerDetalleModal from "./personalCapacitado/TallerDetalleModal";
import { useDatosPersonalCapacitado } from "./personalCapacitado/useDatosPersonalCapacitado";

const secciones = [
  { id: "talleres", etiqueta: "Talleres", icono: "cap" },
  { id: "clientes", etiqueta: "Clientes", icono: "users" },
  { id: "cuenta", etiqueta: "Mi Cuenta", icono: "lock" },
];

const paneles = {
  talleres: TalleresPanel,
  clientes: ClientesPanel,
};

function PanelPersonalCapacitado({ usuario, onLogout }) {
  const datos = useDatosPersonalCapacitado();
  const { seccionActiva, setSeccionActiva, setBusqueda, error } = datos;

  const SeccionActiva = paneles[seccionActiva] || TalleresPanel;

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={logo} alt="Lidera360" />
          <strong>Lidera360</strong>
        </div>
        <span className="admin-menu-label">Navegación</span>
        <nav className="admin-menu" aria-label="Navegación de personal capacitado">
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
          <SeccionActiva datos={datos} />
        )}
      </section>

      <TallerDetalleModal datos={datos} />
    </div>
  );
}

export default PanelPersonalCapacitado;
