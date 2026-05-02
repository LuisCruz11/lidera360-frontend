import "../../styles/dashboard.css";

function PanelCoordinador({ usuario }) {
  return (
    <div className="panel-content">
      <h2>Panel Coordinador</h2>
      <p>Bienvenido, {usuario.username}</p>
      <div className="panel-buttons">
        <button>Ver todos los usuarios</button>
        <button>Crear taller</button>
        <button>Ver reportes</button>
      </div>
    </div>
  );
}

export default PanelCoordinador;