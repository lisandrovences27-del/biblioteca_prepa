import { useState } from "react";
import "../App.css";
import Sidebar from "../componentes/Sidebar";
import LogoutButton from "../componentes/LogoutButton";
import { FaCalendarAlt, FaSave, FaEraser, FaFilePdf } from "react-icons/fa";
import { useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ReportesBiblioteca() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const initialManualData = {
    ajedrez: { ah: 0, am: 0, dh: 0, dm: 0 },
    clasesImpartidas: { ah: 0, am: 0, dh: 0, dm: 0 }
  };

  const [manualData, setManualData] = useState(initialManualData);
  const [dynamicData, setDynamicData] = useState([]);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/reportes/dinamico?mes=${selectedMonth}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDynamicData(data);
        }
      } catch (error) {
        console.error("Error fetching dynamic report", error);
      }
    };
    if (selectedMonth) {
      fetchDynamicData();
    }
  }, [selectedMonth]);

  const handleInputChange = (actividad, campo, valor) => {
    // Si esta vacio, lo manejamos como string vacio para que no marque error,
    // pero al sumar lo tratamos como 0.
    const val = valor === "" ? "" : parseInt(valor) || 0;
    setManualData((prev) => ({
      ...prev,
      [actividad]: {
        ...prev[actividad],
        [campo]: val
      }
    }));
  };

  const handleLimpiar = () => {
    setManualData(initialManualData);
  };

  const handleGuardar = () => {
    alert("Reporte guardado con éxito.");
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    doc.text(`Reporte Mensual de Biblioteca - ${selectedMonth}`, 14, 20);
    
    doc.autoTable({
      html: '#tabla-reporte-biblio',
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [105, 28, 50] } // Color #691C32
    });

    doc.save(`Reporte_Biblioteca_${selectedMonth}.pdf`);
  };

  // Helper para convertir el valor del estado a numero seguro
  const getSafeNum = (val) => {
    return parseInt(val) || 0;
  };

  // Helper para fila total
  const getTotalFila = (act) => {
    return getSafeNum(act.ah) + getSafeNum(act.am) + getSafeNum(act.dh) + getSafeNum(act.dm);
  };

  // Totales de columnas dinámicas + manuales
  const totalAh = 
    dynamicData.reduce((acc, curr) => acc + getSafeNum(curr.ah), 0) + 
    Object.values(manualData).reduce((acc, curr) => acc + getSafeNum(curr.ah), 0);
  
  const totalAm = 
    dynamicData.reduce((acc, curr) => acc + getSafeNum(curr.am), 0) + 
    Object.values(manualData).reduce((acc, curr) => acc + getSafeNum(curr.am), 0);
    
  const totalDh = 
    dynamicData.reduce((acc, curr) => acc + getSafeNum(curr.dh), 0) + 
    Object.values(manualData).reduce((acc, curr) => acc + getSafeNum(curr.dh), 0);
    
  const totalDm = 
    dynamicData.reduce((acc, curr) => acc + getSafeNum(curr.dm), 0) + 
    Object.values(manualData).reduce((acc, curr) => acc + getSafeNum(curr.dm), 0);
    
  const totalGeneral = totalAh + totalAm + totalDh + totalDm;

  const RowItemManual = ({ label, objectKey }) => {
    return (
      <tr>
        <td style={styles.tdLabel}>{label}<br/><span style={{fontSize:'10px', color:'#888'}}>(Manual)</span></td>
        <td style={styles.tdInput}>
          <input 
            type="number" 
            style={styles.input} 
            value={manualData[objectKey].ah} 
            onChange={(e) => handleInputChange(objectKey, 'ah', e.target.value)} 
          />
        </td>
        <td style={styles.tdInput}>
          <input 
            type="number" 
            style={styles.input} 
            value={manualData[objectKey].am} 
            onChange={(e) => handleInputChange(objectKey, 'am', e.target.value)} 
          />
        </td>
        <td style={styles.tdInput}>
          <input 
            type="number" 
            style={styles.input} 
            value={manualData[objectKey].dh} 
            onChange={(e) => handleInputChange(objectKey, 'dh', e.target.value)} 
          />
        </td>
        <td style={styles.tdInput}>
          <input 
            type="number" 
            style={styles.input} 
            value={manualData[objectKey].dm} 
            onChange={(e) => handleInputChange(objectKey, 'dm', e.target.value)} 
          />
        </td>
        <td style={styles.tdTotalRow}>{getTotalFila(manualData[objectKey])}</td>
      </tr>
    );
  };

  const RowItemDinamico = ({ item }) => {
    return (
      <tr>
        <td style={styles.tdLabel}>{item.nombre}<br/><span style={{fontSize:'10px', color:'#888'}}>(Automático)</span></td>
        <td style={styles.tdInput}>{item.ah}</td>
        <td style={styles.tdInput}>{item.am}</td>
        <td style={styles.tdInput}>{item.dh}</td>
        <td style={styles.tdInput}>{item.dm}</td>
        <td style={styles.tdTotalRow}>{getTotalFila(item)}</td>
      </tr>
    );
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        
        {/* Header y Acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, color: '#333' }}>
              <FaCalendarAlt /> Reporte Mensual de Actividades
            </h1>
            <p style={{ margin: '5px 0 15px 0', color: '#666' }}>
              Registra las actividades realizadas por alumnos y docentes durante el mes seleccionado.
            </p>
            <input 
              type="month" 
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button style={{ ...styles.btn, backgroundColor: '#691C32', color: 'white' }} onClick={handleGuardar}>
              <FaSave /> Guardar
            </button>
            <button style={{ ...styles.btn, backgroundColor: '#e2d5c1', color: '#333' }} onClick={handleLimpiar}>
              <FaEraser /> Limpiar
            </button>
            <button style={{ ...styles.btn, backgroundColor: '#0A1F44', color: 'white' }} onClick={handlePDF}>
              <FaFilePdf /> Generar PDF
            </button>
            <LogoutButton />
          </div>
        </div>

        {/* Tabla */}
        <div style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <table id="tabla-reporte-biblio" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr>
                <th rowSpan="2" style={{ ...styles.thMain, width: '20%' }}>Actividad / Artículo</th>
                <th colSpan="2" style={styles.thMain}>Alumnos</th>
                <th colSpan="2" style={styles.thMain}>Docentes</th>
                <th rowSpan="2" style={styles.thMain}>Total<br/><span style={{fontSize: '12px', fontWeight: 'normal'}}>(Suma)</span></th>
              </tr>
              <tr>
                <th style={styles.thSub}>Hombres ♂</th>
                <th style={styles.thSub}>Mujeres ♀</th>
                <th style={styles.thSub}>Hombres ♂</th>
                <th style={styles.thSub}>Mujeres ♀</th>
              </tr>
            </thead>
            <tbody>
              {dynamicData.length > 0 ? dynamicData.map((item, index) => (
                <RowItemDinamico key={index} item={item} />
              )) : (
                <tr>
                  <td colSpan="6" style={{ padding: '20px' }}>No hay préstamos registrados este mes.</td>
                </tr>
              )}
              <RowItemManual label="Ajedrez" objectKey="ajedrez" />
              <RowItemManual label="Clases impartidas" objectKey="clasesImpartidas" />
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#fdfbf7' }}>
                <td style={{ ...styles.tdFooter, color: '#691C32' }}>TOTAL GENERAL</td>
                <td style={styles.tdFooter}>
                  <div style={styles.footerNumber}>{totalAh}</div>
                  <div style={styles.footerLabel}>Alumnos Hombres</div>
                </td>
                <td style={styles.tdFooter}>
                  <div style={styles.footerNumber}>{totalAm}</div>
                  <div style={styles.footerLabel}>Alumnos Mujeres</div>
                </td>
                <td style={styles.tdFooter}>
                  <div style={styles.footerNumber}>{totalDh}</div>
                  <div style={styles.footerLabel}>Docentes Hombres</div>
                </td>
                <td style={styles.tdFooter}>
                  <div style={styles.footerNumber}>{totalDm}</div>
                  <div style={styles.footerLabel}>Docentes Mujeres</div>
                </td>
                <td style={{ ...styles.tdFooter, color: '#691C32' }}>
                  <div style={{ ...styles.footerNumber, color: '#691C32' }}>{totalGeneral}</div>
                  <div style={styles.footerLabel}>Total General</div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </main>
    </div>
  );
}

