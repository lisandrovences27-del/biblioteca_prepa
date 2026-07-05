import { useState, useEffect } from "react";
import { FaUniversalAccess} from "react-icons/fa";
import { FaMoon, FaSun } from "react-icons/fa";

function Accesibilidad() {

    const [abierto, setAbierto] = useState(false);

    // Estados con LocalStorage
    const [tamanoPorcentaje, setTamanoPorcentaje] = useState(() => {
        const guardado = localStorage.getItem("accesibilidad_tamano");
        const parseado = parseInt(guardado);
        // Si no es un número válido o es muy pequeño (como el '1' del índice anterior), usamos 100
        if (isNaN(parseado) || parseado < 50 || parseado > 300) {
            return 100;
        }
        return parseado;
    });
    
    const [temaOscuro, setTemaOscuro] = useState(() => {
        return localStorage.getItem("accesibilidad_tema") === "oscuro";
    });

    const [altoContraste, setAltoContraste] = useState(() => {
        return localStorage.getItem("accesibilidad_contraste") === "true";
    });

    const aumentarTexto = () => {
        if (tamanoPorcentaje < 200) {
            setTamanoPorcentaje(prev => prev + 10);
        }
    };

    const disminuirTexto = () => {
        if (tamanoPorcentaje > 60) {
            setTamanoPorcentaje(prev => prev - 10);
        }
    };

    const toggleTema = () => {
        setTemaOscuro(!temaOscuro);
    };

    const toggleContraste = () => {
        setAltoContraste(!altoContraste);
    };

    useEffect(() => {
        // Aplicar zoom a todo el sistema (visible globalmente)
        document.documentElement.style.zoom = `${tamanoPorcentaje}%`;

        // Limpiar clases previas
        document.documentElement.classList.remove(
            "tema-oscuro",
            "alto-contraste"
        );
        
        if (temaOscuro) {
            document.documentElement.classList.add("tema-oscuro");
        }
        
        if (altoContraste) {
            document.documentElement.classList.add("alto-contraste");
        }

        // Guardar preferencias
        localStorage.setItem("accesibilidad_tamano", tamanoPorcentaje);
        localStorage.setItem("accesibilidad_tema", temaOscuro ? "oscuro" : "claro");
        localStorage.setItem("accesibilidad_contraste", altoContraste);

    }, [tamanoPorcentaje, temaOscuro, altoContraste]);

    return (
        <>
            {/* Botón */}
            <button
                className="btn-accesibilidad"
                onClick={() => setAbierto(!abierto)}
                title="Opciones de accesibilidad"
            >
                <FaUniversalAccess />
            </button>

            {/* Ventana */}
            {abierto && (
                <div className="panel-accesibilidad">

                    <h2><FaUniversalAccess/>Accesibilidad</h2>

                    <hr />

                    <div className="opcion">
                        <label>Tamaño de vista</label>

                        <div className="botones-texto">
                            <button onClick={disminuirTexto} disabled={tamanoPorcentaje <= 60}>A-</button>
                            <span>{tamanoPorcentaje}%</span>
                            <button onClick={aumentarTexto} disabled={tamanoPorcentaje >= 200}>A+</button>
                        </div>
                    </div>

                    <div className="opcion">
                        <label>Tema</label>

                        <button className="tema-btn" onClick={toggleTema}>
                            {temaOscuro ? <><FaMoon/> Oscuro </> : <><FaSun/>Claro</>}
                        </button>
                    </div>

                    <div className="opcion">
                        <label>
                            <input 
                                type="checkbox" 
                                checked={altoContraste}
                                onChange={toggleContraste}
                            />
                            Alto contraste
                        </label>
                    </div>

                </div>
            )}
        </>
    );

}

export default Accesibilidad;