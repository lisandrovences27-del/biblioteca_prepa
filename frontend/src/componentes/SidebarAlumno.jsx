import {
  FaBook,
  FaBoxOpen,
  FaClipboardList,
  FaHistory,
  FaUser,
  FaHome,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import icono120 from "../assets/icono120.png";

function SidebarAlumno() {

  return (

    <aside className="sidebar">

      <div className="logo-container">

        <img
          src={icono120}
          alt="Logo CETis"
          className="sidebar-logo"
        />

        <h2 className="logo-dashboard">
          PrestaCetis
        </h2>

      </div>

      <ul className="menu">

        <li>
          <NavLink
            to="/dashboard-alumno"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaHome></FaHome> Inicio
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/libros-disponibles"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaBook /> Libros
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/materiales-disponibles"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaBoxOpen /> Materiales
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/mis-prestamos"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaClipboardList /> Mis Préstamos
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/historial"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaHistory /> Historial
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/mi-perfil"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaUser /> Mi Perfil
          </NavLink>
        </li>

      </ul>

      <div className="user-box">

        <div className="user-circle">
          B
        </div>

        <div>

          <h4>
            Alumno
          </h4>

          <p>
            alumno@cetis.edu.mx
          </p>

        </div>

      </div>

    </aside>

  );
}

export default SidebarAlumno;