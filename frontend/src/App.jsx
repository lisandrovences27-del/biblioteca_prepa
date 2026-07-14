import { Routes, Route } from "react-router-dom";
import Login from "./vistas/login";
import DashboardAdmin1 from "./vistas/DashboardAdmin1";
import DashboardAlumno from "./vistas/DashboardAlumno";
import DashboardAdmin2 from "./vistas/DashboardAdmin2";
import Registro from "./vistas/registro";
import Libros from "./vistas/Libros";
import Materiales from "./vistas/Materiales";
import Prestamos from "./vistas/prestamos";
import PrestamosMateriales from "./vistas/PrestamosMateriales";
import PrestamosAlumno from "./vistas/PrestamosAlumno";
import ReportesBiblioteca from "./vistas/ReportesBiblioteca";
import LibrosAlumno from "./vistas/LibrosAlumno";
import MaterialesAlumno from "./vistas/MaterialesAlumno";
import PerfilAdmin from "./vistas/PerfilAdmin";
import PerfilAlumno from "./vistas/PerfilAlumno";

function App() {

  return (

    <Routes>

      {/* Ruta login */}
      <Route path="/" element={<Login />}/>
      {/* Ruta dashboard admin */}
     <Route path="/dashboard-admin" element={<DashboardAdmin1 />}/>
     <Route path="/dashboard-admin2"element={<DashboardAdmin2 />}/>
     <Route path="/materiales" element={<Materiales />} />

      {/* Ruta registro */}
      <Route path="/registro" element={<Registro />} />
      {/* Ruta libros */}
      <Route path="/libros" element={<Libros />}/>
      {/* Ruta prestamos */}
      <Route path="/prestamos" element={<Prestamos />}/>
      <Route path="/prestamos-materiales" element={<PrestamosMateriales />}/>
      <Route path="/dashboard-alumno" element={<DashboardAlumno />}/>
      <Route
        path="/mis-prestamos" element={<PrestamosAlumno />}/>
      <Route path="/reportes" element={<ReportesBiblioteca />}/>
      <Route path="/libros-disponibles" element={<LibrosAlumno />}/>

      <Route path="/materiales-disponibles" element={<MaterialesAlumno />}/>
      <Route path="/perfil-admin" element={<PerfilAdmin />}/>
      <Route path="/mi-perfil" element={<PerfilAlumno />}/>
    </Routes>
    

  );
}

export default App;