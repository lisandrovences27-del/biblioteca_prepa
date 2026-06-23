import "../App.css";
import Sidebar from "../componentes/Sidebar";
import {
  FaBoxOpen,
  FaUserGraduate,
  FaCheckCircle,
  FaBell,
  FaCog,
  FaChartBar,
  FaClipboardList,
  FaBox,
  FaSignOutAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import icono120 from "../assets/icono120.png";
import { useState } from "react";
function DashboardAdmin2() {
  const navigate = useNavigate();
  const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };


  return (
    <div className="dashboard">
      <Sidebar></Sidebar>
      {/* ===== CONTENIDO ===== */}
      <main className="main-content">
        
        {/* ===== TOPBAR ===== */}
        <div className="topbar">
          {/* Parte izquierda */}
          <div>
            <h1>Bienvenido, Encargad@</h1>
            <p>Gestiona materiales, préstamos y disponibilidad de recursos.</p>
          </div>

          {/* Parte derecha */}
          <div className="topbar-right">
            {/* Buscador */}
            <input
              type="text"
              placeholder="Buscar..."
              className="search-input"
            />

            {/* Notificación */}
            <div className="icon-box">
              <FaBell />
            </div>

         {/* Cerrar Sesión */}
    <div className="icon-box" onClick={() => setModalLogoutAbierto(true)} title="Cerrar sesión" style={{ backgroundColor: "#991B1B", cursor: "pointer" }}>
      <FaSignOutAlt style={{ pointerEvents: "none" }} />
    </div>

            {/* Usuario */}
            <div className="profile-box">
              <div className="profile-circle">
                E
              </div>
            </div>
          </div>
        </div>

        {/* ===== CARDS ===== */}
        <div className="cards-container">
          
          {/* ===== CARD 1 ===== */}
          <div className="dashboard-card red-card">
            <div className="card-left">
              <div className="card-icon-circle">
                <FaBox />
              </div>
              <div>
                <p className="card-title">Materiales registrados</p>
                <h2>145</h2>
                <span className="card-info">+12 este mes ↑</span>
              </div>
            </div>
          </div>

          {/* ===== CARD 2 ===== */}
          <div className="dashboard-card wine-card">
            <div className="card-left">
              <div className="card-icon-circle">
                <FaClipboardList />
              </div>
              <div>
                <p className="card-title">Materiales prestados</p>
                <h2>42</h2>
                <span className="card-info">+8 este mes ↑</span>
              </div>
            </div>
          </div>

          {/* ===== CARD 3 ===== */}
          <div className="dashboard-card blue-card">
            <div className="card-left">
              <div className="card-icon-circle">
                <FaCheckCircle />
              </div>
              <div>
                <p className="card-title">Materiales disponibles</p>
                <h2>98</h2>
                <span className="card-info">Listos para préstamo</span>
              </div>
            </div>
          </div>

          {/* ===== CARD 4 ===== */}
          <div className="dashboard-card beige-card">
            <div className="card-left">
              <div className="card-icon-circle">
                <FaBell />
              </div>
              <div>
                <p className="card-title">Solicitudes pendientes</p>
                <h2>5</h2>
                <span className="card-info">Requieren atención</span>
              </div>
            </div>
          </div>

        </div>

        {/* ===== TABLA ===== */}
        <div className="table-section">
          {/* Header tabla */}
          <div className="table-header">
            <h2>Últimos préstamos de materiales</h2>
            <button className="view-btn">Ver todos</button>
          </div>

          {/* Tabla */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Material</th>
                  <th style={{ textAlign: "left" }}>Categoría</th>
                  <th style={{ textAlign: "left" }}>Responsable</th>
                  <th style={{ textAlign: "left" }}>Fecha préstamo</th>
                  <th style={{ textAlign: "left" }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Proyector EPSON</td>
                  <td>Audiovisual</td>
                  <td>Juan Pérez</td>
                  <td>12/05/2026</td>
                  <td>
                    <span className="status active-status" style={{ backgroundColor: "#FEF08A", color: "#854D0E", fontWeight: "bold" }}>
                      Prestado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Calculadora Científica Casio</td>
                  <td>Electrónica</td>
                  <td>María López</td>
                  <td>-</td>
                  <td>
                    <span className="status returned-status" style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontWeight: "bold" }}>
                      Disponible
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Cable HDMI 3m</td>
                  <td>Accesorios</td>
                  <td>Prof. Carlos Ruiz</td>
                  <td>10/05/2026</td>
                  <td>
                    <span className="status active-status" style={{ backgroundColor: "#FEE2E2", color: "#991B1B", fontWeight: "bold" }}>
                      Mantenimiento
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Laptop HP</td>
                  <td>Cómputo</td>
                  <td>Ana Gómez</td>
                  <td>15/05/2026</td>
                  <td>
                    <span className="status active-status" style={{ backgroundColor: "#E0F2FE", color: "#0369A1", fontWeight: "bold" }}>
                      Pendiente
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== SECCIÓN INFERIOR ===== */}
        <div className="bottom-section">
          
          {/* ===== GRÁFICA / ESTADÍSTICAS ===== */}
          <div className="chart-box">
            <h2>Estadísticas</h2>
            <div className="fake-chart">
              <div className="bar bar1"></div>
              <div className="bar bar2"></div>
              <div className="bar bar3"></div>
              <div className="bar bar4"></div>
              <div className="bar bar5"></div>
            </div>
          </div>

          {/* ===== ACTIVIDAD ===== */}
          <div className="activity-box">
            <h2>Actividad reciente</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px", color: "#555" }}>
                <div style={{ backgroundColor: "#f0f4f8", padding: "10px", borderRadius: "50%", display: "flex" }}><FaBox color="#0B1742"/></div>
                <span>Proyector EPSON prestado</span>
              </li>
              <li style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px", color: "#555" }}>
                <div style={{ backgroundColor: "#ecfdf5", padding: "10px", borderRadius: "50%", display: "flex" }}><FaCheckCircle color="#065F46"/></div>
                <span>2 Calculadoras devueltas</span>
              </li>
              <li style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px", color: "#555" }}>
                <div style={{ backgroundColor: "#fffbeb", padding: "10px", borderRadius: "50%", display: "flex" }}><FaBell color="#D97706"/></div>
                <span>Nueva solicitud de Cable HDMI recibida</span>
              </li>
              <li style={{ margin: "15px 0", display: "flex", alignItems: "center", gap: "10px", color: "#555" }}>
                <div style={{ backgroundColor: "#fef2f2", padding: "10px", borderRadius: "50%", display: "flex" }}><FaCog color="#991B1B"/></div>
                <span>Laptop HP enviada a mantenimiento</span>
              </li>
            </ul>
          </div>

        </div>
      {/* ===== MODAL DE CIERRE DE SESIÓN ===== */}
      {modalLogoutAbierto && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(11, 23, 66, 0.7)", backdropFilter: "blur(5px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }} onClick={() => setModalLogoutAbierto(false)}>
          <div style={{
            backgroundColor: "white", borderRadius: "20px", padding: "30px",
            width: "90%", maxWidth: "400px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            textAlign: "center", animation: "fadeIn 0.3s ease"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              width: "80px", height: "80px", borderRadius: "50%", 
              backgroundColor: "#fca5a5", display: "flex", justifyContent: "center", 
              alignItems: "center", margin: "0 auto 20px auto" 
            }}>
              <FaExclamationTriangle size={40} color="#991B1B" />
            </div>
            <h2 style={{ color: "#0B1742", margin: "0 0 10px 0", fontSize: "24px" }}>Cerrar sesión</h2>
            <p style={{ color: "#666", marginBottom: "30px", fontSize: "16px" }}>
              ¿Estás seguro de que deseas salir del sistema?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button 
                onClick={() => setModalLogoutAbierto(false)} 
                style={{ 
                  padding: "12px 24px", borderRadius: "10px", border: "none", 
                  backgroundColor: "#e5e7eb", color: "#374151", cursor: "pointer", 
                  fontWeight: "bold", flex: 1, fontSize: "16px", transition: "0.2s" 
                }}>
                Cancelar
              </button>
              <button 
                onClick={handleLogout} 
                style={{ 
                  padding: "12px 24px", borderRadius: "10px", border: "none", 
                  backgroundColor: "#991B1B", color: "white", cursor: "pointer", 
                  fontWeight: "bold", flex: 1, fontSize: "16px", transition: "0.2s" 
                }}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}

      </main>
      
    </div>
  
);
}

export default DashboardAdmin2;