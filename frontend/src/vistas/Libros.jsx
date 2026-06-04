import "../App.css";
import Sidebar from "../componentes/Sidebar";
import { useState, useEffect } from "react";
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaBoxOpen,
  FaExclamationTriangle,
} from "react-icons/fa";

function Libros() {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [libroEditar, setLibroEditar] = useState(null);
  const [libroEliminar, setLibroEliminar] = useState(null);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  // Form state
  const [form, setForm] = useState({
    nombre: "",
    especificaciones: "",
    stock_total: "",
    stock_disponible: "",
    codigo_interno: "",
    imagen: "",
    autor: "",
    editorial: "",
    edicion: "",
    paginas: "",
    anio_publicacion: "",
    lugar_impresion: "",
    isbn: "",
    subcategoria: "",
  });

  // Obtener token
  const getToken = () => localStorage.getItem("token");

  // Cargar libros
  const cargarLibros = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/libros", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Error al cargar libros");
      const data = await res.json();
      setLibros(data);
    } catch (err) {
      setError("No se pudieron cargar los libros. Verifica tu conexión.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  // Limpiar mensajes después de 4 segundos
  useEffect(() => {
    if (exito || error) {
      const timer = setTimeout(() => {
        setExito("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [exito, error]);

  // Filtrar libros por búsqueda
  const librosFiltrados = libros.filter(
    (libro) =>
      libro.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.codigo_interno?.toLowerCase().includes(busqueda.toLowerCase()) ||
      libro.especificaciones?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Abrir modal para agregar
  const abrirModalAgregar = () => {
    setLibroEditar(null);
    setForm({
      nombre: "",
      especificaciones: "",
      stock_total: "",
      stock_disponible: "",
      codigo_interno: "",
      imagen: "",
      autor: "",
      editorial: "",
      edicion: "",
      paginas: "",
      anio_publicacion: "",
      lugar_impresion: "",
      isbn: "",
      subcategoria: "",
    });
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const abrirModalEditar = (libro) => {
    setLibroEditar(libro);
    setForm({
      nombre: libro.nombre || "",
      especificaciones: libro.especificaciones || "",
      stock_total: libro.stock_total ?? "",
      stock_disponible: libro.stock_disponible ?? "",
      codigo_interno: libro.codigo_interno || "",
      imagen: libro.imagen || "",
      autor: libro.autor || "",
      editorial: libro.editorial || "",
      edicion: libro.edicion || "",
      paginas: libro.paginas || "",
      anio_publicacion: libro.anio_publicacion || "",
      lugar_impresion: libro.lugar_impresion || "",
      isbn: libro.isbn || "",
      subcategoria: libro.subcategoria || "",
    });
    setModalAbierto(true);
  };

  // Guardar libro (crear o actualizar)
  const guardarLibro = async (e) => {
    e.preventDefault();

    if (!form.nombre || form.stock_total === "") {
      setError("Nombre y stock total son obligatorios.");
      return;
    }

    try {
      const url = libroEditar
        ? `/api/libros/${libroEditar.id_material}`
        : "/api/libros";

      const method = libroEditar ? "PUT" : "POST";

      const body = {
        nombre: form.nombre,
        especificaciones: form.especificaciones || null,
        stock_total: parseInt(form.stock_total),
        codigo_interno: form.codigo_interno || null,
        imagen: form.imagen || null,
        autor: form.autor || null,
        editorial: form.editorial || null,
        edicion: form.edicion || null,
        paginas: form.paginas ? parseInt(form.paginas) : null,
        anio_publicacion: form.anio_publicacion || null,
        lugar_impresion: form.lugar_impresion || null,
        isbn: form.isbn || null,
        subcategoria: form.subcategoria || null,
      };

      if (libroEditar) {
        body.stock_disponible = parseInt(form.stock_disponible);
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al guardar");
      }

      setExito(libroEditar ? "Libro actualizado correctamente ✓" : "Libro agregado correctamente ✓");
      setModalAbierto(false);
      cargarLibros();
    } catch (err) {
      setError(err.message);
    }
  };

  // Confirmar eliminación
  const confirmarEliminar = (libro) => {
    setLibroEliminar(libro);
    setModalEliminar(true);
  };

  // Eliminar libro
  const eliminarLibro = async () => {
    try {
      const res = await fetch(`/api/libros/${libroEliminar.id_material}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar");
      }

      setExito("Libro eliminado correctamente ✓");
      setModalEliminar(false);
      setLibroEliminar(null);
      cargarLibros();
    } catch (err) {
      setError(err.message);
    }
  };

  // Badge de estado de stock
  const getStockBadge = (disponible, total) => {
    const porcentaje = total > 0 ? (disponible / total) * 100 : 0;
    if (porcentaje === 0) {
      return <span className="status inv-agotado">Agotado</span>;
    } else if (porcentaje <= 30) {
      return <span className="status inv-bajo">Bajo</span>;
    } else {
      return <span className="status inv-disponible">Disponible</span>;
    }
  };

  // Resumen
  const totalLibros = libros.length;
  const totalEjemplares = libros.reduce((sum, l) => sum + (l.stock_total || 0), 0);
  const totalDisponibles = libros.reduce((sum, l) => sum + (l.stock_disponible || 0), 0);
  const totalPrestados = totalEjemplares - totalDisponibles;

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        {/* ===== TOPBAR ===== */}
        <div className="topbar">
          <div>
            <h1>📚 Inventario de Libros</h1>
            <p>Gestiona el catálogo y stock de libros de la biblioteca.</p>
          </div>
          <div className="topbar-right">
            <button className="inv-btn-agregar" onClick={abrirModalAgregar}>
              <FaPlus /> Agregar Libro
            </button>
          </div>
        </div>

        {/* ===== MENSAJES ===== */}
        {exito && (
          <div className="inv-mensaje inv-mensaje-exito">
            {exito}
          </div>
        )}
        {error && (
          <div className="inv-mensaje inv-mensaje-error">
            {error}
          </div>
        )}

        {/* ===== MINI CARDS RESUMEN ===== */}
        <div className="inv-resumen-grid">
          <div className="inv-resumen-card">
            <div className="inv-resumen-icono inv-icono-total">
              <FaBook />
            </div>
            <div>
              <p className="inv-resumen-label">Total títulos</p>
              <h3 className="inv-resumen-valor">{totalLibros}</h3>
            </div>
          </div>

          <div className="inv-resumen-card">
            <div className="inv-resumen-icono inv-icono-ejemplares">
              <FaBoxOpen />
            </div>
            <div>
              <p className="inv-resumen-label">Ejemplares</p>
              <h3 className="inv-resumen-valor">{totalEjemplares}</h3>
            </div>
          </div>

          <div className="inv-resumen-card">
            <div className="inv-resumen-icono inv-icono-disponibles">
              <FaBook />
            </div>
            <div>
              <p className="inv-resumen-label">Disponibles</p>
              <h3 className="inv-resumen-valor">{totalDisponibles}</h3>
            </div>
          </div>

          <div className="inv-resumen-card">
            <div className="inv-resumen-icono inv-icono-prestados">
              <FaExclamationTriangle />
            </div>
            <div>
              <p className="inv-resumen-label">Prestados</p>
              <h3 className="inv-resumen-valor">{totalPrestados}</h3>
            </div>
          </div>
        </div>

        {/* ===== TABLA INVENTARIO ===== */}
        <div className="table-section">
          <div className="table-header">
            <h2>Base de Datos del Inventario</h2>
            <div className="inv-buscador-container">
              <FaSearch className="inv-buscador-icono" />
              <input
                type="text"
                placeholder="Buscar por nombre, código o especificación..."
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

          <div className="table-container">
            {loading ? (
              <div className="inv-loading">
                <div className="inv-spinner"></div>
                <p>Cargando inventario...</p>
              </div>
            ) : librosFiltrados.length === 0 ? (
              <div className="inv-vacio">
                <FaBook className="inv-vacio-icono" />
                <p>
                  {busqueda
                    ? "No se encontraron libros con esa búsqueda."
                    : "No hay libros registrados. ¡Agrega el primero!"}
                </p>
              </div>
            ) : (
              <table id="tabla-inventario">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Código</th>
                    <th>Título</th>
                    <th>Autor / Editorial</th>
                    <th>Subcategoría</th>
                    <th>Disponibles</th>
                    <th>Prestados</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {librosFiltrados.map((libro, index) => (
                    <tr key={libro.id_material}>
                      <td className="inv-td-num">{index + 1}</td>
                      <td>
                        <span className="inv-codigo">
                          {libro.codigo_interno || "—"}
                        </span>
                      </td>
                      <td className="inv-td-nombre">
                        <div className="inv-nombre-wrap">
                          <FaBook className="inv-nombre-icono" />
                          {libro.nombre}
                        </div>
                      </td>
                      <td className="inv-td-specs">
                        {libro.autor ? `${libro.autor}` : "Sin autor"} <br/>
                        <small>{libro.editorial ? `Ed. ${libro.editorial}` : ""}</small>
                      </td>
                      <td>
                        {libro.subcategoria || "—"}
                      </td>
                      <td className="inv-td-center">{libro.stock_disponible} / {libro.stock_total}</td>
                      <td className="inv-td-center">{libro.prestados || 0}</td>
                      <td>
                        {getStockBadge(libro.stock_disponible, libro.stock_total)}
                      </td>
                      <td>
                        <div className="inv-acciones">
                          <button
                            className="inv-btn-editar"
                            onClick={() => abrirModalEditar(libro)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="inv-btn-eliminar"
                            onClick={() => confirmarEliminar(libro)}
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {!loading && librosFiltrados.length > 0 && (
            <div className="inv-tabla-footer">
              <span>
                Mostrando {librosFiltrados.length} de {libros.length} libros
              </span>
            </div>
          )}
        </div>

        {/* ===== MODAL AGREGAR / EDITAR ===== */}
        {modalAbierto && (
          <div className="inv-modal-overlay" onClick={() => setModalAbierto(false)}>
            <div className="inv-modal" onClick={(e) => e.stopPropagation()}>
              <div className="inv-modal-header">
                <h2>{libroEditar ? "Editar Libro" : "Agregar Nuevo Libro"}</h2>
                <button
                  className="inv-modal-cerrar"
                  onClick={() => setModalAbierto(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={guardarLibro} className="inv-modal-form">
                <div className="inv-form-grupo">
                  <label>Título del Libro *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    placeholder="Ej: Matemáticas I"
                    required
                  />
                </div>

                <div className="inv-form-fila">
                  <div className="inv-form-grupo">
                    <label>Autor</label>
                    <input
                      type="text"
                      value={form.autor}
                      onChange={(e) =>
                        setForm({ ...form, autor: e.target.value })
                      }
                      placeholder="Ej: Baldor"
                    />
                  </div>
                  <div className="inv-form-grupo">
                    <label>Editorial</label>
                    <input
                      type="text"
                      value={form.editorial}
                      onChange={(e) =>
                        setForm({ ...form, editorial: e.target.value })
                      }
                      placeholder="Ej: Trillas"
                    />
                  </div>
                </div>

                <div className="inv-form-fila">
                  <div className="inv-form-grupo">
                    <label>Categoría</label>
                    <input
                      type="text"
                      value={form.subcategoria}
                      onChange={(e) =>
                        setForm({ ...form, subcategoria: e.target.value })
                      }
                      placeholder="Ej: SECRETARIADO"
                    />
                  </div>
                  <div className="inv-form-grupo">
                    <label>ISBN</label>
                    <input
                      type="text"
                      value={form.isbn}
                      onChange={(e) =>
                        setForm({ ...form, isbn: e.target.value })
                      }
                      placeholder="Ej: 968-14-0237-5"
                    />
                  </div>
                </div>

                <div className="inv-form-fila">
                  <div className="inv-form-grupo">
                    <label>Edición</label>
                    <input
                      type="text"
                      value={form.edicion}
                      onChange={(e) =>
                        setForm({ ...form, edicion: e.target.value })
                      }
                      placeholder="Ej: 1a"
                    />
                  </div>
                  <div className="inv-form-grupo">
                    <label>Páginas</label>
                    <input
                      type="number"
                      value={form.paginas}
                      onChange={(e) =>
                        setForm({ ...form, paginas: e.target.value })
                      }
                      placeholder="Ej: 350"
                    />
                  </div>
                  <div className="inv-form-grupo">
                    <label>Año Pub.</label>
                    <input
                      type="text"
                      value={form.anio_publicacion}
                      onChange={(e) =>
                        setForm({ ...form, anio_publicacion: e.target.value })
                      }
                      placeholder="Ej: 1975"
                    />
                  </div>
                </div>

                <div className="inv-form-fila">
                  <div className="inv-form-grupo">
                    <label>Stock Total *</label>
                    <input
                      type="number"
                      min="0"
                      value={form.stock_total}
                      onChange={(e) =>
                        setForm({ ...form, stock_total: e.target.value })
                      }
                      placeholder="0"
                      required
                    />
                  </div>

                  {libroEditar && (
                    <div className="inv-form-grupo">
                      <label>Stock Disponible</label>
                      <input
                        type="number"
                        min="0"
                        value={form.stock_disponible}
                        onChange={(e) =>
                          setForm({ ...form, stock_disponible: e.target.value })
                        }
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>

                <div className="inv-form-fila">
                  <div className="inv-form-grupo">
                    <label>Código Interno</label>
                    <input
                      type="text"
                      value={form.codigo_interno}
                      onChange={(e) =>
                        setForm({ ...form, codigo_interno: e.target.value })
                      }
                      placeholder="Ej: LIB-001"
                    />
                  </div>

                  <div className="inv-form-grupo">
                    <label>URL de Imagen</label>
                    <input
                      type="text"
                      value={form.imagen}
                      onChange={(e) =>
                        setForm({ ...form, imagen: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="inv-modal-acciones">
                  <button
                    type="button"
                    className="inv-btn-cancelar"
                    onClick={() => setModalAbierto(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="inv-btn-guardar">
                    {libroEditar ? "Guardar Cambios" : "Agregar Libro"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===== MODAL CONFIRMAR ELIMINACIÓN ===== */}
        {modalEliminar && (
          <div className="inv-modal-overlay" onClick={() => setModalEliminar(false)}>
            <div
              className="inv-modal inv-modal-eliminar"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="inv-eliminar-icono">
                <FaExclamationTriangle />
              </div>
              <h2>¿Eliminar este libro?</h2>
              <p className="inv-eliminar-nombre">
                "{libroEliminar?.nombre}"
              </p>
              <p className="inv-eliminar-aviso">
                Esta acción no se puede deshacer. Se eliminará permanentemente del inventario.
              </p>
              <div className="inv-modal-acciones">
                <button
                  className="inv-btn-cancelar"
                  onClick={() => setModalEliminar(false)}
                >
                  Cancelar
                </button>
                <button className="inv-btn-confirmar-eliminar" onClick={eliminarLibro}>
                  Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Libros;