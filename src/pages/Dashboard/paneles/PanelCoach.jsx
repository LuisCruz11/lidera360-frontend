import "../../../styles/dashboard.css";
import "../../../styles/admin.css";
import CambiarPasswordForm from "./CambiarPasswordForm";

function PanelCoach({ usuario }) {
  return (
    <div className="panel-content">
      <h2>Panel Coach</h2>
      <p>Bienvenido, {usuario.username}</p>
      <div className="panel-buttons">
        <button>Ver mis clientes</button>
        <button>Crear taller</button>
        <button>Calificar estudiantes</button>
      </div>
      <div className="admin-panel-box panel-cuenta">
        <h3>Mi cuenta</h3>
        <CambiarPasswordForm idUsuario={usuario.id_usuario} />
      </div>
    </div>
  );
}

export default PanelCoach;