import "../App.css";
import Sidebar from "../componentes/Sidebar";
import {
  FaBook,
  FaUserGraduate,
  FaExclamationTriangle,
  FaChartBar,
  FaDownload,
  FaFilePdf,
  FaFileExcel,
  FaSearch,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";

// Mock Data
const statsGenerales = {
  totalPrestamos: 1450,
  librosRegistrados: 3200,
  alumnosActivos: 185,
  prestamosVencidos: 12
};

const datosGrafica = [
  { mes: "Ene", valor: 65, max: 150 },
  { mes: "Feb", valor: 85, max: 150 },
  { mes: "Mar", valor: 120, max: 150 },
  { mes: "Abr", valor: 90, max: 150 },
  { mes: "May", valor: 140, max: 150 },
  { mes: "Jun", valor: 110, max: 150 },
  { mes: "Jul", valor: 40, max: 150 },
  { mes: "Ago", valor: 70, max: 150 },
  { mes: "Sep", valor: 130, max: 150 },
  { mes: "Oct", valor: 145, max: 150 },
  { mes: "Nov", valor: 125, max: 150 },
  { mes: "Dic", valor: 95, max: 150 },
];

const librosTop = [
  { id: 1, libro: "Matemáticas I", autor: "A. Baldor", veces: 145 },
  { id: 2, libro: "Física General", autor: "Sears Zemansky", veces: 120 },
  { id: 3, libro: "Química Básica", autor: "Raymond Chang", veces: 95 },
  { id: 4, libro: "Biología Celular", autor: "Bruce Alberts", veces: 80 },
  { id: 5, libro: "Historia de México", autor: "F. Gómez", veces: 65 }
];

const alumnosTop = [
  { matricula: "22308001", nombre: "Juan Pérez", grupo: "3A Matutino", cantidad: 15 },
  { matricula: "22308045", nombre: "María López", grupo: "5B Vespertino", cantidad: 12 },
  { matricula: "22308112", nombre: "Carlos Ramírez", grupo: "1C Matutino", cantidad: 10 },
  { matricula: "22308089", nombre: "Ana Gómez", grupo: "3A Matutino", cantidad: 9 },
  { matricula: "22308234", nombre: "Luis Martínez", grupo: "5A Vespertino", cantidad: 8 }
];

const retrasosAlertas = [
  { id: 1, alumno: "Roberto Sánchez", libro: "Cálculo Diferencial", dias: 5 },
  { id: 2, alumno: "Elena Torres", libro: "Física Cuántica", dias: 3 },
  { id: 3, alumno: "Miguel Ángel", libro: "Álgebra Lineal", dias: 1 }
];

function ReportesBiblioteca() {
  
  // Estilos en Línea Reutilizables (Para no depender de modificaciones en App.css)
  const btnActionStyle = {
    padding: "10px 18px", borderRadius: "10px", border: "none",
    display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold",
    cursor: "pointer", color: "white", fontSize: "14px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)", transition: "transform 0.2s"
  };

  const cardStyle = {
    backgroundColor: "white", borderRadius: "20px", padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #eee",
    display: "flex", flexDirection: "column"
  };

  const tableHeaderStyle = {
    padding: "15px", borderBottom: "2px solid #eee", textAlign: "left", color: "#555", backgroundColor: "#f9f9f9"
  };

  const tableCellStyle = {
    padding: "15px", borderBottom: "1px solid #eee", color: "#444", fontSize: "14px"
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main-content">
        
        {/* ===== ENCABEZADO Y ACCIONES ===== */}
        <div className="topbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1>Reportes de Biblioteca</h1>
            <p>Estadísticas y análisis de préstamos de libros</p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button style={{ ...btnActionStyle, backgroundColor: "#0A1F44" }} title="Generar reporte completo">
              <FaChartBar /> Generar Reporte
            </button>
            <button style={{ ...btnActionStyle, backgroundColor: "#691C32" }} title="Exportar a PDF">
              <FaFilePdf /> PDF
            </button>
            <button style={{ ...btnActionStyle, backgroundColor: "#059669" }} title="Exportar a Excel">
              <FaFileExcel /> Excel
            </button>
          </div>
        </div>

        {/* ===== TARJETAS ESTADÍSTICAS SUPERIORES ===== */}
        <div className="cards-container" style={{ marginTop: "30px" }}>
          
          <div className="dashboard-card blue-card">
            <div className="card-left">
              <div className="card-icon-circle" style={{ backgroundColor: "#0A1F44", color: "white" }}>
                <FaChartBar />
              </div>
              <div>
                <p className="card-title">Total Préstamos</p>
                <h2>{statsGenerales.totalPrestamos}</h2>
                <span className="card-info">Histórico acumulado</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card beige-card">
            <div className="card-left">
              <div className="card-icon-circle" style={{ backgroundColor: "#DDC9A3", color: "#691C32" }}>
                <FaBook />
              </div>
              <div>
                <p className="card-title">Libros Registrados</p>
                <h2>{statsGenerales.librosRegistrados}</h2>
                <span className="card-info">En el inventario</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card" style={{ backgroundColor: "#e0f2fe", border: "none", borderRadius: "20px", padding: "20px" }}>
            <div className="card-left">
              <div className="card-icon-circle" style={{ backgroundColor: "#0284c7", color: "white" }}>
                <FaUserGraduate />
              </div>
              <div>
                <p className="card-title" style={{ color: "#0c4a6e" }}>Alumnos Activos</p>
                <h2 style={{ color: "#0c4a6e" }}>{statsGenerales.alumnosActivos}</h2>
                <span className="card-info" style={{ color: "#0369a1" }}>Con préstamos actuales</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card red-card">
            <div className="card-left">
              <div className="card-icon-circle" style={{ backgroundColor: "#691C32", color: "white" }}>
                <FaExclamationTriangle />
              </div>
              <div>
                <p className="card-title">Préstamos Vencidos</p>
                <h2>{statsGenerales.prestamosVencidos}</h2>
                <span className="card-info" style={{ color: "#fca5a5" }}>Requieren atención</span>
              </div>
            </div>
          </div>

        </div>

        {/* ===== GRÁFICA PRINCIPAL (CSS PURO) ===== */}
        <div style={{ ...cardStyle, marginTop: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2 style={{ margin: 0, color: "#0B1742", display: "flex", alignItems: "center", gap: "10px" }}>
              <FaCalendarAlt /> Préstamos por mes
            </h2>
          </div>
          
          <div style={{ height: "250px", display: "flex", alignItems: "flex-end", gap: "2%", padding: "10px 0", borderBottom: "2px solid #eee", borderLeft: "2px solid #eee" }}>
            {datosGrafica.map((dato, idx) => {
              const alturaPorcentaje = (dato.valor / dato.max) * 100;
              return (
                <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", position: "relative", group: "chart-bar" }}>
                  
                  {/* Etiqueta Tooltip Simulada */}
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#691C32", marginBottom: "5px" }}>
                    {dato.valor}
                  </div>
                  
                  {/* Barra CSS */}
                  <div style={{ 
                    width: "100%", 
                    height: `${alturaPorcentaje}%`, 
                    background: "linear-gradient(to top, #0A1F44, #691C32)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease"
                  }}></div>
                  
                  {/* Etiqueta Mes */}
                  <div style={{ position: "absolute", bottom: "-30px", fontSize: "12px", color: "#666", fontWeight: "bold" }}>
                    {dato.mes}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: "40px", textAlign: "center", color: "#888", fontSize: "13px" }}>
            * Distribución de préstamos a lo largo del año (Datos Simulados)
          </div>
        </div>

        {/* ===== TABLAS DIVIDIDAS (2 COLUMNAS) ===== */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "30px", marginTop: "30px" }}>
          
          {/* TABLA: LIBROS MÁS SOLICITADOS */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "#0B1742", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaBook color="#DDC9A3" /> Libros más solicitados
              </h2>
            </div>

            {/* Buscador Visual */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
              <input
                type="text"
                placeholder="Buscar libro..."
                style={{ width: "100%", padding: "10px 10px 10px 40px", borderRadius: "10px", border: "1px solid #ddd", outline: "none", backgroundColor: "#f5f5f5", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Libro</th>
                    <th style={tableHeaderStyle}>Autor</th>
                    <th style={{...tableHeaderStyle, textAlign: "center"}}>Préstamos</th>
                  </tr>
                </thead>
                <tbody>
                  {librosTop.map((item, index) => (
                    <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "white" : "#fbfbfb" }}>
                      <td style={{...tableCellStyle, fontWeight: "bold"}}>{item.libro}</td>
                      <td style={tableCellStyle}>{item.autor}</td>
                      <td style={{...tableCellStyle, textAlign: "center", fontWeight: "bold", color: "#691C32"}}>
                        {item.veces}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLA: ALUMNOS CON MÁS PRÉSTAMOS */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "#0B1742", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
                <FaUserGraduate color="#0A1F44" /> Alumnos más activos
              </h2>
            </div>

            <div style={{ position: "relative", marginBottom: "20px" }}>
              <FaSearch style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#888" }} />
              <input
                type="text"
                placeholder="Buscar matrícula o nombre..."
                style={{ width: "100%", padding: "10px 10px 10px 40px", borderRadius: "10px", border: "1px solid #ddd", outline: "none", backgroundColor: "#f5f5f5", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Matrícula</th>
                    <th style={tableHeaderStyle}>Nombre</th>
                    <th style={tableHeaderStyle}>Grupo</th>
                    <th style={{...tableHeaderStyle, textAlign: "center"}}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnosTop.map((alumno, index) => (
                    <tr key={alumno.matricula} style={{ backgroundColor: index % 2 === 0 ? "white" : "#fbfbfb" }}>
                      <td style={tableCellStyle}>{alumno.matricula}</td>
                      <td style={{...tableCellStyle, fontWeight: "bold"}}>{alumno.nombre}</td>
                      <td style={{...tableCellStyle, color: "#888", fontSize: "12px"}}>{alumno.grupo}</td>
                      <td style={{...tableCellStyle, textAlign: "center", fontWeight: "bold", color: "#0A1F44"}}>
                        {alumno.cantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* ===== REPORTE DE RETRASOS (ALERTA DESTACADA) ===== */}
        <div style={{ ...cardStyle, marginTop: "30px", borderTop: "5px solid #991B1B", backgroundColor: "#fef2f2" }}>
          <h2 style={{ margin: 0, color: "#991B1B", fontSize: "20px", display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
            <FaExclamationTriangle /> Reporte de Retrasos Activos
          </h2>
          
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr>
                  <th style={{...tableHeaderStyle, backgroundColor: "#fca5a5", color: "#7f1d1d"}}>Alumno</th>
                  <th style={{...tableHeaderStyle, backgroundColor: "#fca5a5", color: "#7f1d1d"}}>Libro / Recurso</th>
                  <th style={{...tableHeaderStyle, backgroundColor: "#fca5a5", color: "#7f1d1d", textAlign: "center"}}>Días de Retraso</th>
                  <th style={{...tableHeaderStyle, backgroundColor: "#fca5a5", color: "#7f1d1d", textAlign: "center"}}>Acción Sugerida</th>
                </tr>
              </thead>
              <tbody>
                {retrasosAlertas.map((retraso, index) => (
                  <tr key={retraso.id} style={{ borderBottom: "1px solid #fee2e2" }}>
                    <td style={{...tableCellStyle, fontWeight: "bold"}}>{retraso.alumno}</td>
                    <td style={tableCellStyle}>{retraso.libro}</td>
                    <td style={{...tableCellStyle, textAlign: "center", fontWeight: "bold", color: "#dc2626"}}>
                      <FaClock style={{ marginRight: "5px" }}/> {retraso.dias} días
                    </td>
                    <td style={{...tableCellStyle, textAlign: "center"}}>
                      <button style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #dc2626", backgroundColor: "transparent", color: "#dc2626", fontWeight: "bold", cursor: "pointer" }}>
                        Enviar Notificación
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

export default ReportesBiblioteca;
