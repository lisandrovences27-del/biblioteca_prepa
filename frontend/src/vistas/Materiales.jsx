import "../App.css";
import SidebarMateriales from "../componentes/SidebarMateriales";
import LogoutButton from "../componentes/LogoutButton";
import { useState, useEffect } from "react";

import {
  FaBoxOpen,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

function Materiales() {
  const [materiales, setMateriales] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  const [materialEditar, setMaterialEditar] = useState(null);
  const [materialEliminar, setMaterialEliminar] = useState(null);

  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    especificaciones: "",
    stock_total: "",
    stock_disponible: "",
    codigo_interno: "",
    imagen: "",
  });

  const getToken = () => localStorage.getItem("token");

  // Cargar ateriales 
 const cargarMateriales = async () => {
  try {
    setLoading(true);

    const res = await fetch("/api/materiales", {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) throw new Error("Error al cargar materiales");
    const data = await res.json();
    setMateriales(data);
  } catch (err) {
    console.error(err);

    setError("No se pudieron cargar los materiales.");

  } finally {

    setLoading(false);

  }
};

  useEffect(() => {
    cargarMateriales();
  }, []);

  // Limpiar mensajes después de 4 segundos
  useEffect(() => {
    if (exito || error) {
      const timer = setTimeout(() => {
        setExito("");
        setError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [exito, error]);

  // Filtrar libros por búsqueda
const materialesFiltrados = materiales.filter(
  (material) =>
    material.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    material.codigo_interno?.toLowerCase().includes(busqueda.toLowerCase()) ||
    material.especificaciones?.toLowerCase().includes(busqueda.toLowerCase()) 
);

  // Abrir modal para agregar
  const abrirModalAgregar = () => {
    setMaterialEditar(null);
    setForm({
      nombre: "",
      especificaciones: "",
      stock_total: "",
      stock_disponible: "",
      codigo_interno: "",
      imagen: "",
    });
    setModalAbierto(true);
  };

  // Abrir modal para editar
const abrirModalEditar=(material)=>{

    setMaterialEditar(material);

    setForm({

        nombre:material.nombre || "",
        especificaciones:material.especificaciones || "",
        stock_total:material.stock_total ?? "",
        stock_disponible:material.stock_disponible ?? "",
        codigo_interno:material.codigo_interno || "",
        imagen:material.imagen || ""

    });

    setModalAbierto(true);

};
const guardarMaterial = async(e)=>{

    e.preventDefault();

    if(!form.nombre || form.stock_total===""){

        setError("El nombre y stock total son obligatorios.");

        return;

    }

    try{

        const url = materialEditar
        ? `/api/materiales/${materialEditar.id_material}`
        : "/api/materiales";

        const method = materialEditar ? "PUT":"POST";

        const body={

            nombre:form.nombre,
            especificaciones:form.especificaciones || null,
            stock_total:parseInt(form.stock_total),
            codigo_interno:form.codigo_interno || null,
            imagen:form.imagen || null

        };

        if(materialEditar){

            body.stock_disponible=parseInt(form.stock_disponible);

        }

        const res=await fetch(url,{

            method,

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${getToken()}`
            },
            body:JSON.stringify(body)
        });
        if(!res.ok){
            const data=await res.json();
            throw new Error(data.error || "Error al guardar.");
        }

        setExito(
            materialEditar
            ? "Material actualizado correctamente."
            : "Material agregado correctamente."

        );

        setModalAbierto(false);
        cargarMateriales();

    }

    catch(err){

        setError(err.message);

    }

};
  // Confirmar eliminación
  const confirmarEliminar = (material) => {
    setMaterialEliminar(material);
    setModalEliminar(true);
  };
const eliminarMaterial=async()=>{
    try{
        const res=await fetch(
            `/api/materiales/${materialEliminar.id_material}`,
            {
                method:"DELETE",
                headers:{
                    Authorization:`Bearer ${getToken()}`
                }
            }
        );
        if(!res.ok){
            const data=await res.json();
            throw new Error(data.error);
        }
        setExito("Material eliminado correctamente.");
        setModalEliminar(false);
        setMaterialEliminar(null);
        cargarMateriales();
    }
    catch(err){
        setError(err.message);
    }
};

  const getStockBadge=(disponible,total)=>{
    const porcentaje=total>0
        ? (disponible/total)*100
        :0;
    if(porcentaje===0){
        return <span className="status inv-agotado">Agotado</span>;
    }
    if(porcentaje<=30){
        return <span className="status inv-bajo">Bajo</span>;
    }
    return <span className="status inv-disponible">Disponible</span>;
};

const totalMateriales=materiales.length;
const totalEjemplares=materiales.reduce(
(sum,m)=>sum+(m.stock_total ||0),0
);
const totalDisponibles=materiales.reduce(
(sum,m)=>sum+(m.stock_disponible ||0),0
);
const totalPrestados=totalEjemplares-totalDisponibles;

return (
  <div className="dashboard">

    <SidebarMateriales />

    <main className="main-content">

      {/* ================= TOPBAR ================= */}

      <div className="topbar">

        <div>

          <h1>
            <FaBoxOpen /> Inventario de Materiales
          </h1>

          <p>
            Gestiona el inventario y stock de materiales de la biblioteca.
          </p>

        </div>

        <div
          className="topbar-right"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <button
            className="inv-btn-agregar"
            onClick={abrirModalAgregar}
          >
            <FaPlus />
            Agregar Material
          </button>

          <LogoutButton />

        </div>

      </div>

      {/* ================= MENSAJES ================= */}

      {exito && (
        <div className="inv-mensaje inv-mensaje-exito">
          {exito}
        </div>
      )}

      {error && (
        <div className="inv-mensaje inv-mensaje-error">
          {error}
        </div>
      )}

      {/* ================= RESUMEN ================= */}

      <div className="inv-resumen-grid">

        <div className="inv-resumen-card">

          <div className="inv-resumen-icono inv-icono-total">
            <FaBoxOpen />
          </div>

          <div>

            <p className="inv-resumen-label">
              Total Materiales
            </p>

            <h3 className="inv-resumen-valor">
              {totalMateriales}
            </h3>

          </div>

        </div>

        <div className="inv-resumen-card">

          <div className="inv-resumen-icono inv-icono-ejemplares">
            <FaBoxOpen />
          </div>

          <div>

            <p className="inv-resumen-label">
              Existencias
            </p>

            <h3 className="inv-resumen-valor">
              {totalEjemplares}
            </h3>

          </div>

        </div>

        <div className="inv-resumen-card">

          <div className="inv-resumen-icono inv-icono-disponibles">
            <FaBoxOpen />
          </div>

          <div>

            <p className="inv-resumen-label">
              Disponibles
            </p>

            <h3 className="inv-resumen-valor">
              {totalDisponibles}
            </h3>

          </div>

        </div>

        <div className="inv-resumen-card">

          <div className="inv-resumen-icono inv-icono-prestados">
            <FaExclamationTriangle />
          </div>

          <div>

            <p className="inv-resumen-label">
              Prestados
            </p>

            <h3 className="inv-resumen-valor">
              {totalPrestados}
            </h3>

          </div>

        </div>

      </div>

      {/* ================= TABLA ================= */}

      <div className="table-section">

        <div className="table-header">

          <h2>
            Base de Datos de Materiales
          </h2>

          <div className="inv-buscador-container">

            <FaSearch className="inv-buscador-icono" />

            <input
              type="text"
              className="inv-buscador"
              placeholder="Buscar por nombre, código o especificaciones..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {busqueda && (

              <FaTimes
                className="inv-buscador-limpiar"
                onClick={() => setBusqueda("")}
              />

            )}

          </div>

        </div>

        <div className="table-container">

          {loading ? (

            <div className="inv-loading">

              <div className="inv-spinner"></div>

              <p>
                Cargando materiales...
              </p>

            </div>

          ) : materialesFiltrados.length === 0 ? (

            <div className="inv-vacio">

              <FaBoxOpen className="inv-vacio-icono" />

              <p>

                {busqueda

                  ? "No se encontraron materiales."

                  : "No hay materiales registrados."}

              </p>

            </div>

          ) : (

            <table id="tabla-inventario">

              <thead>

                <tr>

                  <th>#</th>

                  <th>Código</th>

                  <th>Material</th>

                  <th>Especificaciones</th>

                  <th>Disponibles</th>

                  <th>Prestados</th>

                  <th>Estado</th>

                  <th>Acciones</th>

                </tr>

              </thead>

              <tbody>

                {materialesFiltrados.map((material, index) => (

                  <tr key={material.id_material}>

                    <td className="inv-td-num">

                      {index + 1}

                    </td>

                    <td>

                      <span className="inv-codigo">

                        {material.codigo_interno || "—"}

                      </span>

                    </td>

                    <td className="inv-td-nombre">

                      <div className="inv-nombre-wrap">

                        <FaBoxOpen className="inv-nombre-icono" />

                        {material.nombre}

                      </div>

                    </td>

                    <td className="inv-td-specs">

                      {material.especificaciones || "Sin especificaciones"}

                    </td>

                    <td className="inv-td-center">

                      {material.stock_disponible} / {material.stock_total}

                    </td>

                    <td className="inv-td-center">

                      {material.prestados || 0}

                    </td>

                    <td>

                      {getStockBadge(
                        material.stock_disponible,
                        material.stock_total
                      )}

                    </td>

                    <td>

                      <div className="inv-acciones">

                        <button
                          className="inv-btn-editar"
                          title="Editar"
                          onClick={() => abrirModalEditar(material)}
                        >

                          <FaEdit />

                        </button>

                        <button
                          className="inv-btn-eliminar"
                          title="Eliminar"
                          onClick={() => confirmarEliminar(material)}
                        >

                          <FaTrash />

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {!loading && materialesFiltrados.length > 0 && (

          <div className="inv-tabla-footer">

            Mostrando {materialesFiltrados.length} de {materiales.length} materiales

          </div>

        )}

      </div>

            
            

      {/* ================= MODAL AGREGAR / EDITAR ================= */}

      {modalAbierto && (
        <div
          className="inv-modal-overlay"
          onClick={() => setModalAbierto(false)}
        >
          <div
            className="inv-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inv-modal-header">

              <h2>
                {materialEditar
                  ? "Editar Material"
                  : "Agregar Nuevo Material"}
              </h2>

              <button
                className="inv-modal-cerrar"
                onClick={() => setModalAbierto(false)}
              >
                <FaTimes />
              </button>

            </div>

            <form
              onSubmit={guardarMaterial}
              className="inv-modal-form"
            >

              <div className="inv-form-grupo">

                <label>Nombre del Material *</label>

                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nombre: e.target.value,
                    })
                  }
                  required
                />

              </div>

              <div className="inv-form-grupo">

                <label>Especificaciones</label>

                <textarea
                  rows="3"
                  value={form.especificaciones}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      especificaciones: e.target.value,
                    })
                  }
                />

              </div>

              <div className="inv-form-fila">

                <div className="inv-form-grupo">

                  <label>Stock Total *</label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock_total}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        stock_total: e.target.value,
                      })
                    }
                    required
                  />

                </div>

                {materialEditar && (

                  <div className="inv-form-grupo">

                    <label>Stock Disponible</label>

                    <input
                      type="number"
                      min="0"
                      value={form.stock_disponible}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          stock_disponible: e.target.value,
                        })
                      }
                    />

                  </div>

                )}

              </div>

              <div className="inv-form-fila">

                <div className="inv-form-grupo">

                  <label>Código Interno</label>

                  <input
                    type="text"
                    value={form.codigo_interno}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        codigo_interno: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="inv-modal-acciones">

                <button
                  type="button"
                  className="inv-btn-cancelar"
                  onClick={() => setModalAbierto(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inv-btn-guardar"
                >
                  {materialEditar
                    ? "Guardar Cambios"
                    : "Agregar Material"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL ELIMINAR ================= */}

      {modalEliminar && (

        <div
          className="inv-modal-overlay"
          onClick={() => setModalEliminar(false)}
        >

          <div
            className="inv-modal inv-modal-eliminar"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="inv-eliminar-icono">
              <FaExclamationTriangle />
            </div>

            <h2>
              ¿Eliminar este material?
            </h2>

            <p className="inv-eliminar-nombre">
              "{materialEliminar?.nombre}"
            </p>

            <p className="inv-eliminar-aviso">
              Esta acción no se puede deshacer.
            </p>

            <div className="inv-modal-acciones">

              <button
                className="inv-btn-cancelar"
                onClick={() => setModalEliminar(false)}
              >
                Cancelar
              </button>

              <button
                className="inv-btn-confirmar-eliminar"
                onClick={eliminarMaterial}
              >
                Sí, eliminar
              </button>

            </div>

          </div>

        </div>

      )}

    </main>

  </div>

);

}

export default Materiales;