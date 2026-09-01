function IconoAdmin({ tipo }) {
  const paths = {
    grid: (
      <>
        <path d="M4 4h6v6H4V4Z" />
        <path d="M14 4h6v6h-6V4Z" />
        <path d="M4 14h6v6H4v-6Z" />
        <path d="M14 14h6v6h-6v-6Z" />
      </>
    ),
    users: (
      <>
        <path d="M15 19a6 6 0 0 0-12 0" />
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M22 19a5 5 0 0 0-5-5" />
        <path d="M16 3.2a4 4 0 0 1 0 7.6" />
      </>
    ),
    cap: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 11.5v4.2c1.7 1.4 3.3 2.1 5 2.1s3.3-.7 5-2.1v-4.2" />
        <path d="M21 9v5" />
      </>
    ),
    clipboard: (
      <>
        <path d="M9 4h6l1 2H8l1-2Z" />
        <path d="M7 6H5.8A1.8 1.8 0 0 0 4 7.8v10.4A1.8 1.8 0 0 0 5.8 20h12.4a1.8 1.8 0 0 0 1.8-1.8V7.8A1.8 1.8 0 0 0 18.2 6H17" />
        <path d="M8 12h8M8 16h6" />
      </>
    ),
    person: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </>
    ),
    trend: (
      <>
        <path d="M4 17 9 12l4 4 7-8" />
        <path d="M15 8h5v5" />
      </>
    ),
    history: (
      <>
        <path d="M4 12a8 8 0 1 0 2.3-5.7" />
        <path d="M4 4v5h5" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 4v3M17 4v3M5.8 6h12.4A1.8 1.8 0 0 1 20 7.8v10.4a1.8 1.8 0 0 1-1.8 1.8H5.8A1.8 1.8 0 0 1 4 18.2V7.8A1.8 1.8 0 0 1 5.8 6Z" />
        <path d="M4 10h16" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" />
        <path d="m16 16 4 4" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 13h10l1-13" />
        <path d="M9 7V4h6v3" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
    logout: (
      <>
        <path d="M10 6H6.8A1.8 1.8 0 0 0 5 7.8v8.4A1.8 1.8 0 0 0 6.8 18H10" />
        <path d="M14 8l4 4-4 4M18 12H9" />
      </>
    ),
    lock: (
      <>
        <path d="M6.8 10.5h10.4a.8.8 0 0 1 .8.8v7.9a.8.8 0 0 1-.8.8H6.8a.8.8 0 0 1-.8-.8v-7.9a.8.8 0 0 1 .8-.8Z" />
        <path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" />
      </>
    ),
  };

  return (
    <svg className="admin-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[tipo]}
    </svg>
  );
}

export default IconoAdmin;
