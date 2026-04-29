import "../styles/home.css";
import logo from "../assets/images/logo.png";
import Talleres from "../assets/images/Talleres.png";

function Home() {
  return (
    <div className="home">

      <nav className="navbar">
        <img src={logo} className="logo" />

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
          <h1>Crear Conciencia - CC4</h1>
          <p>
            🔥 Transforma tu Vida 💪 <br />
            🙌 Logra tus metas 💡 <br />
            😎 Vive como tú elijas vivir ❤️
          </p>
          <button className="btn-primary">Comenzar ahora</button>
        </div>
      </section>

      <section className="info">
        <h2>¿Qué hacemos?</h2>
        <p>
          Ofrecemos talleres de liderazgo y coaching diseñados para el crecimiento personal,
          ayudando a las personas a descubrir su potencial y transformar su vida.
        </p>
      </section>

      <section className="features">
        <div className="feature">
          <h3>Transformación personal</h3>
          <p>Cambia tu mentalidad y rompe tus límites</p>
        </div>

        <div className="feature">
          <h3>Trabajo en equipo</h3>
          <p>Desarrolla habilidades para liderar grupos</p>
        </div>

        <div className="feature">
          <h3>Desarrollo emocional</h3>
          <p>Fortalece tu inteligencia emocional</p>
        </div>
      </section>

      <section className="about">
        <h2>Nosotros</h2>
        <p>
          Somos una escuela de liderazgo enfocada en el crecimiento humano.
          Contamos con coaches certificados y una comunidad en constante expansión.
        </p>
      </section>

    </div>
  );
}

export default Home;