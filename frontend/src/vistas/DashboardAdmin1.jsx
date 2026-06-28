import "../App.css";
import Sidebar from "../componentes/Sidebar";
import {
  FaBook,
  FaBoxOpen,
  FaUserGraduate,
  FaCheckCircle,
  FaBell,
  FaCog,
  FaChartBar,
  FaClipboardList,
  FaExclamationTriangle,
} from "react-icons/fa";
import LogoutButton from "../componentes/LogoutButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import icono120 from "../assets/icono120.png";
function DashboardAdmin1() {
  const navigate = useNavigate();

  return (

    <div className="dashboard">
      <Sidebar></Sidebar>
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
      Gestiona préstamos, libros y alumnos.
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
        <FaBook />
      </div>

      <div>

        <p className="card-title">
          Libros registrados
        </p>

        <h2>
          120
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
          35
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
          80
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
          215
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

          <th>Libro</th>

          <th>Fecha préstamo</th>

          <th>Fecha devolución</th>

          <th>Estado</th>

        </tr>

      </thead>



      <tbody>

        <tr>

          <td>Juan Pérez</td>

          <td>Matemáticas</td>

          <td>12/05/2025</td>

          <td>19/05/2025</td>

          <td>
            <span className="status active-status">
              Activo
            </span>
          </td>

        </tr>



        <tr>

          <td>María López</td>

          <td>Química General</td>

          <td>10/05/2025</td>

          <td>17/05/2025</td>

          <td>
            <span className="status returned-status">
              Devuelto
            </span>
          </td>

        </tr>



        <tr>

          <td>Carlos Ruiz</td>

          <td>Historia</td>

          <td>08/05/2025</td>

          <td>15/05/2025</td>

          <td>
            <span className="status active-status">
              Activo
            </span>
          </td>

        </tr>

      </tbody>

    </table>

  </div>

</div>
{/* ===== SECCIÓN INFERIOR ===== */}

<div className="bottom-section">

  {/* ===== GRÁFICA ===== */}
  <div className="chart-box">

    <h2>
      Estadísticas
    </h2>

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

    <h2>
      Actividad reciente
    </h2>

    <ul>

      <li>
        📚 Nuevo libro agregado
      </li>

      <li>
        👨‍🎓 Alumno registrado
      </li>

      <li>
        📦 Préstamo realizado
      </li>

      <li>
        ✅ Libro devuelto
      </li>

    </ul>

  </div>

</div>

    
      {/* ===== FIN DE LA PÁGINA ===== */}
</main>
</div>
);
}

export default DashboardAdmin1;