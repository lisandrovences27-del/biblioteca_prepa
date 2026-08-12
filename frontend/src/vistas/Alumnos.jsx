import { useState, useEffect } from "react";
import "../App.css";
import Sidebar from "../componentes/Sidebar";
import LogoutButton from "../componentes/LogoutButton";
import { FaSearch, FaTimes, FaUserGraduate, FaFilePdf, FaBan, FaCheckCircle, FaFilter } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Alumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("todos"); // todos, activos, sancionados
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const getToken = () => localStorage.getItem("token");

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/alumnos", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Error al cargar los alumnos");
      const data = await res.json();
      setAlumnos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlumnos();
  }, []);

  const alumnosFiltrados = alumnos.filter((alumno) => {
    // Filtro por búsqueda
    const coincideBusqueda = 
      alumno.nombre_completo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      alumno.numero_control?.toLowerCase().includes(busqueda.toLowerCase());
    
    // Filtro por estado
    let coincideEstado = true;
    if (estadoFiltro === "activos") coincideEstado = !alumno.bloqueado;
    if (estadoFiltro === "sancionados") coincideEstado = alumno.bloqueado;

    // Filtro por fechas
    let coincideFecha = true;
    if (fechaInicio && fechaFin) {
      const fechaRegistro = new Date(alumno.fecha_registro);
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59); // Incluir todo el día final
      coincideFecha = fechaRegistro >= inicio && fechaRegistro <= fin;
    } else if (fechaInicio) {
      const fechaRegistro = new Date(alumno.fecha_registro);
      const inicio = new Date(fechaInicio);
      coincideFecha = fechaRegistro >= inicio;
    } else if (fechaFin) {
      const fechaRegistro = new Date(alumno.fecha_registro);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59);
      coincideFecha = fechaRegistro <= fin;
    }

    return coincideBusqueda && coincideEstado && coincideFecha;
  });

  const cambiarEstadoAlumno = async (id, bloquear) => {
    try {
      const action = bloquear ? "bloquear" : "desbloquear";
      const res = await fetch(`/api/auth/alumnos/${id}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Error al cambiar estado del alumno");
      cargarAlumnos();
    } catch (err) {
      alert(err.message);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Header institucional
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Centro de Estudios Tecnológicos Industrial y de Servicios", doc.internal.pageSize.width / 2, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text("Reporte de Alumnos", doc.internal.pageSize.width / 2, 25, { align: 'center' });
    
    let subtitle = `Estado: ${estadoFiltro.charAt(0).toUpperCase() + estadoFiltro.slice(1)}`;
    if (fechaInicio && fechaFin) {
      subtitle += ` | Fechas: ${fechaInicio} a ${fechaFin}`;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(subtitle, doc.internal.pageSize.width / 2, 32, { align: 'center' });

    const head = [["No. Control", "Nombre Completo", "Especialidad", "Fecha Registro", "Estado"]];
    const body = alumnosFiltrados.map(a => [
      a.numero_control || "N/A",
      a.nombre_completo,
      `${a.especialidad || "N/A"} - ${a.grado || "-"} ${a.grupo || "-"}`,
      new Date(a.fecha_registro).toLocaleDateString(),
      a.bloqueado ? "Sancionado" : "Activo"
    ]);

    autoTable(doc, {
      head: head,
      body: body,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [105, 28, 50] }, // Color #691C32
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.text(`Total de alumnos en reporte: ${alumnosFiltrados.length}`, 14, doc.internal.pageSize.height - 10);
      }
    });

    doc.save(`Reporte_Alumnos_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <div className="topbar">
          <div>
            <h1><FaUserGraduate /> Gestión de Alumnos</h1>
            <p>Consulta, filtra y genera reportes de los alumnos registrados.</p>
          </div>
          <div className="topbar-right" style={{ display: "flex", alignItems: "center" }}>
            <LogoutButton />
          </div>
        </div>

        <div className="table-section">
          <div className="table-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Base de Datos de Alumnos</h2>
              <button onClick={generarPDF} style={{ padding: '10px 15px', background: '#0A1F44', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <FaFilePdf /> Generar Reporte PDF
              </button>
            </div>

            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', backgroundColor: '#fdfbf7', padding: '15px', borderRadius: '10px', border: '1px solid #e2d5c1' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#691C32', marginBottom: '5px', display: 'block' }}>Buscar</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', border: '1px solid #ddd', padding: '5px 10px' }}>
                  <FaSearch style={{ color: '#888' }} />
                  <input
                    type="text"
                    placeholder="Nombre o No. Control..."
                    style={{ background: 'transparent', border: 'none', outline: 'none', padding: '5px 10px', width: '100%' }}
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  {busqueda && <FaTimes style={{ cursor: 'pointer', color: '#888' }} onClick={() => setBusqueda("")} />}
                </div>
              </div>

              <div style={{ minWidth: '150px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#691C32', marginBottom: '5px', display: 'block' }}>Estado</label>
                <select 
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                >
                  <option value="todos">Todos</option>
                  <option value="activos">Activos</option>
                  <option value="sancionados">Sancionados</option>
                </select>
              </div>

              <div style={{ minWidth: '150px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#691C32', marginBottom: '5px', display: 'block' }}>Desde (Registro)</label>
                <input 
                  type="date"
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div style={{ minWidth: '150px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#691C32', marginBottom: '5px', display: 'block' }}>Hasta (Registro)</label>
                <input 
                  type="date"
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none' }}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '20px' }}>Cargando alumnos...</p>
            ) : error ? (
              <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</p>
            ) : alumnosFiltrados.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No se encontraron alumnos con los filtros actuales.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>No. Control</th>
                    <th>Nombre Completo</th>
                    <th>Especialidad</th>
                    <th>Registro</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosFiltrados.map((alumno, index) => (
                    <tr key={alumno.id_usuario}>
                      <td>{index + 1}</td>
                      <td style={{ fontWeight: 'bold' }}>{alumno.numero_control || "—"}</td>
                      <td>{alumno.nombre_completo}</td>
                      <td>{alumno.especialidad ? \`\${alumno.especialidad} (\${alumno.grado || "-"} \${alumno.grupo || "-"})\` : "—"}</td>
                      <td>{new Date(alumno.fecha_registro).toLocaleDateString()}</td>
                      <td>
                        {alumno.bloqueado ? (
                          <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaBan /> Sancionado</span>
                        ) : (
                          <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><FaCheckCircle /> Activo</span>
                        )}
                      </td>
                      <td>
                        {alumno.bloqueado ? (
                          <button onClick={() => cambiarEstadoAlumno(alumno.id_usuario, false)} style={{ background: '#10B981', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Desbloquear</button>
                        ) : (
                          <button onClick={() => cambiarEstadoAlumno(alumno.id_usuario, true)} style={{ background: '#EF4444', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Sancionar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && alumnosFiltrados.length > 0 && (
            <div className="inv-tabla-footer" style={{ marginTop: '15px' }}>
              <span>Mostrando {alumnosFiltrados.length} de {alumnos.length} alumnos registrados</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Alumnos;