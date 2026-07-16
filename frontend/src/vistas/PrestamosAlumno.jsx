import "../App.css";
import SidebarAlumno from "../componentes/SidebarAlumno";
import LogoutButton from "../componentes/LogoutButton";
import { FaBook, FaBoxOpen, FaSearch, FaHistory } from "react-icons/fa";
import { useState, useEffect } from "react";

function PrestamosAlumno() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const getToken = () => localStorage.getItem("token");

  const cargarMisPrestamos = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/prestamos/mis-prestamos", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al cargar historial de préstamos");
      }

      const data = await res.json();
      setPrestamos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMisPrestamos();
  }, []);

  const prestamosFiltrados = prestamos.filter(
    (prestamo) =>
      prestamo.material?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prestamo.tipo_prestamo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      prestamo.estado?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="dashboard" style={{ position: "relative" }}>
      <SidebarAlumno />
      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Mis Préstamos</h1>
            <p>Historial de solicitudes y préstamos activos.</p>
          </div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
            <LogoutButton />
          </div>
        </div>

        <div className="table-section">
          <div className="table-header">
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <FaHistory /> Historial de Solicitudes
            </h2>

            <div className="inv-buscador-container">
              <FaSearch className="inv-buscador-icono" />
              <input
                type="text"
                placeholder="Buscar en el historial..."
                className="inv-buscador"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <p style={{ padding: "20px" }}>Cargando historial...</p>
            ) : prestamosFiltrados.length === 0 ? (
              <p style={{ padding: "20px" }}>No se encontraron préstamos.</p>
            ) : (
              <table className="table-section" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>Fecha Solicitud</th>
                    <th>Tipo</th>
                    <th>Material / Libro</th>
                    <th>Categoría</th>
                    <th>Fecha Devolución</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {prestamosFiltrados.map((p) => (
                    <tr key={p.id_prestamo}>
                      <td>{new Date(p.fecha_solicitud).toLocaleDateString("es-ES")}</td>
                      <td>
                        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                          {p.tipo_prestamo === "Libro" ? (
                            <FaBook style={{ color: "#007bff" }} />
                          ) : (
                            <FaBoxOpen style={{ color: "#28a745" }} />
                          )}
                          {p.tipo_prestamo}
                        </span>
                      </td>
                      <td><strong>{p.material || "Desconocido"}</strong></td>
                      <td>{p.categoria || "—"}</td>
                      <td>
                        {p.fecha_devolucion_real
                          ? new Date(p.fecha_devolucion_real).toLocaleDateString("es-ES")
                          : p.fecha_devolucion_esperada
                          ? new Date(p.fecha_devolucion_esperada).toLocaleDateString("es-ES")
                          : "—"}
                      </td>
                      <td>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            display: "inline-block",
                            background:
                              p.estado === "Activo"
                                ? "#d4edda"
                                : p.estado === "Pendiente"
                                ? "#fff3cd"
                                : p.estado === "Devuelto"
                                ? "#cce5ff"
                                : "#f8d7da",
                            color:
                              p.estado === "Activo"
                                ? "#155724"
                                : p.estado === "Pendiente"
                                ? "#856404"
                                : p.estado === "Devuelto"
                                ? "#004085"
                                : "#721c24",
                          }}
                        >
                          {p.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PrestamosAlumno;