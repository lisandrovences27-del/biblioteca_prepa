import "../App.css";
import SidebarMateriales from "../componentes/SidebarMateriales";
import LogoutButton from "../componentes/LogoutButton";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaBook,
  FaUserGraduate,
  FaIdCard,
  FaCalendarAlt,
  FaInfoCircle,
  FaBoxOpen
} from "react-icons/fa";
import { useState, useEffect } from "react";

function PrestamosMateriales() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarSolicitudes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/prestamos/todos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      const formateadas = (Array.isArray(data) ? data : []).map(p => ({
        id: p.id_prestamo,
        alumno: p.alumno || "Desconocido",
        matricula: p.numero_control || "N/A",
        material: p.material || "N/A",
        fechaSolicitud: new Date(p.fecha_solicitud).toLocaleDateString("es-ES"),
        estado: p.estado,
        fechaDevolucion: p.fecha_devolucion_esperada ? new Date(p.fecha_devolucion_esperada).toLocaleDateString("es-ES") : null,
        motivo: p.estado === "Rechazado" ? "Rechazado por el administrador" : ""
      }));
      setSolicitudes(formateadas);
    } catch (error) {
      console.error("Error cargando solicitudes:", error);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);
  
  // Estados de Modales
  const [modalAutorizar, setModalAutorizar] = useState(false);
  const [modalDenegar, setModalDenegar] = useState(false);
  const [modalDetalles, setModalDetalles] = useState(false);
  const [solicitudActiva, setSolicitudActiva] = useState(null);

  // Estados de Formularios
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [horaDevolucion, setHoraDevolucion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [motivoRechazo, setMotivoRechazo] = useState("");

  // Funciones para abrir modales
  const abrirAutorizar = (solicitud) => {
    setSolicitudActiva(solicitud);
    setFechaDevolucion("");
    setHoraDevolucion("");
    setObservaciones("");
    setModalAutorizar(true);
  };

  const abrirDenegar = (solicitud) => {
    setSolicitudActiva(solicitud);
    setMotivoRechazo("");
    setModalDenegar(true);
  };

  const abrirDetalles = (solicitud) => {
    setSolicitudActiva(solicitud);
    setModalDetalles(true);
  };

  // Funciones para confirmar acciones
  const confirmarAutorizacion = async (e) => {
    e.preventDefault();
    if (!fechaDevolucion || !horaDevolucion) {
      alert("La fecha y hora de devolución son obligatorias.");
      return;
    }
    
    const diffTime = Math.abs(new Date(fechaDevolucion) - new Date());
    const dias_prestamo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/prestamos/${solicitudActiva.id}/procesar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ accion: "Aprobar", dias_prestamo })
      });

      if (res.ok) {
        alert("Préstamo aprobado con éxito");
        cargarSolicitudes();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
    setModalAutorizar(false);
  };

  const confirmarDenegacion = async (e) => {
    e.preventDefault();
    if (!motivoRechazo) {
      alert("Debes indicar el motivo del rechazo.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/prestamos/${solicitudActiva.id}/procesar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ accion: "Rechazar" })
      });

      if (res.ok) {
        alert("Préstamo rechazado con éxito");
        cargarSolicitudes();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error de red");
    }
    setModalDenegar(false);
  };

  // Estadísticas
  const pendientes = solicitudes.filter(s => s.estado === "Pendiente").length;
  const aprobadas = solicitudes.filter(s => s.estado === "Activo" || s.estado === "Aprobada").length;
  const rechazadas = solicitudes.filter(s => s.estado === "Rechazado" || s.estado === "Rechazada").length;

  // Filtrado
  const solicitudesFiltradas = solicitudes.filter(s => 
    s.alumno.toLowerCase().includes(busqueda.toLowerCase()) || 
    s.matricula.includes(busqueda) ||
    s.material.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Helper para Badges Visuales
  const renderBadge = (estado) => {
    if (estado === "Pendiente") return (
      <span style={{backgroundColor: "#FDE68A", color: "#92400E", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px"}}>
        <FaClock/> {estado}
      </span>
    );
    if (estado === "Activo" || estado === "Aprobada") return (
      <span style={{backgroundColor: "#D1FAE5", color: "#065F46", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px"}}>
        <FaCheckCircle/> {estado}
      </span>
    );
    if (estado === "Rechazado" || estado === "Rechazada") return (
      <span style={{backgroundColor: "#FEE2E2", color: "#991B1B", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px"}}>
        <FaTimesCircle/> {estado}
      </span>
    );
    return (
      <span style={{backgroundColor: "#E5E7EB", color: "#374151", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px"}}>
        {estado}
      </span>
    );
  };

  // Estilos en línea para modales modernos (Para no alterar App.css)
  const modalOverlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(11, 23, 66, 0.7)", backdropFilter: "blur(5px)",
    display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
  };
  
  const modalContentStyle = {
    backgroundColor: "white", borderRadius: "20px", padding: "30px",
    width: "90%", maxWidth: "450px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
  };

  const btnActionStyle = {
    border: "none", borderRadius: "10px", width: "40px", height: "40px",
    display: "inline-flex", justifyContent: "center", alignItems: "center",
    cursor: "pointer", margin: "0 4px", color: "white", fontSize: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  };

  const formInputStyle = {
    width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #ccc",
    marginTop: "8px", marginBottom: "16px", backgroundColor: "#f9f9f9", fontSize: "15px",
    color: "#333", boxSizing: "border-box"
  };

  return (
    <div className="dashboard">
      <SidebarMateriales />

      <main className="main-content">
        {/* ===== TOPBAR ===== */}
        <div className="topbar">
          <div>
            <h1>Gestión de Solicitudes</h1>
            <p>Administra, autoriza o deniega los préstamos solicitados por los alumnos.</p>
          </div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
            <LogoutButton />
          </div>
        </div>

        {/* ===== CARDS DE ESTADÍSTICAS ===== */}
        <div className="cards-container" style={{ marginTop: "30px" }}>
          
          <div className="dashboard-card beige-card">
            <div className="card-left">
              <div className="card-icon-circle" style={{ backgroundColor: "#DDC9A3", color: "#691C32" }}>
                <FaClock />
              </div>
              <div>
                <p className="card-title">Pendientes</p>
                <h2>{pendientes}</h2>
                <span className="card-info">Esperando revisión</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card blue-card">
            <div className="card-left">
              <div className="card-icon-circle" style={{ backgroundColor: "#0A1F44", color: "white" }}>
                <FaCheckCircle />
              </div>
              <div>
                <p className="card-title">Aprobadas</p>
                <h2>{aprobadas}</h2>
                <span className="card-info">Préstamos activos</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card red-card">
            <div className="card-left">
              <div className="card-icon-circle" style={{ backgroundColor: "#691C32", color: "white" }}>
                <FaTimesCircle />
              </div>
              <div>
                <p className="card-title">Rechazadas</p>
                <h2>{rechazadas}</h2>
                <span className="card-info">Préstamos denegados</span>
              </div>
            </div>
          </div>

        </div>

        {/* ===== TABLA DE SOLICITUDES ===== */}
        <div className="table-section" style={{ marginTop: "30px", borderRadius: "20px", overflow: "hidden", backgroundColor: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
          <div className="table-header" style={{ padding: "20px 30px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0, color: "#0B1742", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaBoxOpen /> Solicitudes de materiales
            </h2>
            
            {/* Buscador Integrado */}
            <div style={{ position: "relative", width: "300px" }}>
              <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
              <input
                type="text"
                placeholder="Buscar alumno, matrícula o material..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ width: "100%", padding: "10px 10px 10px 40px", borderRadius: "12px", border: "1px solid #ddd", outline: "none", backgroundColor: "#f5f5f5", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div className="table-container" style={{ overflowX: "auto", padding: "20px" }}>
            {solicitudesFiltradas.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                <FaInfoCircle size={40} style={{ marginBottom: "10px", color: "#ccc" }} />
                <h3>No se encontraron solicitudes.</h3>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f9f9f9", color: "#555", textAlign: "left" }}>
                    <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Alumno</th>
                    <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Matrícula</th>
                    <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Material</th>
                    <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Fecha Solicitud</th>
                    <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Estado</th>
                    <th style={{ padding: "15px", borderBottom: "2px solid #eee", textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesFiltradas.map((solicitud) => (
                    <tr key={solicitud.id} style={{ borderBottom: "1px solid #eee", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fafafa'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: "15px", fontWeight: "bold", color: "#333", display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "35px", height: "35px", borderRadius: "50%", backgroundColor: "#DDC9A3", color: "#691C32", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" }}>
                          {solicitud.alumno.charAt(0)}
                        </div>
                        {solicitud.alumno}
                      </td>
                      <td style={{ padding: "15px", color: "#666" }}>{solicitud.matricula}</td>
                      <td style={{ padding: "15px", color: "#333", fontWeight: "500" }}>{solicitud.material}</td>
                      <td style={{ padding: "15px", color: "#666" }}>{solicitud.fechaSolicitud}</td>
                      <td style={{ padding: "15px" }}>{renderBadge(solicitud.estado)}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button 
                          style={{ ...btnActionStyle, backgroundColor: "#4682a0" }} 
                          title="Ver Detalles"
                          onClick={() => abrirDetalles(solicitud)}
                        >
                          <FaEye />
                        </button>
                        
                        {solicitud.estado === "Pendiente" && (
                          <>
                            <button 
                              style={{ ...btnActionStyle, backgroundColor: "#07b432" }} 
                              title="Autorizar"
                              onClick={() => abrirAutorizar(solicitud)}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              style={{ ...btnActionStyle, backgroundColor: "#7d0404" }} 
                              title="Denegar"
                              onClick={() => abrirDenegar(solicitud)}
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>

      {/* ===== MODAL: AUTORIZAR ===== */}
      {modalAutorizar && solicitudActiva && (
        <div style={modalOverlayStyle} onClick={() => setModalAutorizar(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#0B1742", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <FaCheckCircle color="#10b981" /> Autorizar Préstamo
            </h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Autorizando <strong>{solicitudActiva.material}</strong> para <strong>{solicitudActiva.alumno}</strong>.
            </p>
            
            <form onSubmit={confirmarAutorizacion}>
              <label style={{ fontWeight: "bold", color: "#333", display: "block" }}>Fecha de Devolución *</label>
              <input 
                type="date" 
                required 
                style={formInputStyle} 
                value={fechaDevolucion}
                onChange={(e) => setFechaDevolucion(e.target.value)}
              />

              <label style={{ fontWeight: "bold", color: "#333", display: "block" }}>Hora de Devolución *</label>
              <input 
                type="time" 
                required 
                style={formInputStyle} 
                value={horaDevolucion}
                onChange={(e) => setHoraDevolucion(e.target.value)}
              />

              <label style={{ fontWeight: "bold", color: "#333", display: "block" }}>Observaciones (Opcional)</label>
              <textarea 
                rows="3" 
                style={{...formInputStyle, resize: "vertical"}} 
                placeholder="Condiciones del material, notas adicionales..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              ></textarea>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setModalAutorizar(false)} style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#e5e7eb", color: "#374151", cursor: "pointer", fontWeight: "bold" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#10b981", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                  Confirmar Aprobación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: DENEGAR ===== */}
      {modalDenegar && solicitudActiva && (
        <div style={modalOverlayStyle} onClick={() => setModalDenegar(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#691C32", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <FaTimesCircle color="#ef4444" /> Denegar Solicitud
            </h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Estás a punto de rechazar la solicitud de <strong>{solicitudActiva.alumno}</strong> por el recurso <strong>{solicitudActiva.material}</strong>.
            </p>
            
            <form onSubmit={confirmarDenegacion}>
              <label style={{ fontWeight: "bold", color: "#333", display: "block" }}>Motivo de Rechazo *</label>
              <textarea 
                rows="4" 
                required 
                style={{...formInputStyle, resize: "vertical", borderColor: "#fca5a5"}} 
                placeholder="Explica al alumno por qué se ha denegado (ej. Multas pendientes, material agotado)..."
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
              ></textarea>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setModalDenegar(false)} style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#e5e7eb", color: "#374151", cursor: "pointer", fontWeight: "bold" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#ef4444", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                  Confirmar Rechazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: DETALLES ===== */}
      {modalDetalles && solicitudActiva && (
        <div style={modalOverlayStyle} onClick={() => setModalDetalles(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ color: "#0B1742", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                <FaInfoCircle color="#0A1F44" /> Detalles de Solicitud
              </h2>
              {renderBadge(solicitudActiva.estado)}
            </div>
            
            <div style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "15px", border: "1px solid #eee" }}>
              <p style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px", color: "#444" }}>
                <FaUserGraduate color="#888" /> <strong>Alumno:</strong> {solicitudActiva.alumno}
              </p>
              <p style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px", color: "#444" }}>
                <FaIdCard color="#888" /> <strong>Matrícula:</strong> {solicitudActiva.matricula}
              </p>
              <p style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px", color: "#444" }}>
                <FaBook color="#888" /> <strong>Recurso:</strong> {solicitudActiva.material}
              </p>
              <p style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px", color: "#444" }}>
                <FaCalendarAlt color="#888" /> <strong>Solicitado el:</strong> {solicitudActiva.fechaSolicitud}
              </p>

              {(solicitudActiva.estado === "Aprobada" || solicitudActiva.estado === "Activo") && (
                <>
                  <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "15px 0" }} />
                  <p style={{ margin: "10px 0", color: "#065F46" }}>
                    <strong>Devolución programada:</strong> {solicitudActiva.fechaDevolucion} a las {solicitudActiva.horaDevolucion}
                  </p>
                  {solicitudActiva.observaciones && (
                    <p style={{ margin: "10px 0", color: "#555", fontStyle: "italic" }}>
                      <strong>Notas:</strong> {solicitudActiva.observaciones}
                    </p>
                  )}
                </>
              )}

              {(solicitudActiva.estado === "Rechazada" || solicitudActiva.estado === "Rechazado") && (
                <>
                  <hr style={{ border: "none", borderTop: "1px solid #ddd", margin: "15px 0" }} />
                  <p style={{ margin: "10px 0", color: "#991B1B" }}>
                    <strong>Motivo del rechazo:</strong> <br/>
                    {solicitudActiva.motivo}
                  </p>
                </>
              )}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button onClick={() => setModalDetalles(false)} style={{ padding: "12px 25px", borderRadius: "10px", border: "none", backgroundColor: "#0A1F44", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                Cerrar Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PrestamosMateriales;