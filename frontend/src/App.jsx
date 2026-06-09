import { Routes, Route } from "react-router-dom";
import Login from "./vistas/Login";
import DashboardAdmin1 from "./vistas/DashboardAdmin1";
import Registro from "./vistas/Registro";
import Libros from "./vistas/Libros";
import Prestamos from "./vistas/Prestamos";

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
      
      

    </Routes>
  );
}

export default App;