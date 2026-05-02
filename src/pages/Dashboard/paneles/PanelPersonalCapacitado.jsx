import "../../styles/dashboard.css";

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
    </div>
  );
}

export default PanelPersonalCapacitado;