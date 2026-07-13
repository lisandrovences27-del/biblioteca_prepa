import "../App.css";
import SidebarMateriales from "../componentes/SidebarMateriales";
import Accesibilidad from "../componentes/Accesibilidad";
import {
  FaBook,
  FaBoxOpen,
  FaUserGraduate,
  FaCheckCircle,
  FaBell,
  FaCog,
  FaChartBar,
  FaClipboardList,
  FaBox,
} from "react-icons/fa";
import LogoutButton from "../componentes/LogoutButton";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import icono120 from "../assets/icono120.png";

function DashboardAdmin2() {
  const [prestamos, setPrestamos] = useState([]);
  const [stats, setStats] = useState({
    materiales: 120,
    activos: 0,
    alumnos: 80,
    devueltos: 0
  });

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const resPrestamos = await fetch("http://localhost:3000/api/prestamos/todos", { headers });
        const dataPrestamos = await resPrestamos.json();
        
        if (Array.isArray(dataPrestamos)) {
          setPrestamos(dataPrestamos.slice(0, 5));
          
          const activos = dataPrestamos.filter(p => p.estado === "Activo").length;
          const devueltos = dataPrestamos.filter(p => p.estado === "Devuelto").length;
          setStats(prev => ({ ...prev, activos, devueltos }));
        }

        const resMateriales = await fetch("http://localhost:3000/api/materiales", { headers });
        const dataMateriales = await resMateriales.json();
        if (Array.isArray(dataMateriales)) {
          setStats(prev => ({ ...prev, materiales: dataMateriales.length }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchDatos();
  }, []);

  return (

    <div className="dashboard">
      <SidebarMateriales></SidebarMateriales>
     {/* ===== CONTENIDO ===== */}
<main className="main-content">
  

  {/* ===== TOPBAR ===== */}
<div className="topbar">

  {/* Parte izquierda */}
  <div>

    <h1>
      Bienvenido, Administrador!!
    </h1>

    <p>
      Gestiona préstamos, materiales disponibles y alumnos.
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

    {/* Cerrar Sesión */}
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

  {/* ===== CARD 1 ===== */}
  <div className="dashboard-card red-card">

    <div className="card-left">

      <div className="card-icon-circle">
        <FaBox />
      </div>

      <div>

        <p className="card-title">
          Materiales registrados
        </p>

        <h2>
          {stats.materiales}
        </h2>

        <span className="card-info">
          +8 este mes ↑
        </span>

      </div>

    </div>

  </div>



  {/* ===== CARD 2 ===== */}
  <div className="dashboard-card wine-card">

    <div className="card-left">

      <div className="card-icon-circle">
        <FaBoxOpen />
      </div>

      <div>

        <p className="card-title">
          Préstamos activos
        </p>

        <h2>
          {stats.activos}
        </h2>

        <span className="card-info">
          +5 este mes ↑
        </span>

      </div>

    </div>

  </div>



  {/* ===== CARD 3 ===== */}
  <div className="dashboard-card blue-card">

    <div className="card-left">

      <div className="card-icon-circle">
        <FaUserGraduate />
      </div>

      <div>

        <p className="card-title">
          Alumnos registrados
        </p>

        <h2>
          {stats.alumnos}
        </h2>

        <span className="card-info">
          +12 este mes ↑
        </span>

      </div>

    </div>

  </div>



  {/* ===== CARD 4 ===== */}
  <div className="dashboard-card beige-card">

    <div className="card-left">

      <div className="card-icon-circle">
        <FaCheckCircle />
      </div>

      <div>

        <p className="card-title">
          Préstamos devueltos
        </p>

        <h2>
          {stats.devueltos}
        </h2>

        <span className="card-info">
          +20 este mes ↑
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
      Últimos préstamos
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

          <th>Alumno</th>

          <th>Material</th>

          <th>Fecha préstamo</th>

          <th>Fecha devolución</th>

          <th>Estado</th>

        </tr>

      </thead>



      <tbody>
        {prestamos.length > 0 ? prestamos.map((p, index) => (
          <tr key={index}>
            <td>{p.alumno}</td>
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
            <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>No hay préstamos recientes</td>
          </tr>
        )}
      </tbody>

    </table>

  </div>

</div>
{/* ===== SECCIÓN INFERIOR ===== */}

<div className="bottom-section">

  {/* ===== GRÁFICA ===== */}


  {/* ===== ACTIVIDAD ===== */}
  <div className="activity-box">

    <h2>
      Actividad reciente
    </h2>

    <ul>

      <li>
        <FaBook/> Nuevo libro agregado
      </li>

      <li>
        <FaUserGraduate/> Alumno registrado
      </li>

      <li>
        <FaBox/> Préstamo realizado
      </li>

      <li>
        <FaCheckCircle/> Libro devuelto
      </li>

    </ul>

  </div>

</div>

    
</main>
<Accesibilidad/>
</div>
);
}

export default DashboardAdmin2;