import { Routes, Route } from "react-router-dom";

import Login from "./vistas/Login";

import DashboardAdmin1 from "./vistas/DashboardAdmin1";

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

    </Routes>
  );
}

export default App;