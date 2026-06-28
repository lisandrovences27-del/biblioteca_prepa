import "../App.css";
import Sidebar from "../componentes/Sidebar";
import LogoutButton from "../componentes/LogoutButton";

function Alumnos() {
  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Alumnos</h1>
            <p>Actividad de alumnos</p>
          </div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
            <LogoutButton />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Alumnos;