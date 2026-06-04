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
  const [errorBackend, setErrorBackend] = useState("");


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

  setErrorBackend("");

  // Llamada al backend
  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      correo_electronico: correo,
      contrasena: password,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        // Guardar token y datos del usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login exitoso. Bienvenido " + data.user.nombre);
        // Redirigimos al dashboard de admin ya que es el que está listo por ahora
        window.location.href = "/dashboard-admin";
      } else {
        setErrorBackend(data.error || "Error al iniciar sesión");
      }
    })
    .catch((err) => {
      console.error(err);
      setErrorBackend("Error de conexión con el servidor");
    });
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
          {errorBackend && (
            <p className="error-message" style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
              {errorBackend}
            </p>
          )}
          {/* Botón login */}
          <button
            className="login-btn"

            onClick={validarLogin}
          >
            Iniciar Sesión
          </button>
          <p className="register-link">
            ¿No tienes cuenta?
            <a href="/registro">
              Crear cuenta
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

export default Login;