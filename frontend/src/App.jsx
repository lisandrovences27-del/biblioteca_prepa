import { Routes, Route } from "react-router-dom";
import Login from "./vistas/login";
import DashboardAdmin1 from "./vistas/DashboardAdmin1";
import DashboardAlumno from "./vistas/DashboardAlumno";
import DashboardAdmin2 from "./vistas/DashboardAdmin2";
import Registro from "./vistas/registro";
import Libros from "./vistas/Libros";
import Prestamos from "./vistas/prestamos";
import PrestamosAlumno from "./vistas/PrestamosAlumno";
import ReportesBiblioteca from "./vistas/ReportesBiblioteca";
import LibrosAlumno from "./vistas/LibrosAlumno";
import MaterialesAlumno from "./vistas/MaterialesAlumno";

function App() {

  return (

    <Routes>

      {/* Ruta login */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* Ruta dashboard admin */}
      <Route
        path="/dashboard-admin"
        element={<DashboardAdmin1 />}
      />
      <Route
        path="/dashboard-admin2"
        element={<DashboardAdmin2 />}
      />


      {/* Ruta registro */}
      <Route
        path="/registro"
        element={<Registro />}
      />
      {/* Ruta libros */}
      <Route
        path="/libros"
        element={<Libros />}
      />
      {/* Ruta prestamos */}
      <Route
        path="/prestamos"
        element={<Prestamos />}
      />
      <Route
        path="/dashboard-alumno"
        element={<DashboardAlumno />}
      />
      <Route
        path="/mis-prestamos"
        element={<PrestamosAlumno />}
      />
      <Route
        path="/reportes"
        element={<ReportesBiblioteca />}
      />
      <Route
        path="/libros-disponibles"
        element={<LibrosAlumno />}
      />

      <Route
        path="/materiales-disponibles"
        element={<MaterialesAlumno />}
      />
    </Routes>
    

  );
}

export default App;