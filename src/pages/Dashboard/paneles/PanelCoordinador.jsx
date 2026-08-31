import "../../../styles/admin.css";
import logo from "../../../assets/images/logo.png";
import IconoAdmin from "./coordinador/IconoAdmin";
import ModalShell from "./coordinador/ModalShell";
import ResumenPanel from "./coordinador/ResumenPanel";
import ClientesPanel from "./coordinador/ClientesPanel";
import TalleresPanel from "./coordinador/TalleresPanel";
import InscripcionesPanel from "./coordinador/InscripcionesPanel";
import PersonalPanel from "./coordinador/PersonalPanel";
import ProgresoPanel from "./coordinador/ProgresoPanel";
import AuditoriaPanel from "./coordinador/AuditoriaPanel";
import CalendarioPanel from "./coordinador/CalendarioPanel";
import ClienteFormModal from "./coordinador/ClienteFormModal";
import TallerFormModal from "./coordinador/TallerFormModal";
import InscripcionFormModal from "./coordinador/InscripcionFormModal";
import PersonalFormModal from "./coordinador/PersonalFormModal";
import { useDatosCoordinador } from "./coordinador/useDatosCoordinador";

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

const paneles = {
  panel: ResumenPanel,
  clientes: ClientesPanel,
  talleres: TalleresPanel,
  inscripciones: InscripcionesPanel,
  personal: PersonalPanel,
  progreso: ProgresoPanel,
  auditoria: AuditoriaPanel,
  calendario: CalendarioPanel,
};

const modalesPorTipo = {
  cliente: { titulos: { crear: "Nuevo Cliente", editar: "Editar Cliente" }, Form: ClienteFormModal },
  taller: { titulos: { crear: "Nuevo Taller", editar: "Editar Taller" }, Form: TallerFormModal },
  inscripcion: { titulos: { crear: "Inscribir Cliente", editar: "Editar Inscripción" }, Form: InscripcionFormModal },
  personal: { titulos: { crear: "Nuevo Personal", editar: "Editar Personal" }, Form: PersonalFormModal },
};

function PanelCoordinador({ usuario, onLogout }) {
  const datos = useDatosCoordinador();
  const { seccionActiva, setSeccionActiva, setBusqueda, modalActivo, modoModal, cerrarModal, mensaje, error } = datos;

  const SeccionActiva = paneles[seccionActiva] || ResumenPanel;
  const modalConfig = modalActivo ? modalesPorTipo[modalActivo] : null;
  const FormularioModal = modalConfig?.Form;

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
        <SeccionActiva datos={datos} />
      </section>

      {modalActivo && modalConfig && (
        <ModalShell titulo={modalConfig.titulos[modoModal]} onCerrar={cerrarModal}>
          <FormularioModal datos={datos} />
        </ModalShell>
      )}
    </div>
  );
}

export default PanelCoordinador;
