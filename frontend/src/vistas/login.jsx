// Importamos estilos
import "../App.css";

// Importamos logo
import logo from "../assets/iconoCetis.png";

// Imagen fondo
import fondo from "../assets/fondoo.png";

// Importamos React
import { useState } from "react";

// Importamos iconos
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

  // Estado para mostrar u ocultar contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);

  // Estado para saber qué tipo de usuario está seleccionado
  const [tipoUsuario, setTipoUsuario] = useState("admin");

  // Estado correo
  const [correo, setCorreo] = useState("");

  // Estado contraseña
  const [password, setPassword] = useState("");

  // Estado número de control
  const [numeroControl, setNumeroControl] = useState("");
 // Estado para guardar campos con error
  const [camposError, setCamposError] = useState({});


  // Función para validar login
  const validarLogin = () => {

  let errores = {};

  // Validar número de control
  if (
    tipoUsuario === "alumno" &&
    numeroControl === ""
  ) {
    errores.numeroControl = true;
  }

  // Validar correo
  if (correo === "") {
    errores.correo = true;
  }

  // Validar contraseña
  if (password === "") {
    errores.password = true;
  }

  setCamposError(errores);

  if (Object.keys(errores).length > 0) {
    return;
  }

  alert("Login válido");
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
          <h1>PrestaCetis</h1>

          {/* Subtítulo */}
          <p>CETis No.120</p>

        </div>



        {/* Formulario */}
        <div className="form-section">

          {/* Tabs */}
          <div className="tabs">

            {/* Botón administrador */}
            <button
              className={tipoUsuario === "admin" ? "active" : ""}
              onClick={() => setTipoUsuario("admin")}
            >
              Administrador
            </button>

            {/* Botón alumno */}
            <button
              className={tipoUsuario === "alumno" ? "active" : ""}
              onClick={() => setTipoUsuario("alumno")}
            >
              Alumno
            </button>

          </div>



          {/* Mostrar número de control si es alumno */}
          {
  tipoUsuario === "alumno" && (
    <>

      <label>Número de Control</label>

      {
        camposError.numeroControl && (
          <p className="error-message">
            Ingresa tu número de control
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

        placeholder=""

        value={numeroControl}

        onChange={(e) =>
          setNumeroControl(e.target.value)
        }
      />

    </>
  )
}
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
      placeholder=""

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
      Ingresa tu contraseña
    </p>
  )
}

<div className="password-container">

  <input
    type={mostrarPassword ? "text" : "password"}

    className={camposError.password ? "input-error" : ""}

    placeholder=""

    value={password}

    onChange={(e) =>
      setPassword(e.target.value)
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

          

          {/* Opciones inferiores */}
          <div className="options">

            <label>

              <input type="checkbox" />

              Recordarme

            </label>

            <a href="#">
              ¿Olvidaste tu contraseña?
            </a>

          </div>



          {/* Mostrar errores */}
         


          {/* Botón login */}
          <button
            className="login-btn"

            onClick={validarLogin}
          >
            Iniciar Sesión
          </button>

        </div>
      </div>



      {/* Footer */}
      <footer>
        © 2026 Biblioteca Escolar.
      </footer>

    </div>
  );
}

export default Login;