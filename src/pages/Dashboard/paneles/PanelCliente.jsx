import "../../../styles/cliente.css";
import logo from "../../../assets/images/logo.png";
import IconoCliente from "./cliente/IconoCliente";
import MisTalleresPanel from "./cliente/MisTalleresPanel";
import InscripcionesPanel from "./cliente/InscripcionesPanel";
import CalendarioPanel from "./cliente/CalendarioPanel";
import PerfilPanel from "./cliente/PerfilPanel";
import { useDatosCliente } from "./cliente/useDatosCliente";
import { obtenerIniciales, seccionesCliente } from "./cliente/utils";

const paneles = {
  talleres: MisTalleresPanel,
  inscripciones: InscripcionesPanel,
  calendario: CalendarioPanel,
  perfil: PerfilPanel,
};

function PanelCliente({ usuario, onLogout }) {
  const datos = useDatosCliente(usuario);
  const { seccionActiva, setSeccionActiva, nombreCliente } = datos;

  const SeccionActiva = paneles[seccionActiva] || MisTalleresPanel;

  return (
    <div className="cliente-dashboard">
      <aside className="cliente-sidebar">
        <div className="cliente-brand">
          <img src={logo} alt="Lidera360" />
          <div>
            <strong>Lidera360</strong>
            <span>Portal Participante</span>
          </div>
        </div>

        <div className="cliente-user">
          <span className="cliente-avatar">{obtenerIniciales(nombreCliente)}</span>
          <div>
            <strong>{nombreCliente}</strong>
            <span>{usuario.cedula_cliente ? `V-${usuario.cedula_cliente}` : usuario.id_usuario || ""}</span>
          </div>
        </div>

        <nav className="cliente-menu" aria-label="Opciones del cliente">
          {seccionesCliente.map((seccion) => (
            <button
              type="button"
              key={seccion.id}
              aria-label={seccion.etiqueta}
              className={`cliente-menu-item ${seccionActiva === seccion.id ? "cliente-menu-item-active" : ""}`}
              onClick={() => setSeccionActiva(seccion.id)}
            >
              <IconoCliente tipo={seccion.icono} />
              <span>{seccion.etiqueta}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="cliente-logout" onClick={onLogout}>
          <IconoCliente tipo="logout" />
          <span>Cerrar sesión</span>
        </button>
      </aside>

      <section className="cliente-panel">
        <SeccionActiva datos={datos} />
      </section>
    </div>
  );
}

export default PanelCliente;
