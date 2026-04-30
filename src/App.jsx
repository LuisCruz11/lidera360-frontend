import { useState } from "react";
import Home from "./pages/Home";
import RegistroCliente from "./pages/RegistroCliente";

function App() {
  const [paginaActual, setPaginaActual] = useState("home");

  if (paginaActual === "registro") {
    return <RegistroCliente onVolverInicio={() => setPaginaActual("home")} />;
  }

  return <Home onRegistroClick={() => setPaginaActual("registro")} />;
}

export default App;
