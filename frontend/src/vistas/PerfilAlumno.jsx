import { useState } from "react";
import SidebarAlumno from "../componentes/SidebarAlumno";
import Accesibilidad from "../componentes/Accesibilidad";
import LogoutButton from "../componentes/LogoutButton";
import { FaBell, FaUser, FaEnvelope, FaPhoneAlt, FaCalendarAlt, FaShieldAlt, FaLock, FaAddressCard, FaBook, FaBoxOpen, FaCheckCircle, FaCamera, FaGraduationCap } from "react-icons/fa";
import "../App.css";
import "./Perfil.css";

function PerfilAlumno() {
  // Simulando datos del usuario
  const [userData, setUserData] = useState({
    numeroControl: "233070123456",
    nombreCompleto: "Brenda Valadez",
    gradoGrupoTurno: "5° A | Matutino",
    especialidad: "Programación",
    correo: "brenda.valadez@cetis120.edu.mx",
    telefono: "443 123 4567",
    usuario: "brenda.v",
    rol: "Alumno",
    estatus: "Activo",
    fechaRegistro: "15 de agosto de 2024",
    ultimoAcceso: "12 de julio de 2026, 09:45 a.m."
  });

  return (
    <div className="dashboard">
      <SidebarAlumno />
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
                {userData.estatus}
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
                <div className="perfil-form-icon"><FaAddressCard /></div>
                <div className="perfil-form-label">Número de control</div>
                <input type="text" className="perfil-form-input" value={userData.numeroControl} disabled />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaUser /></div>
                <div className="perfil-form-label">Nombre completo</div>
                <input type="text" className="perfil-form-input" value={userData.nombreCompleto} disabled />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaGraduationCap /></div>
                <div className="perfil-form-label">Grado, Grupo y Turno</div>
                <input type="text" className="perfil-form-input" value={userData.gradoGrupoTurno} disabled />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaBook /></div>
                <div className="perfil-form-label">Especialidad</div>
                <input type="text" className="perfil-form-input" value={userData.especialidad} disabled />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaEnvelope /></div>
                <div className="perfil-form-label">Correo electrónico</div>
                <input type="email" className="perfil-form-input" value={userData.correo} disabled />
              </div>

              <div className="perfil-form-group">
                <div className="perfil-form-icon"><FaPhoneAlt /></div>
                <div className="perfil-form-label">Teléfono</div>
                <input type="text" className="perfil-form-input" value={userData.telefono} disabled />
              </div>

              <div className="perfil-actions">
                <button className="btn-outline" style={{width: '100%', justifyContent: 'center'}}>
                  ✎ Editar información
                </button>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
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
                  <div className="perfil-form-icon"><FaShieldAlt /></div>
                  <div className="perfil-form-label">Rol</div>
                  <input type="text" className="perfil-form-input" value={userData.rol} disabled />
                </div>

                <div className="perfil-form-group">
                  <div className="perfil-form-icon"><FaCheckCircle /></div>
                  <div className="perfil-form-label">Estatus</div>
                  <div className="perfil-form-input" style={{display: 'flex', alignItems: 'center', gap: '8px', border: 'none', backgroundColor: 'transparent'}}>
                    <div className="status-dot"></div> {userData.estatus}
                  </div>
                </div>

                <div className="perfil-form-group">
                  <div className="perfil-form-icon"><FaCalendarAlt /></div>
                  <div className="perfil-form-label">Fecha de registro</div>
                  <input type="text" className="perfil-form-input" value={userData.fechaRegistro} disabled />
                </div>

                <div className="perfil-form-group">
                  <div className="perfil-form-icon"><FaCalendarAlt /></div>
                  <div className="perfil-form-label">Último acceso</div>
                  <input type="text" className="perfil-form-input" value={userData.ultimoAcceso} disabled />
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
                  <div>
                    <button className="btn-outline">
                      <FaLock /> Cambiar contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE */}
          <div className="perfil-card" style={{marginTop: '0'}}>
            <div className="perfil-card-header">
              <div className="perfil-card-icon">
                <FaCalendarAlt />
              </div>
              <h3>Actividad Reciente</h3>
            </div>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-icon green">
                  <FaBook />
                </div>
                <div className="timeline-content">
                  <h4>Préstamo realizado</h4>
                  <p>Libro: El principito</p>
                  <span className="date">08 julio 2026</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon yellow">
                  <FaBoxOpen />
                </div>
                <div className="timeline-content">
                  <h4>Préstamo solicitado</h4>
                  <p>Material: Proyector Epson</p>
                  <span className="date">05 julio 2026</span>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-icon blue">
                  <FaCheckCircle />
                </div>
                <div className="timeline-content">
                  <h4>Préstamo devuelto</h4>
                  <p>Libro: Cien años de soledad</p>
                  <span className="date">28 junio 2026</span>
                </div>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center'}}>
                <button className="btn-outline">
                  Ver mis préstamos →
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Accesibilidad />
    </div>
  );
}

export default PerfilAlumno;
