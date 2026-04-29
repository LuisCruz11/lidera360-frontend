import { useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";

function App() {
  const [personal, setPersonal] = useState([]);

  useEffect(() => {
    axiosClient.get("/personal/")
      .then(res => {
        setPersonal(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // 👇 AQUÍ VA EL LOADING
  if (personal.length === 0) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div>
      <h1>Personal desde Render 🚀</h1>

      {personal.map((p, index) => (
        <div key={index}>
          {p.nombres} - {p.cedula}
        </div>
      ))}
    </div>
  );
}

export default App;