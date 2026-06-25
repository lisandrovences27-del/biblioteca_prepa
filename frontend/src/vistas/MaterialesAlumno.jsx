import SidebarAlumno from "../componentes/SidebarAlumno";

function MaterialesAlumno() {
  return (
    <div className="dashboard">
      <SidebarAlumno />

      <main className="main-content">
        <h1>Materiales Disponibles</h1>
        <p>Aquí se mostrarán los materiales disponibles para préstamo.</p>
      </main>
    </div>
  );
}

export default MaterialesAlumno;