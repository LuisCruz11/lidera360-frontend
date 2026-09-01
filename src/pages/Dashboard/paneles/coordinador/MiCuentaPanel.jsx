import CambiarPasswordForm from "../CambiarPasswordForm";

function MiCuentaPanel({ idUsuario }) {
  return (
    <>
      <header className="admin-header">
        <h2>Mi Cuenta</h2>
      </header>
      <section className="admin-panel-box">
        <CambiarPasswordForm idUsuario={idUsuario} />
      </section>
    </>
  );
}

export default MiCuentaPanel;
