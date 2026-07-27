import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  const userRole = Number(user.id_rol);

  // Si se pasaron roles permitidos y el usuario no tiene ninguno de esos roles, redirigir
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.log("Acceso denegado. Rol del usuario:", userRole, "Roles permitidos:", allowedRoles);
    
    // Redirigir a su dashboard correspondiente según su rol
    if (userRole === 3) {
      return <Navigate to="/dashboard-alumno" replace />;
    } else if (userRole === 2) {
      return <Navigate to="/dashboard-admin2" replace />;
    } else {
      return <Navigate to="/dashboard-admin" replace />;
    }
  }

  // Si está autenticado y tiene permiso, renderizar la ruta
  return children;
}

export default ProtectedRoute;
