import { useState } from "react";
import "../App.css";
import SidebarMateriales from "../componentes/SidebarMateriales";
import LogoutButton from "../componentes/LogoutButton";
import { FaCalendarAlt, FaSave, FaEraser, FaFilePdf, FaPlus, FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ReportesMateriales() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [dynamicData, setDynamicData] = useState([]);
  const [customRows, setCustomRows] = useState([]);

  const [institucion, setInstitucion] = useState("Centro de Estudios Tecnológicos Industrial y de Servicios");
  const [turno, setTurno] = useState("Turno Matutino");
  const [elaboradoPor, setElaboradoPor] = useState("");

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/api/reportes/dinamico?mes=${selectedMonth}&tipo=Material`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDynamicData(Array.isArray(data) ? data : []);
        } else {
          setDynamicData([]);
        }
      } catch (error) {
        console.error("Error fetching dynamic report", error);
      }
    };
    if (selectedMonth) {
      fetchDynamicData();
    }
  }, [selectedMonth]);

  const handleLimpiar = () => {
    setCustomRows([]);
  };

  const handleAddCustomRow = () => {
    setCustomRows([...customRows, { id: Date.now(), nombre: "", ah: 0, am: 0, dh: 0, dm: 0 }]);
  };

  const handleCustomRowChange = (id, field, value) => {
    setCustomRows(customRows.map(row => {
      if (row.id === id) {
        if (field === 'nombre') {
          return { ...row, nombre: value };
        } else {
          const val = value === "" ? "" : parseInt(value) || 0;
          return { ...row, [field]: val };
        }
      }
      return row;
    }));
  };

  const handleRemoveCustomRow = (id) => {
    setCustomRows(customRows.filter(row => row.id !== id));
  };

  const handleGuardar = () => {
    alert("Reporte guardado con éxito.");
  };

  const handlePDF = () => {
    const doc = new jsPDF();
    
    // Header institucional
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(institucion, doc.internal.pageSize.width / 2, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(turno, doc.internal.pageSize.width / 2, 22, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`Reporte Mensual de Materiales - ${selectedMonth}`, doc.internal.pageSize.width / 2, 32, { align: 'center' });
    
    // Preparar los datos manualmente para asegurar que los valores de los inputs se exporten
    const head = [
      [
        { content: 'Actividad / Artículo', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
        { content: 'Alumnos', colSpan: 2, styles: { halign: 'center' } },
        { content: 'Docentes', colSpan: 2, styles: { halign: 'center' } },
        { content: 'Total (Suma)', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }
      ],
      [
        { content: 'Hombres', styles: { halign: 'center', fillColor: [139, 43, 69] } },
        { content: 'Mujeres', styles: { halign: 'center', fillColor: [139, 43, 69] } },
        { content: 'Hombres', styles: { halign: 'center', fillColor: [139, 43, 69] } },
        { content: 'Mujeres', styles: { halign: 'center', fillColor: [139, 43, 69] } }
      ]
    ];

    const body = dynamicData.map(item => [
      `${item.nombre}`,
      item.ah, item.am, item.dh, item.dm,
      getTotalFila(item)
    ]);
    
    // Agregar datos custom
    customRows.forEach(row => {
      body.push([
        row.nombre || 'Sin nombre',
        row.ah, row.am, row.dh, row.dm,
        getTotalFila(row)
      ]);
    });

    // Agregar fila de totales
    const foot = [[
      'TOTAL GENERAL',
      totalAh, totalAm, totalDh, totalDm,
      totalGeneral
    ]];

    autoTable(doc, {
      head: head,
      body: body,
      foot: foot,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [105, 28, 50] }, // Color #691C32
      footStyles: { fillColor: [253, 251, 247], textColor: [105, 28, 50], fontStyle: 'bold' },
      didDrawPage: function (data) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.text(`Elaborado por: ${elaboradoPor}`, 14, doc.internal.pageSize.height - 15);
      }
    });

    doc.save(`Reporte_Materiales_${selectedMonth}.pdf`);
  };

  // Helper para convertir el valor del estado a numero seguro
  const getSafeNum = (val) => {
    return parseInt(val) || 0;
  };

  // Helper para fila total
  const getTotalFila = (act) => {
    return getSafeNum(act.ah) + getSafeNum(act.am) + getSafeNum(act.dh) + getSafeNum(act.dm);
  };

  // Totales de columnas dinámicas + custom
  const totalAh = 
    (Array.isArray(dynamicData) ? dynamicData : []).reduce((acc, curr) => acc + getSafeNum(curr?.ah), 0) + 
    (Array.isArray(customRows) ? customRows : []).reduce((acc, curr) => acc + getSafeNum(curr?.ah), 0);
  
  const totalAm = 
    (Array.isArray(dynamicData) ? dynamicData : []).reduce((acc, curr) => acc + getSafeNum(curr?.am), 0) + 
    (Array.isArray(customRows) ? customRows : []).reduce((acc, curr) => acc + getSafeNum(curr?.am), 0);
    
  const totalDh = 
    (Array.isArray(dynamicData) ? dynamicData : []).reduce((acc, curr) => acc + getSafeNum(curr?.dh), 0) + 
    (Array.isArray(customRows) ? customRows : []).reduce((acc, curr) => acc + getSafeNum(curr?.dh), 0);
    
  const totalDm = 
    (Array.isArray(dynamicData) ? dynamicData : []).reduce((acc, curr) => acc + getSafeNum(curr?.dm), 0) + 
    (Array.isArray(customRows) ? customRows : []).reduce((acc, curr) => acc + getSafeNum(curr?.dm), 0);
    
  const totalGeneral = totalAh + totalAm + totalDh + totalDm;

  return (
    <div className="dashboard">
      <SidebarMateriales />
      <main className="main-content">
        
        {/* Header y Acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 0, color: '#333', fontSize: 'calc(34px * var(--a11y-zoom, 1))', lineHeight: '1.3' }}>
              <FaCalendarAlt /> Reporte Mensual de Materiales
            </h1>
            <p style={{ margin: '5px 0 15px 0', color: '#666' }}>
              Registra las actividades realizadas por alumnos y docentes durante el mes seleccionado.
            </p>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: '15px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Mes</label>
                <input 
                  type="month" 
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '15px', backgroundColor: '#f9f9f9', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', minWidth: '180px' }}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '2', minWidth: '250px' }}>
                <label style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Institución</label>
                <input 
                  type="text" 
                  placeholder="Ej. Centro de Estudios..."
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '15px', backgroundColor: '#f9f9f9', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', width: '100%' }}
                  value={institucion}
                  onChange={(e) => setInstitucion(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1', minWidth: '150px' }}>
                <label style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Turno</label>
                <input 
                  type="text" 
                  placeholder="Ej. Turno Matutino"
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '15px', backgroundColor: '#f9f9f9', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', width: '100%' }}
                  value={turno}
                  onChange={(e) => setTurno(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: '1.5', minWidth: '180px' }}>
                <label style={{ fontSize: '12px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase' }}>Elaborado Por</label>
                <input 
                  type="text" 
                  placeholder="Nombre de encargada..."
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '15px', backgroundColor: '#f9f9f9', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)', width: '100%' }}
                  value={elaboradoPor}
                  onChange={(e) => setElaboradoPor(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '10px' }}>
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
              {Array.isArray(dynamicData) && dynamicData.length > 0 ? dynamicData.map((item, index) => (
                <RowItemDinamico key={index} item={item} getTotalFila={getTotalFila} />
              )) : (
                <tr>
                  <td colSpan="6" style={{ padding: '20px' }}>No hay préstamos registrados este mes.</td>
                </tr>
              )}
              {Array.isArray(customRows) && customRows.map(row => (
                <RowItemCustom 
                  key={row.id} 
                  row={row} 
                  handleRemoveCustomRow={handleRemoveCustomRow}
                  handleCustomRowChange={handleCustomRowChange}
                  getTotalFila={getTotalFila} 
                />
              ))}
              <tr>
                <td colSpan="6" style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' }}>
                  <button 
                    onClick={handleAddCustomRow} 
                    style={{ ...styles.btn, backgroundColor: '#f0f0f0', color: '#691C32', margin: '0 auto' }}
                  >
                    <FaPlus /> Agregar fila manual
                  </button>
                </td>
              </tr>

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

const RowItemDinamico = ({ item, getTotalFila }) => {
  return (
    <tr>
      <td style={styles.tdLabel}>{item?.nombre || ''}</td>
      <td style={styles.tdInput}>{item?.ah || 0}</td>
      <td style={styles.tdInput}>{item?.am || 0}</td>
      <td style={styles.tdInput}>{item?.dh || 0}</td>
      <td style={styles.tdInput}>{item?.dm || 0}</td>
      <td style={styles.tdTotalRow}>{getTotalFila(item)}</td>
    </tr>
  );
};

const RowItemCustom = ({ row, handleRemoveCustomRow, handleCustomRowChange, getTotalFila }) => {
  return (
    <tr>
      <td style={styles.tdLabel}>
        <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
          <button 
            onClick={() => handleRemoveCustomRow(row.id)} 
            style={{background: 'transparent', border: 'none', color: '#d33', cursor: 'pointer', padding: '5px'}}
            title="Eliminar fila"
          >
            <FaTrash />
          </button>
          <input 
            type="text" 
            placeholder="Nombre del material..." 
            style={{...styles.input, width: '100%', textAlign: 'left'}} 
            value={row.nombre} 
            onChange={(e) => handleCustomRowChange(row.id, 'nombre', e.target.value)} 
          />
        </div>
      </td>
      <td style={styles.tdInput}>
        <input type="number" style={styles.input} value={row.ah} onChange={(e) => handleCustomRowChange(row.id, 'ah', e.target.value)} />
      </td>
      <td style={styles.tdInput}>
        <input type="number" style={styles.input} value={row.am} onChange={(e) => handleCustomRowChange(row.id, 'am', e.target.value)} />
      </td>
      <td style={styles.tdInput}>
        <input type="number" style={styles.input} value={row.dh} onChange={(e) => handleCustomRowChange(row.id, 'dh', e.target.value)} />
      </td>
      <td style={styles.tdInput}>
        <input type="number" style={styles.input} value={row.dm} onChange={(e) => handleCustomRowChange(row.id, 'dm', e.target.value)} />
      </td>
      <td style={styles.tdTotalRow}>{getTotalFila(row)}</td>
    </tr>
  );
};

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

export default ReportesMateriales;
