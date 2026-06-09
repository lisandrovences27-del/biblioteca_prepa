import "../App.css";
import Sidebar from "../componentes/Sidebar";
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
import { useState } from "react";

function Prestamos() {

  const [numeroControl, setNumeroControl] = useState("");
  const [nombreAlumno, setNombreAlumno] = useState("");
  const [libroSeleccionado, setLibroSeleccionado] = useState("");
  const [libros, setLibros] = useState([]);
  const [fechaPrestamo, setFechaPrestamo] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [busquedaLibro, setBusquedaLibro] = useState("");
const librosPrueba = [
  "Matemáticas I",
  "Física General",
  "Química Básica",
  "Biología",
  "Anatomía Humana",
  "Farmacología"
];
const resultados = librosPrueba.filter(
  libro =>
    libro
      .toLowerCase()
      .includes(
        busquedaLibro.toLowerCase()
      )
);
const agregarLibro = (libro) => {

  if (libros.includes(libro)) return;

  setLibros([
    ...libros,
    libro
  ]);

  setBusquedaLibro("");
};
const eliminarLibro = (index) => {

  setLibros(
    libros.filter((_, i) => i !== index)
  );

};
const guardarPrestamo = () => {

  if (
    !numeroControl ||
    !nombreAlumno ||
    libros.length === 0 ||
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
    libros,
    fechaPrestamo,
    fechaDevolucion,
    observaciones
  };

  console.log(prestamo);

  alert(
    "✅ Préstamo registrado correctamente"
  );

  setNumeroControl("");
  setNombreAlumno("");
  setLibros([]);
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

      <Sidebar></Sidebar>

      <main className="main-content">

       <div className="topbar">

  <div>

    <h1>
      Nuevo Préstamo
    </h1>

    <p>
      Registra préstamos de libros para los alumnos.
    </p>

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
  onChange={(e) => {
    const numero = e.target.value;
    setNumeroControl(numero);
    if (alumnosPrueba[numero]) {
      setNombreAlumno(
        alumnosPrueba[numero]
      );
    } else {
      setNombreAlumno("");
    }

  }}
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

<label>Buscar libro</label>

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

  {busquedaLibro !== "" &&

    resultados.map((libro, index) => (

      <div
  key={index}
  className="book-result"
  onClick={() => agregarLibro(libro)}
>
  <FaBook />{libro}
</div>

    ))

  }

</div>

  </div>

  <div className="selected-books">

    <h4>Libros seleccionados</h4>

    <div className="books-list">

  {libros.map((libro, index) => (

    <div
      key={index}
      className="book-tag"
    >
      <FaBook /> {libro}

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

    <div className="form-group">
      <label>Fecha de devolución</label>
      <input
  type="date"
  value={fechaDevolucion}
  onChange={(e) => setFechaDevolucion(e.target.value)}
/>
    </div>

  </div>

</div>
{/**observaciones */}
<div className="form-card">

  <h3><FaEdit /> Observaciones</h3>

  <div className="form-group">

   <textarea
  rows="5"
  placeholder="Información adicional..."
  value={observaciones}
  onChange={(e) => setObservaciones(e.target.value)}
/>

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

export default Prestamos;