const styles = {
  btn: {
    padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', transition: 'opacity 0.2s'
  },
  thMain: {
    backgroundColor: '#691C32', color: 'white', padding: '15px', border: '1px solid #7a223a', fontWeight: 'bold'
  },
  thSub: {
    backgroundColor: '#8b2b45', color: 'white', padding: '10px', border: '1px solid #7a223a', fontWeight: 'normal', fontSize: '14px'
  },
  tdLabel: {
    padding: '15px', textAlign: 'left', borderBottom: '1px solid #eee', color: '#444'
  },
  tdInput: {
    padding: '15px', borderBottom: '1px solid #eee', borderLeft: '1px solid #f5f5f5'
  },
  tdTotalRow: {
    padding: '15px', borderBottom: '1px solid #eee', borderLeft: '1px solid #f5f5f5',
    backgroundColor: '#fdfbf7', fontWeight: 'bold', color: '#8b2b45', fontSize: '16px'
  },
  input: {
    width: '60px', padding: '8px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px',
    outline: 'none', color: '#555'
  },
  tdFooter: {
    padding: '20px 10px', borderTop: '2px solid #e2d5c1', borderRight: '1px solid #f5f5f5', fontWeight: 'bold'
  },
  footerNumber: {
    fontSize: '24px', marginBottom: '5px', color: '#333'
  },
  footerLabel: {
    fontSize: '12px', color: '#666', fontWeight: 'normal'
  }
};

export default ReportesBiblioteca;
