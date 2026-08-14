import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import SidebarMateriales from "../componentes/SidebarMateriales";
import Accesibilidad from "../componentes/Accesibilidad";
import LogoutButton from "../componentes/LogoutButton";
import { FaBell, FaUser, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaShieldAlt, FaLock, FaAddressCard, FaSave, FaTimes, FaCamera, FaEye, FaEyeSlash } from "react-icons/fa";
import "../App.css";
import "./Perfil.css";

function PerfilAdmin2() {
  // Simulando datos del usuario obtenidos del token o API
  const [userData, setUserData] = useState({
    nombreCompleto: "",
    rol: "Administrador Materiales",
    estado: "Activo",
    correo: "",
    telefono: "",
    fechaNacimiento: "",
    usuario: "",
    ultimoAcceso: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUserData(prev => ({
            ...prev,
            nombreCompleto: data.nombre_completo || "",
            rol: data.rol_nombre || "Administrador Materiales",
            estado: data.bloqueado ? "Bloqueado" : "Activo",
            correo: data.correo_electronico || "",
            telefono: data.telefono || "",
            usuario: data.correo_electronico || ""
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

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswordTypes, setShowPasswordTypes] = useState({ current: false, new: false, confirm: false });

  const guardarCambios = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/auth/profile", {
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
        Swal.fire({ icon: 'success', title: 'Éxito', text: 'Cambios guardados con éxito.', confirmButtonColor: '#4CAF50' });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar los cambios.', confirmButtonColor: '#d33' });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión.', confirmButtonColor: '#d33' });
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      return Swal.fire({ icon: 'warning', title: 'Atención', text: 'Las contraseñas nuevas no coinciden.', confirmButtonColor: '#3085d6' });
    }
    if (!passwords.currentPassword || !passwords.newPassword) {
      return Swal.fire({ icon: 'warning', title: 'Atención', text: 'Por favor llena todos los campos de contraseña.', confirmButtonColor: '#3085d6' });
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword
        })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Éxito', text: 'Contraseña actualizada con éxito.', confirmButtonColor: '#4CAF50' });
        setShowPasswordForm(false);
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Error al cambiar la contraseña.', confirmButtonColor: '#d33' });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión.', confirmButtonColor: '#d33' });
    }
  };

  return (
    <div className="dashboard">
      <SidebarMateriales />
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
            <div className="security-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div className="perfil-card-icon">
                  <FaLock />
                </div>
                <div className="security-info">
                  <h3 style={{margin: 0, color: '#333'}}>Seguridad</h3>
                  <p>Protege tu cuenta actualizando tu contraseña periódicamente.</p>
                </div>
              </div>
              
              {!showPasswordForm ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div className="security-password-field" style={{ margin: 0 }}>
                    <span style={{ marginRight: '15px', fontWeight: 'bold', color: '#555' }}>Contraseña</span>
                    <input type="password" value="****************" readOnly style={{ border: 'none', background: 'transparent', outline: 'none', color: '#666' }} />
                  </div>
                  <button className="btn-outline" onClick={() => setShowPasswordForm(true)}>
                    <FaLock /> Cambiar contraseña
                  </button>
                </div>
              ) : (
                <div style={{ 
                  marginTop: '10px', 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '15px',
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                    <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Contraseña actual</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPasswordTypes.current ? "text" : "password"} placeholder="Ingresa tu contraseña actual" className="perfil-form-input" style={{ width: '100%', paddingRight: '40px' }} value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} />
                      <button type="button" onClick={() => setShowPasswordTypes({...showPasswordTypes, current: !showPasswordTypes.current})} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                        {showPasswordTypes.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                    <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Nueva contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPasswordTypes.new ? "text" : "password"} placeholder="Ingresa tu nueva contraseña" className="perfil-form-input" style={{ width: '100%', paddingRight: '40px' }} value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
                      <button type="button" onClick={() => setShowPasswordTypes({...showPasswordTypes, new: !showPasswordTypes.new})} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                        {showPasswordTypes.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
                    <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>Confirmar nueva contraseña</label>
                    <div style={{ position: 'relative' }}>
                      <input type={showPasswordTypes.confirm ? "text" : "password"} placeholder="Confirma tu nueva contraseña" className="perfil-form-input" style={{ width: '100%', paddingRight: '40px' }} value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} />
                      <button type="button" onClick={() => setShowPasswordTypes({...showPasswordTypes, confirm: !showPasswordTypes.confirm})} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
                        {showPasswordTypes.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', gridColumn: '1 / -1', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button className="btn-secondary" onClick={() => setShowPasswordForm(false)} style={{padding: '10px 20px', fontSize: '14px'}}>Cancelar</button>
                    <button className="btn-primary" onClick={handlePasswordChange} style={{padding: '10px 20px', fontSize: '14px'}}>Actualizar Contraseña</button>
                  </div>
                </div>
              )}
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

export default PerfilAdmin2;
