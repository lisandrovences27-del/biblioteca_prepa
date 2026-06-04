import "../App.css";
import Sidebar from "../componentes/Sidebar";

function prestamos() {

  return (

    <div className="dashboard">

      <Sidebar></Sidebar>

      <main className="main-content">

        <div className="topbar">

          <div>

            <h1>
              Gestión de prestamos
            </h1>

            <p>
              Administracion de prestamos realizados.
            </p>

          </div>

        </div>

      </main>

    </div>

  );
}

export default prestamos;