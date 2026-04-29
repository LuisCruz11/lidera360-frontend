import "../styles/home.css";

import Talleres from "../assets/images/Talleres.png";
import logo from "../assets/images/logo.png";

function Home() {
  return (
    <div className="home">

      <nav className="navbar">
        <img src={logo} alt="logo" className="logo" />

        <div className="nav-buttons">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-register">Registrarse</button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-text">
          <h1>Crear Consciencia</h1>

          <p>
            🔥 Transforma tu Vida 💪 <br />
            🙌 Logra tus metas 💡 <br />
            😎 Vive como tú elijas vivir ❤️
          </p>

          <button className="btn-primary">Comenzar</button>
        </div>

        <div className="hero-image">
          <img src={Talleres} alt="taller liderazgo" />
        </div>
      </section>

      <section className="info">
        <h2>¿Qué hacemos?</h2>
        <p>
          Ofrecemos talleres de liderazgo y coaching diseñados para el crecimiento personal,
          ayudando a las personas a descubrir su potencial y transformar su vida.
        </p>
      </section>

    </div>
  );
}

export default Home;