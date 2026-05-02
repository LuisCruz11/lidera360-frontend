import "../../../styles/dashboard.css";

function PanelCliente({ usuario }) {
  return (
    <div className="panel-content">
      <h2>Panel Cliente</h2>
      <p>Bienvenido, {usuario.username}</p>
      <div className="panel-buttons">
        <button>Ver mis talleres</button>
        <button>Ver mi progreso</button>
        <button>Mi perfil</button>
      </div>
    </div>
  );
}

export default PanelCliente;