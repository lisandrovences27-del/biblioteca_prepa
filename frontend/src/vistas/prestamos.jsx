import "../App.css";
import Sidebar from "../componentes/Sidebar";
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
  FaInfoCircle
} from "react-icons/fa";
import { useState } from "react";

// Mock Data Inicial
const solicitudesPrueba = [
  { 
    id: 1, 
    alumno: "Juan Pérez", 
    matricula: "22308001", 
    libro: "Matemáticas I", 
    fechaSolicitud: "2026-06-15", 
    estado: "Pendiente" 
  },
  { 
    id: 2, 
    alumno: "María López", 
    matricula: "22308002", 
    libro: "Física General", 
    fechaSolicitud: "2026-06-14", 
    estado: "Aprobada",
    fechaDevolucion: "2026-06-21",
    horaDevolucion: "14:00"
  },
  { 
    id: 3, 
    alumno: "Carlos Ramírez", 
    matricula: "22308003", 
    libro: "Química Básica", 
    fechaSolicitud: "2026-06-16", 
    estado: "Rechazada",
    motivo: "El alumno tiene multas pendientes."
  },
  { 
    id: 4, 
    alumno: "Ana Gómez", 
    matricula: "22308004", 
    libro: "Biología", 
    fechaSolicitud: "2026-06-16", 
    estado: "Pendiente" 
  },
  { 
    id: 5, 
    alumno: "Luis Martínez", 
    matricula: "22308005", 
    libro: "Calculadora Científica", 
    fechaSolicitud: "2026-06-16", 
    estado: "Pendiente" 
  }
];

function Prestamos() {
  const [solicitudes, setSolicitudes] = useState(solicitudesPrueba);
  const [busqueda, setBusqueda] = useState("");
  
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
  const confirmarAutorizacion = (e) => {
    e.preventDefault();
    if (!fechaDevolucion || !horaDevolucion) {
      alert("La fecha y hora de devolución son obligatorias.");
      return;
    }
    const nuevas = solicitudes.map(s => 
      s.id === solicitudActiva.id 
        ? { ...s, estado: "Aprobada", fechaDevolucion, horaDevolucion, observaciones } 
        : s
    );
    setSolicitudes(nuevas);
    setModalAutorizar(false);
  };

  const confirmarDenegacion = (e) => {
    e.preventDefault();
    if (!motivoRechazo) {
      alert("Debes indicar el motivo del rechazo.");
      return;
    }
    const nuevas = solicitudes.map(s => 
      s.id === solicitudActiva.id 
        ? { ...s, estado: "Rechazada", motivo: motivoRechazo } 
        : s
    );
    setSolicitudes(nuevas);
    setModalDenegar(false);
  };

  // Estadísticas
  const pendientes = solicitudes.filter(s => s.estado === "Pendiente").length;
  const aprobadas = solicitudes.filter(s => s.estado === "Aprobada").length;
  const rechazadas = solicitudes.filter(s => s.estado === "Rechazada").length;

  // Filtrado
  const solicitudesFiltradas = solicitudes.filter(s => 
    s.alumno.toLowerCase().includes(busqueda.toLowerCase()) || 
    s.matricula.includes(busqueda) ||
    s.libro.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Helper para Badges Visuales
  const renderBadge = (estado) => {
    if (estado === "Pendiente") return (
      <span style={{backgroundColor: "#FDE68A", color: "#92400E", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px"}}>
        <FaClock/> {estado}
      </span>
    );
    if (estado === "Aprobada") return (
      <span style={{backgroundColor: "#D1FAE5", color: "#065F46", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px"}}>
        <FaCheckCircle/> {estado}
      </span>
    );
    if (estado === "Rechazada") return (
      <span style={{backgroundColor: "#FEE2E2", color: "#991B1B", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px"}}>
        <FaTimesCircle/> {estado}
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
      <Sidebar />

      <main className="main-content">
        {/* ===== TOPBAR ===== */}
        <div className="topbar">
          <div>
            <h1>Gestión de Solicitudes</h1>
            <p>Administra, autoriza o deniega los préstamos solicitados por los alumnos.</p>
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
              <FaBook /> Lista de Solicitudes
            </h2>
            
            {/* Buscador Integrado */}
            <div style={{ position: "relative", width: "300px" }}>
              <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
              <input
                type="text"
                placeholder="Buscar alumno, matrícula o libro..."
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
                    <th style={{ padding: "15px", borderBottom: "2px solid #eee" }}>Libro / Material</th>
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
                      <td style={{ padding: "15px", color: "#333", fontWeight: "500" }}>{solicitud.libro}</td>
                      <td style={{ padding: "15px", color: "#666" }}>{solicitud.fechaSolicitud}</td>
                      <td style={{ padding: "15px" }}>{renderBadge(solicitud.estado)}</td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <button 
                          style={{ ...btnActionStyle, backgroundColor: "#0284c7" }} 
                          title="Ver Detalles"
                          onClick={() => abrirDetalles(solicitud)}
                        >
                          <FaEye />
                        </button>
                        
                        {solicitud.estado === "Pendiente" && (
                          <>
                            <button 
                              style={{ ...btnActionStyle, backgroundColor: "#10b981" }} 
                              title="Autorizar"
                              onClick={() => abrirAutorizar(solicitud)}
                            >
                              <FaCheck />
                            </button>
                            <button 
                              style={{ ...btnActionStyle, backgroundColor: "#ef4444" }} 
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
              Autorizando <strong>{solicitudActiva.libro}</strong> para <strong>{solicitudActiva.alumno}</strong>.
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
                placeholder="Condiciones del libro, notas adicionales..."
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
              Estás a punto de rechazar la solicitud de <strong>{solicitudActiva.alumno}</strong> por el recurso <strong>{solicitudActiva.libro}</strong>.
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
                <FaBook color="#888" /> <strong>Recurso:</strong> {solicitudActiva.libro}
              </p>
              <p style={{ margin: "10px 0", display: "flex", alignItems: "center", gap: "10px", color: "#444" }}>
                <FaCalendarAlt color="#888" /> <strong>Solicitado el:</strong> {solicitudActiva.fechaSolicitud}
              </p>

              {solicitudActiva.estado === "Aprobada" && (
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

              {solicitudActiva.estado === "Rechazada" && (
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

export default Prestamos;