import { useState } from "react";
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
};

function Dashboard({ usuario, onLogout }) {
  const Panel = paneles[usuario.id_rol] || PanelCliente;

  return (
    <div className="dashboard">
      <nav className="dashboard-navbar">
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
      </nav>
      <main className="dashboard-main">
        <Panel usuario={usuario} />
      </main>
    </div>
  );
}

export default Dashboard;