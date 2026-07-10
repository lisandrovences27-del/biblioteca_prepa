import "../App.css";
import SidebarAlumno from "../componentes/SidebarAlumno";
import LogoutButton from "../componentes/LogoutButton";
import {
  FaBook,
  FaSearch,
  FaBoxOpen,
  FaUserGraduate,
  FaCalendarAlt,
  FaShoppingCart,
  FaTrash
} from "react-icons/fa";
import { useState, useEffect } from "react";

function PrestamosAlumno() {
  const [numeroControl, setNumeroControl] = useState("");
  const [nombreAlumno, setNombreAlumno] = useState("");

  const usuarioPrueba = {
    numeroControl: "22308001",
    nombre: "Juan Pérez"
  };

  useEffect(() => {
    localStorage.setItem("usuario", JSON.stringify(usuarioPrueba));
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuario) {
      setNumeroControl(usuario.numeroControl);
      setNombreAlumno(usuario.nombre);
    }
  }, []);

  const [tabActiva, setTabActiva] = useState("Libros");
  const [busqueda, setBusqueda] = useState("");
  
  // Filtros Libros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroAutor, setFiltroAutor] = useState("");
  const [soloDisponiblesLibros, setSoloDisponiblesLibros] = useState(false);
  
  // Filtros Materiales
  const [filtroTipo, setFiltroTipo] = useState("");
  const [soloDisponiblesMateriales, setSoloDisponiblesMateriales] = useState(false);

  // Carrito y Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [carrito, setCarrito] = useState([]);

  const recursosPrueba = [
    { nombre: "Matemáticas I", tipo: "Libro", autor: "Baldor", categoria: "Ciencias Exactas", existencias: 3, estado: "Disponible" },
    { nombre: "Física General", tipo: "Libro", autor: "Sears Zemansky", categoria: "Ciencias Exactas", existencias: 0, estado: "No Disponible" },
    { nombre: "Química Básica", tipo: "Libro", autor: "Raymond Chang", categoria: "Ciencias Exactas", existencias: 5, estado: "Disponible" },
    { nombre: "Biología", tipo: "Libro", autor: "Curtis", categoria: "Ciencias Naturales", existencias: 2, estado: "Disponible" },
    { nombre: "Historia Universal", tipo: "Libro", autor: "Gombrich", categoria: "Humanidades", existencias: 1, estado: "Disponible" },
    
    { nombre: "Proyector EPSON", tipo: "Material", categoriaTipo: "Electrónico", cantidad: 2, estado: "Disponible" },
    { nombre: "Guillotina", tipo: "Material", categoriaTipo: "Papelería", cantidad: 1, estado: "Disponible" },
    { nombre: "Calculadora Científica", tipo: "Material", categoriaTipo: "Electrónico", cantidad: 0, estado: "No Disponible" },
    { nombre: "Cable HDMI", tipo: "Material", categoriaTipo: "Accesorio", cantidad: 10, estado: "Disponible" }
  ];

  // Listas de opciones para filtros
  const categoriasLibros = [...new Set(recursosPrueba.filter(r => r.tipo === "Libro").map(r => r.categoria))];
  const autoresLibros = [...new Set(recursosPrueba.filter(r => r.tipo === "Libro").map(r => r.autor))];
  const tiposMateriales = [...new Set(recursosPrueba.filter(r => r.tipo === "Material").map(r => r.categoriaTipo))];

  // Resultados Filtrados
  const librosFiltrados = recursosPrueba.filter(r => r.tipo === "Libro" &&
    r.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (filtroCategoria === "" || r.categoria === filtroCategoria) &&
    (filtroAutor === "" || r.autor === filtroAutor) &&
    (!soloDisponiblesLibros || r.estado === "Disponible")
  );

  const materialesFiltrados = recursosPrueba.filter(r => r.tipo === "Material" &&
    r.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (filtroTipo === "" || r.categoriaTipo === filtroTipo) &&
    (!soloDisponiblesMateriales || r.estado === "Disponible")
  );

  const agregarAlCarrito = (recurso) => {
    if (!carrito.some(item => item.nombre === recurso.nombre)) {
      setCarrito([...carrito, recurso]);
    }
  };

  const removerDelCarrito = (nombreRecurso) => {
    setCarrito(carrito.filter(item => item.nombre !== nombreRecurso));
  };

  const abrirModal = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  const guardarPrestamo = () => {
    if (!numeroControl || !nombreAlumno || carrito.length === 0) {
      alert("Error: Faltan datos del alumno o el carrito está vacío.");
      return;
    }

    const hoy = new Date();
    const fechaPrestamo = hoy.toISOString().split("T")[0];
    const fechaDev = new Date(hoy.setDate(hoy.getDate() + 7)).toISOString().split("T")[0];

    const prestamo = {
      numeroControl,
      nombreAlumno,
      recursos: carrito,
      fechaPrestamo,
      fechaDevolucion: fechaDev,
      observaciones: ""
    };

    console.log("Préstamos registrados:", prestamo);
    alert("✅ Préstamos solicitados correctamente");
    setCarrito([]);
    cerrarModal();
  };

  return (
    <div className="dashboard" style={{ position: "relative" }}>
      <SidebarAlumno />
      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Solicitar préstamo</h1>
            <p>Busca y selecciona los libros o materiales que deseas solicitar.</p>
          </div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
            <LogoutButton />
          </div>
        </div>

        <div className="table-section">
          <div className="form-card" style={{ padding: "0" }}>
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: "1px solid #eee", marginBottom: "20px" }}>
              <button
                onClick={() => { setTabActiva("Libros"); setBusqueda(""); }}
                style={{
                  flex: 1, padding: "15px", border: "none", background: tabActiva === "Libros" ? "#f0f7ff" : "transparent",
                  borderBottom: tabActiva === "Libros" ? "2px solid #0056b3" : "2px solid transparent",
                  fontWeight: tabActiva === "Libros" ? "bold" : "normal", color: tabActiva === "Libros" ? "#0056b3" : "#555",
                  cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                }}
              >
                <FaBook /> Libros
              </button>
              <button
                onClick={() => { setTabActiva("Materiales"); setBusqueda(""); }}
                style={{
                  flex: 1, padding: "15px", border: "none", background: tabActiva === "Materiales" ? "#f0f7ff" : "transparent",
                  borderBottom: tabActiva === "Materiales" ? "2px solid #0056b3" : "2px solid transparent",
                  fontWeight: tabActiva === "Materiales" ? "bold" : "normal", color: tabActiva === "Materiales" ? "#0056b3" : "#555",
                  cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
                }}
              >
                <FaBoxOpen /> Materiales
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              {/* Buscador General y Filtros */}
              <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
                
                <div className="search-book" style={{ margin: 0, width: "100%" }}>
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder={`Buscar ${tabActiva.toLowerCase()}...`}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>

                {tabActiva === "Libros" ? (
                  <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                    <select 
                      value={filtroCategoria} 
                      onChange={(e) => setFiltroCategoria(e.target.value)}
                      style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                      <option value="">Todas las categorías</option>
                      {categoriasLibros.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                    </select>

                    <select 
                      value={filtroAutor} 
                      onChange={(e) => setFiltroAutor(e.target.value)}
                      style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                      <option value="">Todos los autores</option>
                      {autoresLibros.map((autor, i) => <option key={i} value={autor}>{autor}</option>)}
                    </select>

                    <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={soloDisponiblesLibros}
                        onChange={(e) => setSoloDisponiblesLibros(e.target.checked)}
                      />
                      Mostrar únicamente disponibles
                    </label>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: "15px", alignItems: "center", flexWrap: "wrap" }}>
                    <select 
                      value={filtroTipo} 
                      onChange={(e) => setFiltroTipo(e.target.value)}
                      style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
                    >
                      <option value="">Todos los tipos</option>
                      {tiposMateriales.map((tipo, i) => <option key={i} value={tipo}>{tipo}</option>)}
                    </select>

                    <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={soloDisponiblesMateriales}
                        onChange={(e) => setSoloDisponiblesMateriales(e.target.checked)}
                      />
                      Mostrar disponibles
                    </label>
                  </div>
                )}
              </div>

              {/* Tabla */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #ddd" }}>
                      {tabActiva === "Libros" ? (
                        <>
                          <th style={{ padding: "12px" }}>Título</th>
                          <th style={{ padding: "12px" }}>Autor</th>
                          <th style={{ padding: "12px" }}>Existencias</th>
                        </>
                      ) : (
                        <>
                          <th style={{ padding: "12px" }}>Nombre</th>
                          <th style={{ padding: "12px" }}>Tipo</th>
                          <th style={{ padding: "12px" }}>Cantidad</th>
                        </>
                      )}
                      <th style={{ padding: "12px" }}>Estado</th>
                      <th style={{ padding: "12px", textAlign: "center" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tabActiva === "Libros" ? librosFiltrados : materialesFiltrados).map((item, index) => {
                      const yaEnCarrito = carrito.some(c => c.nombre === item.nombre);
                      return (
                        <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                          <td style={{ padding: "12px" }}><strong>{item.nombre}</strong></td>
                          {tabActiva === "Libros" ? (
                            <>
                              <td style={{ padding: "12px" }}>{item.autor}</td>
                              <td style={{ padding: "12px" }}>{item.existencias}</td>
                            </>
                          ) : (
                            <>
                              <td style={{ padding: "12px" }}>{item.categoriaTipo}</td>
                              <td style={{ padding: "12px" }}>{item.cantidad}</td>
                            </>
                          )}
                          <td style={{ padding: "12px" }}>
                            <span style={{
                              padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold",
                              background: item.estado === "Disponible" ? "#d4edda" : "#f8d7da",
                              color: item.estado === "Disponible" ? "#155724" : "#721c24"
                            }}>
                              {item.estado}
                            </span>
                          </td>
                          <td style={{ padding: "12px", textAlign: "center" }}>
                            <button 
                              onClick={() => yaEnCarrito ? removerDelCarrito(item.nombre) : agregarAlCarrito(item)}
                              disabled={item.estado !== "Disponible"}
                              style={{
                                padding: "6px 12px", borderRadius: "5px", border: "none", cursor: item.estado === "Disponible" ? "pointer" : "not-allowed",
                                background: item.estado !== "Disponible" ? "#ccc" : yaEnCarrito ? "#dc3545" : "#007bff", color: "white", fontWeight: "bold",
                                minWidth: "90px"
                              }}
                            >
                              {yaEnCarrito ? "Quitar" : "Agregar"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {(tabActiva === "Libros" ? librosFiltrados : materialesFiltrados).length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                          No se encontraron resultados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Botón Flotante del Carrito */}
      {carrito.length > 0 && (
        <div 
          onClick={abrirModal}
          style={{
            position: "fixed", bottom: "30px", right: "30px", background: "#007bff", color: "white",
            width: "65px", height: "65px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)", cursor: "pointer", zIndex: 999, transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <FaShoppingCart size={24} />
          <span style={{
            position: "absolute", top: "-5px", right: "-5px", background: "#dc3545", color: "white",
            borderRadius: "50%", width: "25px", height: "25px", display: "flex", justifyContent: "center", alignItems: "center",
            fontSize: "14px", fontWeight: "bold", border: "2px solid white"
          }}>
            {carrito.length}
          </span>
        </div>
      )}

      {/* Modal de Confirmación */}
      {modalAbierto && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "white", padding: "30px", borderRadius: "10px", width: "500px", maxWidth: "90%",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)", maxHeight: "80vh", display: "flex", flexDirection: "column"
          }}>
            <h2 style={{ marginTop: 0, marginBottom: "20px", color: "#333", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
              <FaShoppingCart style={{ marginRight: "10px" }} />
              Solicitud de Préstamo
            </h2>
            
            <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaUserGraduate style={{ color: "#007bff", fontSize: "20px" }} />
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Alumno</p>
                <strong>{nombreAlumno} ({numeroControl})</strong>
              </div>
            </div>

            <div style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaCalendarAlt style={{ color: "#ffc107", fontSize: "20px" }} />
              <div>
                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>Fecha de Solicitud</p>
                <strong>{new Date().toLocaleDateString('es-ES')}</strong>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", margin: "15px 0", border: "1px solid #eee", borderRadius: "5px", padding: "10px" }}>
              <h4 style={{ margin: "0 0 10px 0", color: "#555" }}>Artículos Seleccionados ({carrito.length})</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {carrito.map((item, i) => (
                  <li key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < carrito.length - 1 ? "1px solid #eee" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {item.tipo === "Libro" ? <FaBook style={{ color: "#28a745" }} /> : <FaBoxOpen style={{ color: "#28a745" }} />}
                      <div>
                        <strong style={{ display: "block", fontSize: "14px" }}>{item.nombre}</strong>
                        <span style={{ fontSize: "12px", color: "#888" }}>{item.tipo}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removerDelCarrito(item.nombre)}
                      style={{ background: "transparent", border: "none", color: "#dc3545", cursor: "pointer" }}
                      title="Quitar"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
              {carrito.length === 0 && (
                <p style={{ textAlign: "center", color: "#888", margin: "20px 0" }}>El carrito está vacío.</p>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
              <button 
                onClick={cerrarModal}
                style={{ padding: "8px 15px", border: "1px solid #ccc", background: "white", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", color: "#333" }}
              >
                Cerrar
              </button>
              <button 
                onClick={guardarPrestamo}
                disabled={carrito.length === 0}
                style={{ padding: "8px 15px", border: "none", background: carrito.length === 0 ? "#ccc" : "#007bff", color: "white", borderRadius: "5px", cursor: carrito.length === 0 ? "not-allowed" : "pointer", fontWeight: "bold" }}
              >
                Confirmar Solicitud
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrestamosAlumno;