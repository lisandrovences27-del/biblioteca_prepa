import {
  FaHome,
  FaBoxOpen,
  FaClipboardList,
  FaChartBar,
  FaUserCircle,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";
import icono120 from "../assets/icono120.png";

function SidebarMateriales() {
  return (
    <aside className="sidebar">

      {/* Logo */}
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

      {/* Menú */}
      <ul className="menu">

        <li>
          <NavLink
            to="/dashboard-admin2"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaHome /> Inicio
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/materiales"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaBoxOpen /> Materiales
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/prestamos-materiales"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaClipboardList /> Préstamos
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/reportes-materiales"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaChartBar /> Reportes
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/perfil-admin2"
            className={({ isActive }) =>
              isActive ? "active-menu" : ""
            }
          >
            <FaUserCircle /> Mi Perfil
          </NavLink>
        </li>

      </ul>

      {/* Usuario */}
      <div className="user-box">

        <div className="user-circle">
          M
        </div>

        <div>
          <h4>Administrador Materiales</h4>
          <p>materiales@cetis.edu.mx</p>
        </div>

      </div>

    </aside>
  );
}

export default SidebarMateriales;