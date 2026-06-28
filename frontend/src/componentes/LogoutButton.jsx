import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaExclamationTriangle } from "react-icons/fa";

function LogoutButton() {
  const navigate = useNavigate();
  const [modalLogoutAbierto, setModalLogoutAbierto] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div 
        className="icon-box" 
        onClick={() => setModalLogoutAbierto(true)} 
        title="Cerrar sesión" 
        style={{ backgroundColor: "#991B1B", cursor: "pointer", marginLeft: "15px" }}
      >
        <FaSignOutAlt />
      </div>

      {modalLogoutAbierto && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(11, 23, 66, 0.7)", backdropFilter: "blur(5px)",
          display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999
        }} onClick={() => setModalLogoutAbierto(false)}>
          <div style={{
            backgroundColor: "white", borderRadius: "20px", padding: "30px",
            width: "90%", maxWidth: "400px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            textAlign: "center"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ 
              width: "80px", height: "80px", borderRadius: "50%", 
              backgroundColor: "#fca5a5", display: "flex", justifyContent: "center", 
              alignItems: "center", margin: "0 auto 20px auto" 
            }}>
              <FaExclamationTriangle size={40} color="#991B1B" />
            </div>
            <h2 style={{ color: "#0B1742", margin: "0 0 10px 0", fontSize: "24px" }}>Cerrar sesión</h2>
            <p style={{ color: "#666", margin: "0 0 30px 0", fontSize: "16px" }}>
              ¿Estás seguro de que deseas salir del sistema?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
              <button 
                onClick={() => setModalLogoutAbierto(false)} 
                style={{ 
                  padding: "12px 24px", borderRadius: "10px", border: "none", 
                  backgroundColor: "#e5e7eb", color: "#374151", cursor: "pointer", 
                  fontWeight: "bold", flex: 1, fontSize: "16px", transition: "0.2s" 
                }}>
                Cancelar
              </button>
              <button 
                onClick={handleLogout} 
                style={{ 
                  padding: "12px 24px", borderRadius: "10px", border: "none", 
                  backgroundColor: "#991B1B", color: "white", cursor: "pointer", 
                  fontWeight: "bold", flex: 1, fontSize: "16px", transition: "0.2s" 
                }}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LogoutButton;
