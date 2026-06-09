import "../App.css";
import Sidebar from "../componentes/Sidebar";

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
        </div>
      </main>
    </div>
  );
}

export default Alumnos;