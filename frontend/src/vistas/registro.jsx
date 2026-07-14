// Importamos estilos
import "../App.css";

// Importamos logo
import logo from "../assets/logo.jpeg";

// Imagen fondo
import fondo from "../assets/fondoo.png";

// Importamos React
import { useState } from "react";

// Importamos iconos
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Registro() {

  // Estado para mostrar u ocultar contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Estado correo
  const [correo, setCorreo] = useState("");

  // Estado contraseña
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  // Estado número de control / RFC
  const [numeroControl, setNumeroControl] = useState("");
  // Estado para el tipo de usuario a registrar
  const [esProfesor, setEsProfesor] = useState(false);
 // Estado para guardar campos con error
  const [camposError, setCamposError] = useState({});

  //Datos nuevos agregados para el registro
const [nombreCompleto, setNombreCompleto] = useState("");

const [grado, setGrado] = useState("");
const [grupo, setGrupo] = useState("");
const [turno, setTurno] = useState("");

const [especialidad, setEspecialidad] = useState("");

const [telefono, setTelefono] = useState("");


  // Función para validar Registro
 const validarRegistro = async () => {

  let errores = {};

  // Número de control
  if (numeroControl.trim() === "") {
    errores.numeroControl = true;
  }

  // Nombre
  if (nombreCompleto.trim() === "") {
    errores.nombreCompleto = true;
  }

  // Validaciones condicionales si no es profesor
  if (!esProfesor) {
    // Grado
    if (grado === "") {
      errores.grado = true;
    }

    // Grupo
    if (grupo === "") {
      errores.grupo = true;
    }

    // Turno
    if (turno === "") {
      errores.turno = true;
    }

    // Especialidad
    if (especialidad === "") {
      errores.especialidad = true;
    }
  }

  // Teléfono
  if (telefono.trim() === "") {
    errores.telefono = true;
  }

  // Correo
  if (correo.trim() === "") {
    errores.correo = true;
  }

  // Contraseña
  if (password.trim() === "") {

  errores.password = true;

  setErrorPassword(
    "Ingresa una contraseña"
  );

}

// Validar mayúscula
else if (!/[A-Z]/.test(password)) {

  errores.password = true;

  setErrorPassword(
    "Debe contener al menos una mayúscula"
  );

}

// Validar longitud
else if (password.length < 8) {

  errores.password = true;

  setErrorPassword(
    "Debe tener mínimo 8 caracteres"
  );

}

else {

  setErrorPassword("");

}

  // Confirmar contraseña
  if (
    confirmarPassword.trim() === "" ||
    password !== confirmarPassword
  ) {
    errores.confirmarPassword = true;
  }

  // Guardar errores
  setCamposError(errores);

  // Si hay errores detener
  if (Object.keys(errores).length > 0) {
    return;
  }

  // Todo correcto, conectar con API
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        numero_control: numeroControl,
        nombre_completo: nombreCompleto,
        grado: esProfesor ? null : grado,
        grupo: esProfesor ? null : grupo,
        turno: esProfesor ? null : turno,
        especialidad: esProfesor ? null : especialidad,
        telefono: telefono,
        correo_electronico: correo,
        contrasena: password
      })
    });

    const data = await res.json();
    if (!res.ok) {
      alert("Error: " + data.error);
    } else {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "/";
    }
  } catch (err) {
    console.error(err);
    alert("Error de conexión al servidor");
  }
};
  return (

    // Contenedor principal
    <div
  className="container"
  style={{
    backgroundImage: `url(${fondo})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>

      {/* Caja login */}
      <div className="login-box">

        {/* Parte superior */}
        <div className="top-section">

          {/* Logo */}
          <div className="logo-circle">

            <img
              src={logo}
              alt="logo"
              className="logo-img"
            />

          </div>

          {/* Título */}
          <h1>Crear Cuenta</h1>

          {/* Subtítulo */}
          <p>Completa tus datos para registrarte</p>

        </div>



        {/* Formulario */}
        <div className="form-section">

       
    <>
      <div className="tabs" style={{marginBottom: "20px"}}>
        <button
          className={!esProfesor ? "active" : ""}
          onClick={() => setEsProfesor(false)}
        >
          Alumno
        </button>
        <button
          className={esProfesor ? "active" : ""}
          onClick={() => setEsProfesor(true)}
        >
          Profesor
        </button>
      </div>

      <label>Número de Control o RFC</label>
      {
        camposError.numeroControl && (
          <p className="error-message">
            Ingresa tu número de control o RFC
          </p>
        )
      }
      <input
        type="text"
        className={
          camposError.numeroControl
            ? "input-error"
            : ""
        }
        placeholder="Ingresa tu número de control o RFC"
        value={numeroControl}
        onChange={(e) =>
          setNumeroControl(e.target.value)
        }
      />
    </>
  

<label>Nombre Completo</label>

{
  camposError.nombreCompleto && (
    <p className="error-message">
      Ingresa tu nombre completo
    </p>
  )
}

<input
  type="text"

  className={
    camposError.nombreCompleto
      ? "input-error"
      : ""
  }

  placeholder="Nombre completo"

  value={nombreCompleto}

  onChange={(e) =>
    setNombreCompleto(e.target.value)
  }
/>
{
  !esProfesor && (
    <>
<label>
  Selecciona tu grado, grupo y turno
</label>
<div className="fila">

  {/* Grado */}
  <div className="campo">
  <select
    className={
      camposError.grado
        ? "input-error"
        : ""
    }

    value={grado}

    onChange={(e) =>
      setGrado(e.target.value)
    }
  >

  <option value="">
    Grado
  </option>
  <option value="1">
    1°
  </option>
  <option value="2">
    2°
  </option>
  <option value="3">
    3°
  </option>
  <option value="4">
    4°
  </option>
  <option value="5">
    5°
  </option>
  <option value="6">
    6°
  </option>
</select>
  </div>

  {/* Grupo */}
  <div className="campo">

    <select
  className={
    camposError.grupo
      ? "input-error"
      : ""
  }

  value={grupo}

  onChange={(e) => {

    setGrupo(e.target.value);

    setCamposError({
      ...camposError,
      grupo: false
    });

  }}
>

  <option value="">
    Grupo
  </option>

  <option value="A">
    A
  </option>

  <option value="B">
    B
  </option>

  <option value="C">
    C
  </option>

  <option value="D">
    D
  </option>

</select>
 </div>
  {/* Turno */}
  <div className="campo">

    <select
  className={
    camposError.turno
      ? "input-error"
      : ""
  }

  value={turno}

  onChange={(e) => {

    setTurno(e.target.value);

    setCamposError({
      ...camposError,
      turno: false
    });

  }}
>

  <option value="">
    Turno
  </option>

  <option value="Matutino">
    Matutino
  </option>

  <option value="Vespertino">
    Vespertino
  </option>

</select>
  </div>

</div>
<label>Especialidad</label>

{
  camposError.especialidad && (
    <p className="error-message">
      Ingresa tu especialidad
    </p>
  )
}

<select
  className={
    camposError.especialidad
      ? "input-error"
      : ""
  }
  value={especialidad}

  onChange={(e) =>
    setEspecialidad(e.target.value)
  }
>
  <option value="">
    Selecciona una especialidad
  </option>
  <option value="Programación">
    Programación
  </option>
  <option value="puericultura">
    Puericultura
  </option>
  <option value="hospedaje">
    Servicios de Hospedaje
  </option>
  <option value="administracionRH">
    Administración de recursos humanos
  </option>
  <option value="ciberseguridad">
    Ciberseguridad
  </option>
  <option value="contabilidad">
    Contabilidad
  </option>
  <option value="electronica">
    Electronica
  </option>
  <option value="secretariadoEB">
    Secretariado Ejecutivo Bilingüe
  </option>
  <option value="soporteTegnologias">
    Soporte y gestión de tegnologias informáticas 
  </option>
  <option value="soporteComputo">
    soporte y mantenimiento de equipo de computo
  </option>
<option value="ventas">
    Ventas 
  </option>


</select>
    </>
  )
}
{/* Numero de telefono */}
<label>Número de Teléfono</label>

{
  camposError.telefono && (
    <p className="error-message">
      Ingresa tu teléfono
    </p>
  )
}

<input
  type="tel"

  className={
    camposError.telefono
      ? "input-error"
      : ""
  }

  placeholder="Ingresa tu número de telefono"

  value={telefono}

  onChange={(e) =>
    setTelefono(e.target.value)
  }
/>
          {/* Campo correo */}
          <label>Correo </label>

         {
           camposError.correo && (
             <p className="error-message">
               Ingresa tu correo
             </p>
           )
         }

    <input
      type="email"
      className={camposError.correo ? "input-error" : ""}
      placeholder="Ingresa tu correo"

      value={correo}

  onChange={(e) =>
    setCorreo(e.target.value)
  }
/>



          {/* Campo contraseña */}
          <label>Contraseña</label>

{
  camposError.password && (
    <p className="error-message">
      {errorPassword}
    </p>
      )
}

<div className="password-container">

  <input
    type={mostrarPassword ? "text" : "password"}

    className={camposError.password ? "input-error" : ""}

    placeholder="Ingresa tu contraseña minimo una Mayúscula"

    value={password}

    onChange={(e) =>
      setPassword(e.target.value)
    }
  />
<label>Confirmar Contraseña</label>

{
  camposError.confirmarPassword && (
    <p className="error-message">
      Las contraseñas no coinciden
    </p>
  )
}

<input
  type={
    mostrarPassword
      ? "text"
      : "password"
  }

  className={
    camposError.confirmarPassword
      ? "input-error"
      : ""
  }

  placeholder="Confirma tu contraseña"

  value={confirmarPassword}

  onChange={(e) =>
    setConfirmarPassword(e.target.value)
  }
/>

  <button
    type="button"
    className="show-btn"

    onClick={() =>
      setMostrarPassword(!mostrarPassword)
    }
  >

    {
      mostrarPassword
        ? <FaEyeSlash />
        : <FaEye />
    }

  </button>

</div>
          {/* Mostrar errores */}
         


          {/* Botón login */}
          <button
            className="login-btn"

            onClick={validarRegistro}
          >
            Crear Cuenta
          </button>
          <p className="register-link">
            ¿Ya tienes cuenta?
            <a href="/">
              Inicia sesión
            </a>
         </p>

        </div>
      </div>



      {/* Footer */}
      <footer>
        © 2026 Biblioteca Escolar.
      </footer>

    </div>
  );
}

export default Registro;