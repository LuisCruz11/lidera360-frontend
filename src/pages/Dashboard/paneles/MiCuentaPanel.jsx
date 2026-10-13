import CambiarPasswordForm from "./CambiarPasswordForm";
import { EncabezadoPanel } from "./cliente/PanelComponentes";
import { obtenerIniciales } from "./cliente/utils";

const nombresRol = {
  2: "Coach",
  3: "Personal Capacitado",
  5: "Coordinador",
};

function MiCuentaPanel({ usuario }) {
  const rol = nombresRol[Number(usuario.id_rol)] || "";
  const camposCuenta = [
    { etiqueta: "Usuario", valor: usuario.username },
    { etiqueta: "Rol", valor: rol },
  ].filter((campo) => campo.valor);

  return (
    <>
      <EncabezadoPanel titulo="Mi Cuenta" subtitulo="Información de tu cuenta" />
      <section className="cliente-perfil-card">
        <div className="cliente-perfil-main">
          <span className="cliente-avatar cliente-avatar-large">{obtenerIniciales(usuario.username)}</span>
          <div>
            <h3>{usuario.username}</h3>
            {rol && <p>{rol}</p>}
          </div>
        </div>
        <div className="cliente-perfil-grid">
          {camposCuenta.map((campo) => (
            <div key={campo.etiqueta}>
              <span>{campo.etiqueta}</span>
              <strong>{campo.valor}</strong>
            </div>
          ))}
        </div>
      </section>
      {usuario.id_usuario && <CambiarPasswordForm idUsuario={usuario.id_usuario} />}
    </>
  );
}

export default MiCuentaPanel;
