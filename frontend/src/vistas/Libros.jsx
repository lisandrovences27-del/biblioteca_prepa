import "../App.css";
import Sidebar from "../componentes/Sidebar";

function Libros() {

  return (

    <div className="dashboard">

      <Sidebar></Sidebar>

      <main className="main-content">

        <div className="topbar">

          <div>

            <h1>
              Gestión de Libros
            </h1>

            <p>
              Administra el catálogo de libros del sistema.
            </p>

          </div>

        </div>

      </main>

    </div>

  );
}

export default Libros;