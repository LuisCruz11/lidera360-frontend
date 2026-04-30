import "../styles/home.css";
import logo from "../assets/images/logo.png";
import Talleres from "../assets/images/Talleres.png";

function Home({ onRegistroClick }) {
  return (
    <div className="home">

      <nav className="navbar">
        <img src={logo} className="logo" />

        <div className="nav-buttons">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-register" onClick={onRegistroClick}>Registrarse</button>
        </div>
      </nav>

      <section className="hero">
        <div className="collage">
          <img src={Talleres} />
          <img src={Talleres} />
          <img src={Talleres} />
        </div>

        <div className="hero-overlay">
          <h1>Crear Conciencia - CC4</h1>
          <h2>
            🔥 Transforma tu Vida 💪 <br />
            🙌 Logra tus metas 💡 <br />
            😎 Vive como tú elijas vivir ❤️
          </h2>
        </div>
      </section>

      <section className="features">

        <div className="card">
          <img src={Talleres} />
          <h2>¿Qué hacemos?</h2>
          <p>
            Ofrecemos talleres de liderazgo y coaching diseñados para el crecimiento personal,
            ayudando a las personas a descubrir su potencial y transformar su vida.
          </p>
        </div>

        <div className="card">
          <img src={Talleres} />
          <h2>Trabajo en equipo</h2>
          <p>Desarrolla habilidades para liderar grupos</p>
        </div>

        <div className="card">
          <img src={Talleres} />
          <h2>Nosotros</h2>
          <p>
            Somos una escuela de liderazgo enfocada en el crecimiento humano.
            Contamos con coaches certificados y una comunidad en constante expansión.
          </p>
        </div>

      </section>

    </div>
  );
}

export default Home;
