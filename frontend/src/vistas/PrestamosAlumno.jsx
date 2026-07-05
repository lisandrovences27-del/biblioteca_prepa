import "../App.css";
import SidebarAlumno from "../componentes/SidebarAlumno";
import LogoutButton from "../componentes/LogoutButton";
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaBoxOpen,
  FaExclamationTriangle,
  FaUserGraduate,
} from "react-icons/fa";
import { useState, useEffect } from "react";

function PrestamosAlumno() {

  const [numeroControl, setNumeroControl] = useState("");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const usuarioPrueba = {
  numeroControl: "22308001",
  nombre: "Juan Pérez"
};

localStorage.setItem(
  "usuario",
  JSON.stringify(usuarioPrueba)
);
  useEffect(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    setNumeroControl(usuario.numeroControl);
    setNombreAlumno(usuario.nombre);
  }
}, []);
  const [libroSeleccionado, setLibroSeleccionado] = useState("");
  const [recursos, setRecursos] = useState([]);
  const [fechaPrestamo, setFechaPrestamo] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [busquedaLibro, setBusquedaLibro] = useState("");
const recursosPrueba = [
  { nombre: "Matemáticas I", tipo: "Libro" },
  { nombre: "Física General", tipo: "Libro" },
  { nombre: "Química Básica", tipo: "Libro" },
  { nombre: "Biología", tipo: "Libro" },

  { nombre: "Proyector", tipo: "Material" },
  { nombre: "Guillotina", tipo: "Material" },
  { nombre: "Calculadora Científica", tipo: "Material" },
  { nombre: "Cable HDMI", tipo: "Material" }
];
const resultados = recursosPrueba.filter(
  (recurso) =>
    recurso.nombre
      .toLowerCase()
      .includes(busquedaLibro.toLowerCase())
);
const agregarLibro = (recurso) => {

  if (
    recursos.some(
      item => item.nombre === recurso.nombre
    )
  ) return;

  setRecursos([
    ...recursos,
    recurso
  ]);

  setBusquedaLibro("");
};
const eliminarLibro = (index) => {

 setRecursos(
  recursos.filter((_, i) => i !== index)
);

};
const guardarPrestamo = () => {

 if (
  !numeroControl ||
  !nombreAlumno ||
  recursos.length === 0 ||
  !fechaPrestamo ||
  !fechaDevolucion
) {

    alert(
      "Completa todos los campos obligatorios"
    );

    return;
  }

  const prestamo = {
    numeroControl,
    nombreAlumno,
    recursos,
    fechaPrestamo,
    fechaDevolucion,
    observaciones
  };

  console.log(prestamo);

  alert(
    "✅ Préstamo registrado correctamente"
  );
  setRecursos([]);
  setFechaPrestamo("");
  setFechaDevolucion("");
  setObservaciones("");
  setBusquedaLibro("");
};
const alumnosPrueba = {
  "22308001": "Juan Pérez",
  "22308002": "María López",
  "22308003": "Carlos Ramírez",
};

  return (

    <div className="dashboard">

      <SidebarAlumno></SidebarAlumno>

      <main className="main-content">

       <div className="topbar">

  <div>

    <h1>
      Nuevo Préstamo
    </h1>

    <p>
      Registra préstamos de libros y materiales.
    </p>

  </div>
  <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
    <LogoutButton />
  </div>

</div>



<div className="table-section">
  <div className="form-card">

  <h3><FaUserGraduate /> Datos del Alumno</h3>

  <div className="form-grid">

<div className="form-group">
  <label>Número de Control</label>
  <input
    type="text"
    value={numeroControl}
    readOnly
  />
</div>

<div className="form-group">
  <label>Nombre del Alumno</label>
  <input
    type="text"
    value={nombreAlumno}
    readOnly
  />
</div>

  </div>

</div>
{/*prestamo */}
<div className="form-card">

  <h3><FaBook /> Datos del Préstamo</h3>

  <div className="form-group">

<label>Buscar libro o material</label>

<div className="search-book">

  <FaSearch className="search-icon" />

  <input
    type="text"
    placeholder="Escribe el nombre del libro..."
    value={busquedaLibro}
    onChange={(e) =>
      setBusquedaLibro(e.target.value)
    }
  />

</div>
<div className="books-results">

 {resultados.map((recurso, index) => (

  <div
    key={index}
    className="book-result"
    onClick={() => agregarLibro(recurso)}
  >
    <FaBook />

    <strong>{recurso.nombre}</strong>

    <span
      style={{
        marginLeft: "10px",
        color: "#666",
        fontSize: "13px"
      }}
    >
      ({recurso.tipo})
    </span>

  </div>

))}

</div>

  </div>

  <div className="selected-books">
  <h4>Recursos seleccionados</h4>

  <div className="books-list">

    {recursos.map((recurso, index) => (

      <div
        key={index}
        className="book-tag"
      >

        {recurso.tipo === "Libro"
          ? <FaBook />
          : <FaBoxOpen />
        }

        {" "}
        {recurso.nombre}

        <span
          style={{
            marginLeft: "6px",
            fontSize: "12px",
            color: "#555"
          }}
        >
          ({recurso.tipo})
        </span>

        <span
          className="book-remove"
          onClick={() => eliminarLibro(index)}
        >
          ✕
        </span>

      </div>

    ))}

</div>
</div>

  <div className="form-grid">

    <div className="form-group">
      <label>Fecha de préstamo</label>
      <input
  type="date"
  value={fechaPrestamo}
  onChange={(e) => {

    const fecha = e.target.value;

    setFechaPrestamo(fecha);

    if (fecha) {

      const nuevaFecha = new Date(fecha);

      nuevaFecha.setDate(
        nuevaFecha.getDate() + 7
      );

      const fechaDev =
        nuevaFecha
          .toISOString()
          .split("T")[0];

      setFechaDevolucion(
        fechaDev
      );

    }

  }}
/>
    </div>



  </div>

</div>


{/**Botones */}
<div className="form-actions">

  <button className="cancel-btn">
    Cancelar
  </button>

  <button
  className="save-btn"
  onClick={guardarPrestamo}
>
  Guardar Préstamo
</button>

</div>
</div>

      </main>

    </div>

  );
}

export default PrestamosAlumno;