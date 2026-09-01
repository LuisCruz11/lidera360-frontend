function IconoCliente({ tipo }) {
  const paths = {
    book: (
      <>
        <path d="M5 5.8c1.8-.9 3.5-.9 5.2 0v12.4c-1.7-.9-3.4-.9-5.2 0V5.8Z" />
        <path d="M19 5.8c-1.8-.9-3.5-.9-5.2 0v12.4c1.7-.9 3.4-.9 5.2 0V5.8Z" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 4.5h6l1 2H8l1-2Z" />
        <path d="M7 6.5H5.8A1.8 1.8 0 0 0 4 8.3v9.9A1.8 1.8 0 0 0 5.8 20h12.4a1.8 1.8 0 0 0 1.8-1.8V8.3a1.8 1.8 0 0 0-1.8-1.8H17" />
        <path d="M8 12h8M8 16h6" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 4v3M17 4v3M5.8 6h12.4A1.8 1.8 0 0 1 20 7.8v10.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.2V7.8A1.8 1.8 0 0 1 5.8 6Z" />
        <path d="M4 10h16" />
      </>
    ),
    user: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    clock: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    check: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
    x: (
      <>
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </>
    ),
    logout: (
      <>
        <path d="M10 6H6.8A1.8 1.8 0 0 0 5 7.8v8.4A1.8 1.8 0 0 0 6.8 18H10" />
        <path d="M14 8l4 4-4 4M18 12H9" />
      </>
    ),
  };

  return (
    <svg className="cliente-icono" viewBox="0 0 24 24" aria-hidden="true">
      {paths[tipo]}
    </svg>
  );
}

export default IconoCliente;
