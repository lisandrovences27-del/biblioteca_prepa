import { useState, useEffect } from "react";
import Sidebar from "../componentes/Sidebar";
import Accesibilidad from "../componentes/Accesibilidad";
import LogoutButton from "../componentes/LogoutButton";
import { FaBell, FaUser, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaShieldAlt, FaLock, FaAddressCard, FaSave, FaTimes, FaCamera } from "react-icons/fa";
import "../App.css";
import "./Perfil.css";

function PerfilAdmin() {
  // Simulando datos del usuario obtenidos del token o API
  const [userData, setUserData] = useState({
    nombreCompleto: "",
    rol: "Cargando...",
    estado: "Activo",
    correo: "",
    telefono: "",
    fechaNacimiento: "No especificada",
    usuario: "",
    ultimoAcceso: "Hoy"
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:3000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(prev => ({
            ...prev,
            nombreCompleto: data.nombre_completo || "",
            rol: data.rol_nombre || "",
            estado: data.bloqueado ? "Bloqueado" : "Activo",
            correo: data.correo_electronico || "",
            telefono: data.telefono || "",
            usuario: data.correo_electronico || "" // Asumimos correo como usuario
          }));
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const guardarCambios = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:3000/api/auth/profile", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre_completo: userData.nombreCompleto,
          telefono: userData.telefono
        })
      });
      if (res.ok) {
        alert("Cambios guardados con éxito.");
      } else {
        alert("Error al guardar los cambios.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1 }}>
            <div className="perfil-avatar-container" style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
              <div className="perfil-avatar">
                <div className="perfil-avatar-placeholder">
                  <FaUser />
                </div>
              </div>
              <div className="perfil-camera-btn">
                <FaCamera size={14} />
              </div>
            </div>
            <div className="perfil-info" style={{ color: 'white' }}>
              <h2 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{userData.nombreCompleto}</h2>
              <p style={{ margin: '0 0 8px 0', opacity: 0.9 }}>{userData.rol}</p>
              <div className="perfil-status" style={{ fontSize: '12px', padding: '3px 10px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.3)' }}>
                <div className="status-dot"></div>
                {userData.estado}
              </div>
            </div>
          </div>
          <div className="topbar-right" style={{ zIndex: 1 }}>
            <div className="icon-box">
              <FaBell />
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="perfil-wrapper">
          <div className="perfil-grid">
            {/* INFORMACIÓN PERSONAL */}
            <div className="perfil-card">
              <div className="perfil-card-header">
                <div className="perfil-card-icon">
                  <FaAddressCard />
                </div>
                <h3>Información Personal</h3>
              </div>
              
              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaUser /></div>
                <div className="perfil-form-label">Nombre completo</div>
                <input 
                  type="text" 
                  name="nombreCompleto" 
                  className="perfil-form-input" 
                  value={userData.nombreCompleto} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaEnvelope /></div>
                <div className="perfil-form-label">Correo electrónico</div>
                <input 
                  type="email" 
                  name="correo" 
                  className="perfil-form-input" 
                  value={userData.correo} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaPhoneAlt /></div>
                <div className="perfil-form-label">Teléfono</div>
                <input 
                  type="text" 
                  name="telefono" 
                  className="perfil-form-input" 
                  value={userData.telefono} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaCalendarAlt /></div>
                <div className="perfil-form-label">Fecha de nacimiento</div>
                <input 
                  type="text" 
                  name="fechaNacimiento" 
                  className="perfil-form-input" 
                  value={userData.fechaNacimiento} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>

            {/* INFORMACIÓN DE CUENTA */}
            <div className="perfil-card">
              <div className="perfil-card-header">
                <div className="perfil-card-icon">
                  <FaShieldAlt />
                </div>
                <h3>Información de Cuenta</h3>
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaUser /></div>
                <div className="perfil-form-label">Usuario</div>
                <input type="text" className="perfil-form-input" value={userData.usuario} disabled />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaAddressCard /></div>
                <div className="perfil-form-label">Rol</div>
                <input type="text" className="perfil-form-input" value={userData.rol} disabled />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaShieldAlt /></div>
                <div className="perfil-form-label">Estado</div>
                <div className="perfil-form-input" style={{display: 'flex', alignItems: 'center', gap: '8px', border: 'none', backgroundColor: 'transparent'}}>
                   <div className="status-dot"></div> {userData.estado}
                </div>
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaCalendarAlt /></div>
                <div className="perfil-form-label">Último acceso</div>
                <input type="text" className="perfil-form-input" value={userData.ultimoAcceso} disabled />
              </div>
            </div>
          </div>

          {/* SEGURIDAD */}
          <div className="perfil-card">
            <div className="security-card-content">
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div className="perfil-card-icon">
                  <FaLock />
                </div>
                <div className="security-info">
                  <h3 style={{margin: 0, color: '#333'}}>Seguridad</h3>
                  <p>Protege tu cuenta actualizando tu contraseña periódicamente.</p>
                </div>
              </div>
              <div className="security-password-field">
                <span>Contraseña</span>
                <input type="password" value="****************" readOnly />
              </div>
              <div>
                <button className="btn-outline">
                  <FaLock /> Cambiar contraseña
                </button>
              </div>
            </div>
          </div>

          <div className="perfil-actions">
            <button className="btn-primary" onClick={guardarCambios}>
              <FaSave /> Guardar cambios
            </button>
            <button className="btn-secondary">
              <FaTimes /> Cancelar
            </button>
          </div>

        </div>
      </main>
      <Accesibilidad />
    </div>
  );
}

export default PerfilAdmin;
