import {
  FaBook,
  FaUserGraduate,
  FaCog,
  FaChartBar,
  FaClipboardList,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import icono120 from "../assets/icono120.png";

function Sidebar() {

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
          <NavLink to="/dashboard-admin"
          className={({ isActive }) =>
      isActive ? "active-menu" : ""
    }
    >
            Inicio
          </NavLink>
        </li>

        <li>
          <NavLink to="/libros"
          className={({ isActive }) =>
      isActive ? "active-menu" : ""
    }
          >
            <FaBook /> Libros
          </NavLink>
        </li>

        <li>
          <NavLink to="/prestamos"
          className={({ isActive }) =>
      isActive ? "active-menu" : ""
    }
    >
            <FaClipboardList /> Préstamos
          </NavLink>
        </li>

        <li>
          <NavLink to="/reportes"
          className={({ isActive }) =>
      isActive ? "active-menu" : ""
    }
    >
            <FaChartBar /> Reportes
          </NavLink>
        </li>

        <li>
          <NavLink to="/configuracion"
          className={({ isActive }) =>
      isActive ? "active-menu" : ""
    }
    
    >
            <FaCog /> Configuración
          </NavLink>
        </li>

      </ul>

      {/* Usuario */}
      <div className="user-box">

        <div className="user-circle">
          A
        </div>

        <div>

          <h4>
            Administrador
          </h4>

          <p>
            admin@cetis.edu.mx
          </p>

        </div>

      </div>

    </aside>

  );
}

export default Sidebar;