import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./componentes/ProtectedRoute";
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
import PerfilAdmin2 from "./vistas/PerfilAdmin2";
import ReportesMateriales from "./vistas/ReportesMateriales";
import Sanciones from "./vistas/Sanciones";
import ForgotPassword from "./vistas/ForgotPassword";
import ResetPassword from "./vistas/ResetPassword";

function App() {

  return (

    <Routes>

      {/* Ruta login (pública) */}
      <Route path="/" element={<Login />} />
      {/* Ruta registro (pública) */}
      <Route path="/registro" element={<Registro />} />
      {/* Rutas de recuperación de contraseña (públicas) */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ===== RUTAS DE ADMINISTRADOR (Roles 1 y 2) ===== */}
      <Route path="/dashboard-admin" element={<ProtectedRoute allowedRoles={[1]}><DashboardAdmin1 /></ProtectedRoute>} />
      <Route path="/dashboard-admin2" element={<ProtectedRoute allowedRoles={[2]}><DashboardAdmin2 /></ProtectedRoute>} />
      <Route path="/materiales" element={<ProtectedRoute allowedRoles={[1, 2]}><Materiales /></ProtectedRoute>} />
      <Route path="/libros" element={<ProtectedRoute allowedRoles={[1, 2]}><Libros /></ProtectedRoute>} />
      <Route path="/prestamos" element={<ProtectedRoute allowedRoles={[1, 2]}><Prestamos /></ProtectedRoute>} />
      <Route path="/prestamos-materiales" element={<ProtectedRoute allowedRoles={[1, 2]}><PrestamosMateriales /></ProtectedRoute>} />
      <Route path="/sanciones" element={<ProtectedRoute allowedRoles={[1, 2]}><Sanciones /></ProtectedRoute>} />
      <Route path="/reportes" element={<ProtectedRoute allowedRoles={[1, 2]}><ReportesBiblioteca /></ProtectedRoute>} />
      <Route path="/reportes-materiales" element={<ProtectedRoute allowedRoles={[1, 2]}><ReportesMateriales /></ProtectedRoute>} />
      <Route path="/perfil-admin" element={<ProtectedRoute allowedRoles={[1]}><PerfilAdmin /></ProtectedRoute>} />
      <Route path="/perfil-admin2" element={<ProtectedRoute allowedRoles={[2]}><PerfilAdmin2 /></ProtectedRoute>} />

      {/* ===== RUTAS DE ALUMNO (Rol 3) ===== */}
      <Route path="/dashboard-alumno" element={<ProtectedRoute allowedRoles={[3]}><DashboardAlumno /></ProtectedRoute>} />
      <Route path="/mis-prestamos" element={<ProtectedRoute allowedRoles={[3]}><PrestamosAlumno /></ProtectedRoute>} />
      <Route path="/libros-disponibles" element={<ProtectedRoute allowedRoles={[3]}><LibrosAlumno /></ProtectedRoute>} />
      <Route path="/materiales-disponibles" element={<ProtectedRoute allowedRoles={[3]}><MaterialesAlumno /></ProtectedRoute>} />
      <Route path="/mi-perfil" element={<ProtectedRoute allowedRoles={[3]}><PerfilAlumno /></ProtectedRoute>} />

    </Routes>


  );
}

export default App;
