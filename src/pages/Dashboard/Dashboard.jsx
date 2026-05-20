import "../../styles/dashboard.css";
import logo from "../../assets/images/logo.png";

import PanelCoordinador from "./paneles/PanelCoordinador";
import PanelCoach from "./paneles/PanelCoach";
import PanelPersonalCapacitado from "./paneles/PanelPersonalCapacitado";
import PanelCliente from "./paneles/PanelCliente";

const paneles = {
  1: PanelCoordinador,
  2: PanelCoach,
  3: PanelPersonalCapacitado,
  4: PanelCliente,
  5: PanelCoordinador,
};

function Dashboard({ usuario, onLogout }) {
  const Panel = paneles[usuario.id_rol] || PanelCliente;
  const esCliente = usuario.id_rol === 4;
  const esCoordinador = usuario.id_rol === 5;

  return (
    <div className={`dashboard ${esCliente ? "dashboard-cliente" : ""} ${esCoordinador ? "dashboard-coordinador" : ""}`}>
      {!esCliente && !esCoordinador && <nav className="dashboard-navbar">
        <div className="navbar-left">
          <img src={logo} alt="Lidera360" className="navbar-logo" />
          <h1>Lidera360</h1>
        </div>
        <div className="navbar-right">
          <span className="navbar-usuario">Bienvenido, {usuario.username}</span>
          <button className="navbar-logout" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </nav>}
      <main className={`dashboard-main ${esCliente ? "dashboard-main-cliente" : ""} ${esCoordinador ? "dashboard-main-coordinador" : ""}`}>
        <Panel usuario={usuario} onLogout={onLogout} />
      </main>
    </div>
  );
}

export default Dashboard;
