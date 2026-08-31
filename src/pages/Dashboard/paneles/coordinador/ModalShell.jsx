function ModalShell({ titulo, onCerrar, children }) {
  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={onCerrar}>
      <section className="admin-modal" role="dialog" aria-modal="true" aria-label={titulo} onMouseDown={(event) => event.stopPropagation()}>
        <header className="admin-modal-header">
          <h3>{titulo}</h3>
          <button type="button" onClick={onCerrar} aria-label="Cerrar formulario">×</button>
        </header>
        {children}
      </section>
    </div>
  );
}

export default ModalShell;
