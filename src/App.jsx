import { useState } from "react";
import Home from "./pages/Home";
import RegistroUsuario from "./pages/RegistroUsuario";
import LoginUsuario from "./pages/LoginUsuario";
import Dashboard from "./pages/Dashboard/Dashboard";

function App() {
  const [paginaActual, setPaginaActual] = useState("home");
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const irARegistro = () => setPaginaActual("registro");
  const irALogin = () => setPaginaActual("login");
  const irAHome = () => setPaginaActual("home");

  const manejarLoginExito = (usuario) => {
    setUsuarioLogueado(usuario);
    setPaginaActual("dashboard");
  };

  const manejarLogout = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setPaginaActual("home");
  };

  if (paginaActual === "registro") {
    return (
      <RegistroUsuario 
        onVolverInicio={irAHome}
        onLoginClick={irALogin}
      />
    );
  }

  if (paginaActual === "login") {
    return (
      <LoginUsuario 
        onVolverInicio={irAHome}
        onLoginExito={manejarLoginExito}
        onRegistroClick={irARegistro}
      />
    );
  }

  if (paginaActual === "dashboard" && usuarioLogueado) {
    return (
      <Dashboard 
        usuario={usuarioLogueado}
        onLogout={manejarLogout}
      />
    );
  }

  return (
    <Home 
      onRegistroClick={irARegistro}
      onLoginClick={irALogin}
    />
  );
}

export default App;