import SidebarAlumno from "../componentes/SidebarAlumno";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaBook, FaBan } from "react-icons/fa";

function LibrosAlumno() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalSancionado, setModalSancionado] = useState(false);

  const getToken = () => localStorage.getItem("token");

  const cargarLibros = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/libros", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        throw new Error("Error al cargar libros");
      }

      const data = await res.json();
      setLibros(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const librosFiltrados = libros.filter(
    (libro) =>
      libro.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.codigo_interno?.toLowerCase().includes(busqueda.toLowerCase())
  );
  const handleSolicitar = async (libro) => {
    try {
      const res = await fetch("/api/prestamos/solicitar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          id_item: libro.id_libro || libro.id_material,
          tipo_prestamo: "Libro",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && data.error.toLowerCase().includes("bloqueada")) {
          setModalSancionado(true);
        } else {
          alert(`Error: ${data.error}`);
        }
        return;
      }

      alert("Préstamo solicitado exitosamente.");
      cargarLibros(); // Recargar para actualizar el stock si es necesario
    } catch (error) {
      console.error(error);
      alert("Error al solicitar el préstamo.");
    }
  };

  return (
    <div className="dashboard" style={{ position: "relative" }}>
      <SidebarAlumno />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Libros Disponibles</h1>
            <p>Busca y solicita libros de la biblioteca.</p>
          </div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
            {/* Opcional: <LogoutButton /> si lo importas */}
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="table-section">
          <div className="table-header">
            <h2>Libros de la Biblioteca</h2>

            <div className="inv-buscador-container">
              <FaSearch className="inv-buscador-icono" />

              <input
                type="text"
                placeholder="Buscar libro..."
                className="inv-buscador"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {busqueda && (
                <FaTimes
                  className="inv-buscador-limpiar"
                  onClick={() => setBusqueda("")}
                />
              )}
            </div>
          </div>

          {/* TABLA */}
          <div className="table-container">

            {loading ? (
              <p>Cargando libros...</p>
            ) : librosFiltrados.length === 0 ? (
              <p>No se encontraron libros</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoría</th>
                    <th>Disponibles</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {librosFiltrados.map((libro, index) => (
                    <tr key={libro.id_material || libro.id}>
                      <td>{index + 1}</td>

                      <td>{libro.codigo_interno || "—"}</td>

                      <td>
                        <FaBook style={{ marginRight: "6px" }} />
                        {libro.nombre}
                      </td>

                      <td>{libro.autor || "Sin autor"}</td>

                      <td>{libro.subcategoria || "—"}</td>

                      <td>
                        {libro.stock_disponible}/{libro.stock_total}
                      </td>

                      <td>
                        <span
                          className={
                            libro.stock_disponible > 0
                              ? "inv-disponible"
                              : "inv-agotado"
                          }
                        >
                          {libro.stock_disponible > 0
                            ? "Disponible"
                            : "Agotado"}
                        </span>
                        </td>
                        <td>
                        <button
                          className="inv-btn-solicitar"
                          disabled={libro.stock_disponible === 0}
                          onClick={() => handleSolicitar(libro)}
                        >
                          Solicitar préstamo
                        </button>
                      
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </main>
      {modalSancionado && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(11, 23, 66, 0.7)", backdropFilter: "blur(5px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }} onClick={() => setModalSancionado(false)}>
          <div style={{
            backgroundColor: "white", borderRadius: "20px", padding: "30px",
            width: "90%", maxWidth: "450px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            textAlign: "center"
          }} onClick={(e) => e.stopPropagation()}>
            <FaBan color="#991B1B" size={50} style={{ marginBottom: "15px" }} />
            <h2 style={{ color: "#991B1B", marginTop: 0, fontSize: "24px" }}>
              Préstamo Denegado
            </h2>
            <p style={{ color: "#444", fontSize: "16px", lineHeight: "1.5", marginBottom: "25px" }}>
              Lo sentimos, has sido sancionado. Si quieres volver a solicitar préstamos preséntate con las encargadas del área de biblioteca.
            </p>
            <button onClick={() => setModalSancionado(false)} style={{ padding: "12px 25px", borderRadius: "10px", border: "none", backgroundColor: "#0A1F44", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default LibrosAlumno;