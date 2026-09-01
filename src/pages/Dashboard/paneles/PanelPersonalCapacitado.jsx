import "../../../styles/dashboard.css";
import "../../../styles/admin.css";
import CambiarPasswordForm from "./CambiarPasswordForm";

function PanelPersonalCapacitado({ usuario }) {
  return (
    <div className="panel-content">
      <h2>Panel Personal Capacitado</h2>
      <p>Bienvenido, {usuario.username}</p>
      <div className="panel-buttons">
        <button>Ver clientes asignados</button>
        <button>Calificar desempeño</button>
        <button>Ver mis talleres</button>
      </div>
      <div className="admin-panel-box panel-cuenta">
        <h3>Mi cuenta</h3>
        <CambiarPasswordForm idUsuario={usuario.id_usuario} />
      </div>
    </div>
  );
}

export default PanelPersonalCapacitado;