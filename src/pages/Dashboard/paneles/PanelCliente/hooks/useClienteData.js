import { useCallback, useEffect, useState } from "react";
import { inscribirClienteTaller, obtenerPanelCliente } from "../../../api/usuariosApi";

export function useClienteData(usuario) {
  const [cliente, setCliente] = useState(null);
  const [progreso, setProgreso] = useState(null);
  const [talleresInscritos, setTalleresInscritos] = useState([]);
  const [talleresDisponibles, setTalleresDisponibles] = useState([]);

  const cargarPanelCliente = useCallback(async (cedulaCliente, estaActivo = () => true) => {
    try {
      const respuesta = await obtenerPanelCliente(cedulaCliente);
      if (!estaActivo()) return;

      const panel = respuesta.data || {};
      setCliente(panel.perfil || null);
      setProgreso(panel.progreso || null);
      setTalleresInscritos((panel.historial_inscripciones || []).map((taller) => ({
        ...taller,
        categoria: taller.categoria || taller.tipo_taller || "",
      })));
      setTalleresDisponibles((panel.talleres_disponibles || []).map((taller) => ({
        ...taller,
        categoria: taller.categoria || taller.tipo_taller || "",
      })));
    } catch {
      if (!estaActivo()) return;
      setCliente(null);
      setProgreso(null);
      setTalleresInscritos([]);
      setTalleresDisponibles([]);
    }
  }, []);

  useEffect(() => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente) return undefined;

    let componenteActivo = true;
    queueMicrotask(() => {
      if (componenteActivo) {
        cargarPanelCliente(cedulaCliente, () => componenteActivo);
      }
    });

    return () => {
      componenteActivo = false;
    };
  }, [cargarPanelCliente, usuario.cedula_cliente]);

  const manejarInscripcion = async (idTaller) => {
    const cedulaCliente = usuario.cedula_cliente;
    if (!cedulaCliente || !idTaller) return;

    try {
      await inscribirClienteTaller(cedulaCliente, idTaller);
      await cargarPanelCliente(cedulaCliente);
    } catch {
    }
  };

  return {
    cliente,
    progreso,
    talleresInscritos,
    talleresDisponibles,
    cargarPanelCliente,
    manejarInscripcion,
  };
}
