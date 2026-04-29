import "../styles/home.css";
import { useState } from "react";
import logo from "../assets/images/logo.png";
import Talleres from "../assets/images/Talleres.png";

function Home() {
  const [menu, setMenu] = useState(null);

  return (
    <div className="home">

      <nav className="navbar">
        <img src={logo} className="logo" />

        <ul className="menu">
          <li onMouseEnter={() => setMenu("talleres")} onMouseLeave={() => setMenu(null)}>
            Talleres
            {menu === "talleres" && (
              <div className="dropdown">
                <p>Básico</p>
                <p>Intermedio</p>
                <p>Avanzado</p>
              </div>
            )}
          </li>

          <li onMouseEnter={() => setMenu("experiencia")} onMouseLeave={() => setMenu(null)}>
            Experiencia
            {menu === "experiencia" && (
              <div className="dropdown">
                <p>Transformación personal</p>
                <p>Trabajo en equipo</p>
                <p>Desarrollo emocional</p>
              </div>
            )}
          </li>

          <li onMouseEnter={() => setMenu("nosotros")} onMouseLeave={() => setMenu(null)}>
            Nosotros
            {menu === "nosotros" && (
              <div className="dropdown">
                <p>Somos una escuela de liderazgo</p>
                <p>Equipo de coaches certificados</p>
                <p>Más de 500+ participantes</p>
              </div>
            )}
          </li>
        </ul>

        <div className="nav-buttons">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-register">Registrarse</button>
        </div>
      </nav>

      <section className="hero">
        <div className="collage">
          <img src={Talleres} />
          <img src={Talleres} />
          <img src={Talleres} />
        </div>

        <div className="hero-overlay">
          <h1>Transforma tu vida</h1>
          <p>
            🔥 Transforma tu Vida 💪 <br />
            🙌 Logra tus metas 💡 <br />
            😎 Vive como tú elijas vivir ❤️
          </p>
        </div>
      </section>

    </div>
  );
}

export default Home;