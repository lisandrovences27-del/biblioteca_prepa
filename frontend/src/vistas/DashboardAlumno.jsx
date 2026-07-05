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
import icono120 from "../assets/icono120.png";
function DashboardAlumno() {

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
        <tr>
          <td>Fisica I</td>
          <td>12/05/2025</td>
          <td>19/05/2025</td>
          <td>
            <span className="status active-status">
              Activo
            </span>
          </td>
        </tr>

        <tr>
          <td>Calculadora Científica</td>
          <td>10/05/2025</td>
          <td>17/05/2025</td>
          <td>
            <span className="status returned-status">
              Devuelto
            </span>
          </td>
        </tr>
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