import "../styles/home.css";
import logo from "../assets/images/logo.png";
import Talleres from "../assets/images/Talleres.png";

function Home() {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo" />
        </div>

        <ul className="menu">
          <li>Talleres</li>
          <li>Programas</li>
          <li>Nosotros</li>
        </ul>

        <div className="nav-buttons">
          <button className="btn-login">Iniciar sesión</button>
          <button className="btn-register">Empezar</button>
        </div>
      </nav>

      <section className="hero">
        <img src={Talleres} className="hero-bg" />

        <div className="hero-overlay">
          <h1>Transforma tu vida</h1>
          <p>
            🔥 Transforma tu Vida 💪 <br />
            🙌 Logra tus metas 💡 <br />
            😎 Vive como tú elijas vivir ❤️
          </p>
          <button className="btn-primary">Comenzar ahora</button>
        </div>
      </section>

      <section className="cards">
        <div className="card">Liderazgo</div>
        <div className="card">Coaching</div>
        <div className="card">Transformación</div>
      </section>
    </div>
  );
}

export default Home;