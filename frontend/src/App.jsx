import { Routes, Route } from "react-router-dom";

import Login from "./vistas/Login";

import DashboardAdmin1 from "./vistas/DashboardAdmin1";

import Registro from "./vistas/Registro";

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

    </Routes>
  );
}

export default App;