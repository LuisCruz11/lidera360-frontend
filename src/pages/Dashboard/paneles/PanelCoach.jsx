import "../../../styles/dashboard.css";

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
    </div>
  );
}

export default PanelCoach;