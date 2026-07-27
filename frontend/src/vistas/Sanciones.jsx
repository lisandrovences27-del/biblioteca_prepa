import "../App.css";
import Sidebar from "../componentes/Sidebar";
import LogoutButton from "../componentes/LogoutButton";
import { useState, useEffect } from "react";
import { FaBan, FaPlus, FaCheck, FaTimes, FaSearch, FaExclamationTriangle } from "react-icons/fa";

function Sanciones() {
  const [sanciones, setSanciones] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [tabActiva, setTabActiva] = useState("activas");

  const [form, setForm] = useState({
    id_alumno: "",
    motivo: ""
  });

  const getToken = () => localStorage.getItem("token");

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resSanciones, resAlumnos] = await Promise.all([
        fetch("/api/sanciones", { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch("/api/auth/alumnos", { headers: { Authorization: `Bearer ${getToken()}` } })
      ]);

      if (!resSanciones.ok || !resAlumnos.ok) throw new Error("Error al cargar datos");
      
      const dataSanciones = await resSanciones.json();
      const dataAlumnos = await resAlumnos.json();

      setSanciones(dataSanciones);
      setAlumnos(dataAlumnos);
    } catch (err) {
      setError("No se pudieron cargar los datos. Verifica tu conexión.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (exito || error) {
      const timer = setTimeout(() => {
        setExito("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [exito, error]);

  const sancionesFiltradas = sanciones.filter(
    (s) =>
      s.alumno?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.numero_control?.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.motivo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const activas = sancionesFiltradas.filter(s => s.estado === 'Activa');
  const resueltas = sancionesFiltradas.filter(s => s.estado === 'Resuelta');
  const mostrarSanciones = tabActiva === "activas" ? activas : resueltas;

  const abrirModal = () => {
    setForm({ id_alumno: "", motivo: "" });
    setModalAbierto(true);
  };

  const guardarSancion = async (e) => {
    e.preventDefault();

    if (!form.id_alumno || !form.motivo) {
      setError("El alumno y el motivo son obligatorios.");
      return;
    }

    try {
      const res = await fetch("/api/sanciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear sanción");
      }

      setExito("Sanción creada correctamente. El alumno ha sido bloqueado ✓");
      setModalAbierto(false);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const resolverSancion = async (id) => {
    if (!window.confirm("¿Seguro que deseas resolver esta sanción? Si el alumno no tiene otras sanciones, se desbloqueará su cuenta.")) return;
    
    try {
      const res = await fetch(`/api/sanciones/${id}/resolver`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al resolver");
      }

      setExito("Sanción resuelta correctamente ✓");
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1> <FaBan /> Control de Sanciones</h1>
            <p>Gestiona los alumnos sancionados y su bloqueo de préstamos.</p>
          </div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
            <button className="inv-btn-agregar" onClick={abrirModal} style={{ background: "linear-gradient(135deg, #e74c3c, #c0392b)", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 6px rgba(231, 76, 60, 0.3)", transition: "all 0.3s ease" }}>
              <FaPlus /> Nueva Sanción
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Estilos para las pestañas y tarjetas */}
        <style>{`
          .sanciones-tabs {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
          }
          .sancion-tab {
            background: none;
            border: none;
            font-size: 16px;
            font-weight: 600;
            color: #7f8c8d;
            cursor: pointer;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.3s ease;
          }
          .sancion-tab:hover {
            background: #f1f2f6;
            color: #2c3e50;
          }
          .sancion-tab.active {
            background: #e74c3c;
            color: white;
            box-shadow: 0 4px 6px rgba(231, 76, 60, 0.2);
          }
          .sancion-tab.active.resueltas {
            background: #2ecc71;
            box-shadow: 0 4px 6px rgba(46, 204, 113, 0.2);
          }
          .sanciones-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
          }
          .sancion-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            border: 1px solid #f1f2f6;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .sancion-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
          }
          .sancion-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 15px;
          }
          .sancion-alumno {
            font-size: 18px;
            font-weight: 700;
            color: #2c3e50;
            margin: 0 0 5px 0;
          }
          .sancion-control {
            font-size: 13px;
            color: #7f8c8d;
            margin: 0;
            background: #f1f2f6;
            padding: 3px 8px;
            border-radius: 4px;
            display: inline-block;
          }
          .sancion-body {
            margin-bottom: 15px;
          }
          .sancion-motivo {
            font-size: 15px;
            color: #34495e;
            line-height: 1.5;
            background: #fdf2f2;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
          }
          .sancion-motivo.resuelto {
            background: #f2fdf5;
            border-left: 4px solid #2ecc71;
          }
          .sancion-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #eee;
            padding-top: 15px;
            font-size: 13px;
            color: #95a5a6;
          }
        `}</style>

        <div className="inv-content">
          {error && (
            <div className="alerta error">
              <FaExclamationTriangle /> {error}
            </div>
          )}
          {exito && (
            <div className="alerta exito">
              <FaCheck /> {exito}
            </div>
          )}

          <div className="inv-tools">
            <div className="inv-search-container">
              <FaSearch className="inv-search-icon" />
              <input
                type="text"
                placeholder="Buscar por nombre, control o motivo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="inv-search-input"
              />
            </div>
          </div>

          <div className="inv-table-container">
            <div className="sanciones-tabs">
              <button 
                className={`sancion-tab ${tabActiva === 'activas' ? 'active' : ''}`}
                onClick={() => setTabActiva('activas')}
              >
                Sanciones Activas ({activas.length})
              </button>
              <button 
                className={`sancion-tab ${tabActiva === 'resueltas' ? 'active resueltas' : ''}`}
                onClick={() => setTabActiva('resueltas')}
              >
                Historial (Resueltas) ({resueltas.length})
              </button>
            </div>

            {loading ? (
              <p style={{ padding: "20px", textAlign: "center" }}>Cargando sanciones...</p>
            ) : mostrarSanciones.length > 0 ? (
              <div className="sanciones-grid">
                {mostrarSanciones.map((s) => (
                  <div key={s.id_sancion} className="sancion-card">
                    <div>
                      <div className="sancion-header">
                        <div>
                          <h3 className="sancion-alumno">{s.alumno}</h3>
                          <p className="sancion-control">No. {s.numero_control}</p>
                        </div>
                        <span className={`status ${s.estado === 'Activa' ? 'inv-agotado' : 'inv-disponible'}`} style={{ margin: 0 }}>
                          {s.estado}
                        </span>
                      </div>
                      
                      <div className="sancion-body">
                        <div className={`sancion-motivo ${s.estado === 'Resuelta' ? 'resuelto' : ''}`}>
                          <strong>Motivo:</strong><br />
                          {s.motivo}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="sancion-footer">
                        <span>📅 {new Date(s.fecha_sancion).toLocaleDateString()}</span>
                        <span>👤 Por: {s.aplicada_por || "-"}</span>
                      </div>

                      {s.estado === 'Activa' && (
                        <button
                          className="inv-btn-action success"
                          title="Resolver y Desbloquear"
                          onClick={() => resolverSancion(s.id_sancion)}
                          style={{ width: "100%", marginTop: "15px", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "10px", borderRadius: "8px", background: "#2ecc71", color: "white", border: "none", cursor: "pointer", fontWeight: "bold" }}
                        >
                          <FaCheck /> Marcar como Resuelta
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="inv-empty-state" style={{ background: "white", borderRadius: "12px", padding: "50px", border: "1px dashed #ccc" }}>
                {tabActiva === "activas" ? (
                  <>
                    <FaCheck style={{ fontSize: "50px", color: "#2ecc71", marginBottom: "15px" }} />
                    <h3>Todo en orden</h3>
                    <p>No hay alumnos sancionados en este momento. ¡Buen trabajo!</p>
                  </>
                ) : (
                  <>
                    <FaBan style={{ fontSize: "50px", color: "#ccc", marginBottom: "15px" }} />
                    <h3>Sin historial</h3>
                    <p>No se encontraron sanciones resueltas que coincidan con tu búsqueda.</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Agregar Sanción */}
      {modalAbierto && (
        <div className="inv-modal-overlay">
          <div className="inv-modal" style={{ maxWidth: "500px" }}>
            <div className="inv-modal-header">
              <h2>Nueva Sanción</h2>
              <button className="inv-modal-close" onClick={() => setModalAbierto(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="alerta warning" style={{ marginBottom: "20px" }}>
              <FaExclamationTriangle /> ¡Atención! Al sancionar a un alumno, su cuenta será <strong>bloqueada inmediatamente</strong> y no podrá solicitar más préstamos hasta que se resuelva la sanción.
            </div>

            <form onSubmit={guardarSancion} className="inv-form">
              <div className="inv-form-group">
                <label>Alumno <span className="req">*</span></label>
                <select
                  required
                  value={form.id_alumno}
                  onChange={(e) => setForm({ ...form, id_alumno: e.target.value })}
                  className="inv-input"
                >
                  <option value="">-- Selecciona un alumno --</option>
                  {alumnos.map((a) => (
                    <option key={a.id_usuario} value={a.id_usuario}>
                      {a.nombre_completo} (No. {a.numero_control}) {a.bloqueado ? ' [Ya Bloqueado]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="inv-form-group">
                <label>Motivo de la Sanción <span className="req">*</span></label>
                <textarea
                  required
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  placeholder="Ej. No entregó el material a tiempo, causó daños..."
                  className="inv-input"
                  rows="4"
                ></textarea>
              </div>

              <div className="inv-modal-footer">
                <button type="button" className="inv-btn-cancelar" onClick={() => setModalAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="inv-btn-guardar">
                  Aplicar Sanción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sanciones;
