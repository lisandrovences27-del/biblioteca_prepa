const fs = require('fs');
let code = fs.readFileSync('frontend/src/vistas/PrestamosMateriales.jsx', 'utf8');

code = code.replace(
  'FaBoxOpen\r\n} from "react-icons/fa";', 
  'FaBoxOpen,\r\n  FaBan\r\n} from "react-icons/fa";'
);
if(!code.includes('FaBan')) {
  code = code.replace(
    'FaBoxOpen\n} from "react-icons/fa";', 
    'FaBoxOpen,\n  FaBan\n} from "react-icons/fa";'
  );
}

const stateInsert = `
  const [modalSancion, setModalSancion] = useState(false);
  const [modalDevolucion, setModalDevolucion] = useState(false);
  const [modalMensaje, setModalMensaje] = useState({ show: false, text: '', type: 'success' });
  const [motivoSancion, setMotivoSancion] = useState("");
  const mostrarMensaje = (text, type = 'success') => setModalMensaje({ show: true, text, type });
`;
code = code.replace('const [solicitudActiva, setSolicitudActiva] = useState(null);', 'const [solicitudActiva, setSolicitudActiva] = useState(null);' + stateInsert);


const functionsInsert = `
  const abrirSancion = (solicitud) => {
    setSolicitudActiva(solicitud);
    setMotivoSancion("");
    setModalSancion(true);
  };

  const confirmarDevolucion = (solicitud) => {
    setSolicitudActiva(solicitud);
    setModalDevolucion(true);
  };

  const ejecutarDevolucion = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/prestamos/" + solicitudActiva.id + "/devolver", {
        method: "PUT",
        headers: { "Authorization": "Bearer " + token }
      });
      if (res.ok) {
        mostrarMensaje("Devolución registrada con éxito.", "success");
        setModalDevolucion(false);
        cargarSolicitudes();
      } else {
        const data = await res.json();
        mostrarMensaje("Error: " + data.error, "error");
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error de conexión", "error");
    }
  };

  const confirmarSancion = async (e) => {
    e.preventDefault();
    if (!motivoSancion) {
      mostrarMensaje("Debes indicar un motivo de sanción.", "error");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/sanciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify({
          id_alumno: solicitudActiva.id_alumno || solicitudActiva.alumno_id, // needs id_alumno
          id_prestamo: solicitudActiva.id,
          motivo: motivoSancion
        })
      });
      if (res.ok) {
        mostrarMensaje("Sanción aplicada exitosamente. El alumno ha sido bloqueado.", "success");
        setModalSancion(false);
        cargarSolicitudes();
      } else {
        const data = await res.json();
        mostrarMensaje("Error: " + data.error, "error");
      }
    } catch (error) {
      console.error(error);
      mostrarMensaje("Error de conexión", "error");
    }
  };
`;
code = code.replace('// Funciones para confirmar acciones', functionsInsert + '\n  // Funciones para confirmar acciones');

code = code.replace('id: p.id_prestamo,', 'id: p.id_prestamo,\n        id_alumno: p.id_alumno,');

