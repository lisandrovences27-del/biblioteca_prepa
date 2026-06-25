import SidebarAlumno from "../componentes/SidebarAlumno";
import { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaBook } from "react-icons/fa";

function LibrosAlumno() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

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
  const handleSolicitar = (libro) => {
  console.log("Solicitud de préstamo:", libro);
};

  return (
    <div className="dashboard">
      <SidebarAlumno />

      <main className="main-content">
        <h1>Libros Disponibles</h1>

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
              <table className="table-section">
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
                          className="inv-btn-editar"
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
    </div>
  );
}

export default LibrosAlumno;