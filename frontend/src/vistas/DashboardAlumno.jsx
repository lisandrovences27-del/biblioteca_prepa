import "../App.css";
import SidebarAlumno from "../componentes/SidebarAlumno";
import Accesibilidad from "../componentes/Accesibilidad";
import LogoutButton from "../componentes/LogoutButton";
import {
  FaBook,
  FaBoxOpen,
  FaUserGraduate,
  FaCheckCircle,
  FaBell,
  FaCog,
  FaChartBar,
  FaClipboardList,
  FaNotEqual,
  FaHome,
  FaBox,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import icono120 from "../assets/icono120.png";

function DashboardAlumno() {
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    const fetchMisPrestamos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/prestamos/mis-prestamos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setPrestamos(data);
        }
      } catch (error) {
        console.error("Error al obtener mis préstamos", error);
      }
    };
    fetchMisPrestamos();
  }, []);

  return (

    <div className="dashboard">
      <SidebarAlumno></SidebarAlumno>
     {/* ===== CONTENIDO ===== */}
<main className="main-content">
  

  {/* ===== TOPBAR ===== */}
<div className="topbar">

  {/* Parte izquierda */}
  <div>

    <h1>
      Bienvenido, Alumn@!!
    </h1>

    <p>
      Consulta libros, materiales y el estado de tus préstamos.
    </p>

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

    <LogoutButton />

    {/* Usuario */}
    <div className="profile-box">

      <div className="profile-circle">
        A
      </div>

    </div>

  </div>

</div>
    {/* ===== CARDS ===== */}
<div className="cards-container">

  <div className="dashboard-card red-card">
    <div className="card-left">
      <div className="card-icon-circle">
        <FaBook />
      </div>
      <div>
        <p className="card-title">
          Libros disponibles
        </p>
        <span className="card-info">
          Consulta el catálogo de libros.
        </span>
      </div>
    </div>
  </div>
  
  <div className="dashboard-card blue-card">
    <div className="card-left">
      <div className="card-icon-circle">
        <FaBoxOpen />
      </div>
      <div>
        <p className="card-title">
          Materiales Disponibles
        </p>
        <span className="card-info">
          Revisa los materiales que puedes solicitar.
        </span>
      </div>
    </div>
  </div>

<div className="dashboard-card beige-card">
    <div className="card-left">
      <div className="card-icon-circle">
        <FaBoxOpen />
      </div>
      <div>
        <p className="card-title">
          Mis Préstamos
        </p>
        <span className="card-info">
          Consulta tus préstamos activos.
        </span>
      </div>
    </div>
  </div>

</div>

{/* ===== TABLA ===== */}

<div className="table-section">

  {/* Header tabla */}
  <div className="table-header">

    <h2>
      Mis préstamos
    </h2>

    <button className="view-btn">
      Ver todos
    </button>

  </div>



  {/* Tabla */}
  <div className="table-container">

    <table>
      <thead>
        <tr>
          <th>Recurso</th>
          <th>Fecha préstamo</th>
          <th>Fecha devolución</th>
          <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        {prestamos.length > 0 ? prestamos.map((p, index) => (
          <tr key={index}>
            <td>{p.material}</td>
            <td>{new Date(p.fecha_solicitud).toLocaleDateString("es-ES")}</td>
            <td>{p.fecha_devolucion_esperada ? new Date(p.fecha_devolucion_esperada).toLocaleDateString("es-ES") : "N/A"}</td>
            <td>
              <span className={`status ${p.estado === 'Activo' ? 'active-status' : p.estado === 'Devuelto' ? 'returned-status' : ''}`}>
                {p.estado}
              </span>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No tienes préstamos registrados</td>
          </tr>
        )}
      </tbody>

    </table>

  </div>

</div>
{/* ===== SECCIÓN INFERIOR ===== */}

<div className="bottom-section">

  {/* ===== ACTIVIDAD ===== */}
  <div className="activity-box">

    <h2> Notificaciones </h2>

    <ul>

      <li>
        <FaBook></FaBook> Tu solicitud de Física I fue aprobada
      </li>

      <li>
        📦 Solicitaste una Calculadora Científica
      </li>

      <li>
        ⏰ Tienes un préstamo próximo a vencer
      </li>

      <li>
         ✅ Devolución registrada correctamente
      </li>

    </ul>

  </div>

</div>

    
</main>
<Accesibilidad/>
</div>
);
}

export default DashboardAlumno;