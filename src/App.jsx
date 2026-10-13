import { useState } from "react";
import RegistroUsuario from "./pages/RegistroUsuario";
import LoginUsuario from "./pages/LoginUsuario";
import RecuperarPassword from "./pages/RecuperarPassword";
import RestablecerPassword from "./pages/RestablecerPassword";
import Dashboard from "./pages/Dashboard/Dashboard";

// El enlace del correo de recuperación llega como /?restablecer=<token>.
const tokenRestablecer = new URLSearchParams(window.location.search).get("restablecer");

const limpiarUrl = () => window.history.replaceState(null, "", window.location.pathname);

function App() {
  const [paginaActual, setPaginaActual] = useState(tokenRestablecer ? "restablecer" : "login");
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const irARegistro = () => setPaginaActual("registro");
  const irALogin = () => setPaginaActual("login");
  const irARecuperar = () => {
    limpiarUrl();
    setPaginaActual("recuperar");
  };
  const irALoginDesdeRestablecer = () => {
    limpiarUrl();
    setPaginaActual("login");
  };

  const manejarLoginExito = (usuario) => {
    setUsuarioLogueado(usuario);
    setPaginaActual("dashboard");
  };

  const manejarLogout = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setPaginaActual("login");
  };

  if (paginaActual === "registro") {
    return (
      <RegistroUsuario onLoginClick={irALogin} />
    );
  }

  if (paginaActual === "recuperar") {
    return <RecuperarPassword onVolverLogin={irALogin} />;
  }

  if (paginaActual === "restablecer" && tokenRestablecer) {
    return (
      <RestablecerPassword
        token={tokenRestablecer}
        onIrLogin={irALoginDesdeRestablecer}
        onSolicitarOtro={irARecuperar}
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
    <LoginUsuario
      onLoginExito={manejarLoginExito}
      onRegistroClick={irARegistro}
      onOlvidePassword={irARecuperar}
    />
  );
}

export default App;