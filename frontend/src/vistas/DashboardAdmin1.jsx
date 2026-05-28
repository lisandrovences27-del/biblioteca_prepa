import "../App.css";

function DashboardAdmin1() {

  return (

    <div className="dashboard">

      {/* ===== SIDEBAR ===== */}
      <aside className="sidebar">

        {/* Logo */}

        <div>

          <h2 className="logo-dashboard">
            PrestaCetis
          </h2>

          <p className="logo-subtitle">
            Sistema de préstamos
          </p>

        </div>



        {/* Menú */}
        <ul className="menu">

          <li className="active-menu">
            Dashboard
          </li>

          <li>
             Libros
          </li>

          <li>
             Préstamos
          </li>

          <li>
             Alumnos
          </li>

          <li>
             Reportes
          </li>

          <li>
             Configuración
          </li>

        </ul>



        {/* Usuario abajo */}
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



     {/* ===== CONTENIDO ===== */}
<main className="main-content">
  <div style={{ color: "white" }}>
  HOLA DASHBOARD
</div>

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
        🔔
      </div>



      {/* Usuario */}
      <div className="profile-box">

        <div className="profile-circle">
          A
        </div>

      </div>

    </div>

  </div>

</main>
</div>
);
}

export default DashboardAdmin1;