// Replace alerts
code = code.replace(/alert\((['`"])(.*?)(['`"])\)/g, (match, p1, p2, p3) => {
    let type = p2.toLowerCase().includes('error') || p2.toLowerCase().includes('debes') || p2.toLowerCase().includes('obligatorias') ? 'error' : 'success';
    return 'mostrarMensaje(' + p1 + p2 + p3 + ', "' + type + '")';
});

// Update the buttons in the table
const buttonsTarget = `                            </button>
                          </>
                        )}
                      </td>`;

const buttonsInsert = `                            </button>
                          </>
                        )}
                        {solicitud.estado === "Activo" && (
                          <>
                            <button 
                              style={{ ...btnActionStyle, backgroundColor: "#10b981" }} 
                              title="Confirmar Devolución"
                              onClick={() => confirmarDevolucion(solicitud)}
                            >
                              <FaCheckCircle />
                            </button>
                            <button 
                              style={{ ...btnActionStyle, backgroundColor: "#991B1B" }} 
                              title="Sancionar"
                              onClick={() => abrirSancion(solicitud)}
                            >
                              <FaBan />
                            </button>
                          </>
                        )}
                      </td>`;

if (code.includes(buttonsTarget)) {
  code = code.replace(buttonsTarget, buttonsInsert);
} else {
  // Try CRLF
  code = code.replace(buttonsTarget.replace(/\n/g, '\r\n'), buttonsInsert);
}


// Add Modals JSX
const modalsJSX = `
      {/* ===== MODAL: SANCIONAR ===== */}
      {modalSancion && solicitudActiva && (
        <div style={modalOverlayStyle} onClick={() => setModalSancion(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#991B1B", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <FaBan color="#991B1B" /> Sancionar Alumno
            </h2>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              Se registrará una sanción para <strong>{solicitudActiva.alumno}</strong> por no devolver <strong>{solicitudActiva.material}</strong>. El alumno quedará bloqueado automáticamente.
            </p>
            
            <form onSubmit={confirmarSancion}>
              <label style={{ fontWeight: "bold", color: "#333", display: "block" }}>Motivo de la Sanción *</label>
              <textarea 
                rows="4" 
                required 
                style={{...formInputStyle, resize: "vertical", borderColor: "#fca5a5"}} 
                placeholder="Ej. Daño al material, retraso de entrega de más de 3 días, pérdida..."
                value={motivoSancion}
                onChange={(e) => setMotivoSancion(e.target.value)}
              ></textarea>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setModalSancion(false)} style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#e5e7eb", color: "#374151", cursor: "pointer", fontWeight: "bold" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#991B1B", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                  Aplicar Sanción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL: CONFIRMAR DEVOLUCIÓN ===== */}
      {modalDevolucion && solicitudActiva && (
        <div style={modalOverlayStyle} onClick={() => setModalDevolucion(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#065F46", marginTop: 0, display: "flex", alignItems: "center", gap: "10px" }}>
              <FaCheckCircle color="#065F46" /> Confirmar Devolución
            </h2>
            <p style={{ color: "#666", marginBottom: "15px", fontSize: "16px" }}>
              ¿Estás seguro que deseas marcar <strong>{solicitudActiva.material}</strong> como devuelto por <strong>{solicitudActiva.alumno}</strong>?
            </p>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button onClick={() => setModalDevolucion(false)} style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#e5e7eb", color: "#374151", cursor: "pointer", fontWeight: "bold" }}>
                Cancelar
              </button>
              <button onClick={ejecutarDevolucion} style={{ padding: "12px 20px", borderRadius: "10px", border: "none", backgroundColor: "#065F46", color: "white", cursor: "pointer", fontWeight: "bold" }}>
                Sí, confirmar devolución
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: MENSAJE GENÉRICO ===== */}
      {modalMensaje.show && (
        <div style={modalOverlayStyle} onClick={() => setModalMensaje({ ...modalMensaje, show: false })}>
          <div style={{...modalContentStyle, maxWidth: '400px', textAlign: 'center'}} onClick={(e) => e.stopPropagation()}>
            {modalMensaje.type === 'success' ? (
              <FaCheckCircle color="#065F46" size={50} style={{ margin: '0 auto 15px auto', display: 'block' }} />
            ) : (
              <FaTimesCircle color="#991B1B" size={50} style={{ margin: '0 auto 15px auto', display: 'block' }} />
            )}
            <h2 style={{ color: modalMensaje.type === 'success' ? '#065F46' : '#991B1B', marginTop: 0 }}>
              {modalMensaje.type === 'success' ? '¡Éxito!' : 'Aviso'}
            </h2>
            <p style={{ color: "#666", marginBottom: "20px", fontSize: "16px" }}>
              {modalMensaje.text}
            </p>
            <button onClick={() => setModalMensaje({ ...modalMensaje, show: false })} style={{ padding: "10px 30px", borderRadius: "10px", border: "none", backgroundColor: modalMensaje.type === 'success' ? '#065F46' : '#991B1B', color: "white", cursor: "pointer", fontWeight: "bold" }}>
              Aceptar
            </button>
          </div>
        </div>
      )}
`;

code = code.replace('    </div>\r\n  );\r\n}\r\n\r\nexport default PrestamosMateriales;', modalsJSX + '\n    </div>\n  );\n}\n\nexport default PrestamosMateriales;');
if (!code.includes('MODAL: SANCIONAR')) {
  // Try LF
  code = code.replace('    </div>\n  );\n}\n\nexport default PrestamosMateriales;', modalsJSX + '\n    </div>\n  );\n}\n\nexport default PrestamosMateriales;');
}

fs.writeFileSync('frontend/src/vistas/PrestamosMateriales.jsx', code);
console.log('Successfully reapplied logic without syntax errors');
