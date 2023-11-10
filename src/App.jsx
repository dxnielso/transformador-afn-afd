// Styles
import "./App.css";
// Components
import Form from "./components/Form/Form";
import Input from "./components/Input/Input";
import FormButton from "./components/FormButton/FormButton";
// Hooks
import { useEffect, useState } from "react";

function App() {
  // useStates
  const [mostrarTransiciones, setMostrarTransiciones] = useState(false);
  // Almacenan los valores de los inputs
  const [lenguaje, setLenguaje] = useState("");
  const [estados, setEstados] = useState("");
  // Almacenan los valores de los inputs pero en arrays
  const [lenguajeArray, setLenguajeArray] = useState([]);
  const [estadosArray, setEstadosArray] = useState([]);

  // useEffects
  useEffect(() => {
    // creacion de los estados
    let nodes = new vis.DataSet([
      { id: 1, label: "p" },
      { id: 2, label: "q" },
      { id: 3, label: "r" },
      {
        id: 4,
        shape: "box", // Cambiar la forma a un cuadrado
        color: "red", // Color del cuadrado (estado final)
        label: "s", // Etiqueta del estado final (opcional)
      },
    ]);

    // creacion de las transiciones
    let edges = new vis.DataSet([
      { from: 1, to: 1, label: "0, 1" },
      { from: 1, to: 2, label: "0" },
      { from: 2, to: 3, label: "0, 1" },
      { from: 3, to: 4, label: "0" },
      { from: 4, to: 4, label: "0, 1" },
    ]);

    // Configuración de vis.js
    let data = {
      nodes: nodes,
      edges: edges,
    };

    // Configuraciones adicionales si son necesarias
    let options = {
      autoResize: true,
      height: "100%",
      width: "100%",
      locale: "en",
      edges: {
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 1,
            type: "arrow",
          },
          from: {
            enabled: false,
            scaleFactor: 1,
            type: "arrow",
          },
        },
      },
      // nodes: {...},        // defined in the nodes module.
      // groups: {...},       // defined in the groups module.
      // layout: {...},       // defined in the layout module.
      // interaction: {...},  // defined in the interaction module.
      // manipulation: {...}, // defined in the manipulation module.
      // physics: {...},      // defined in the physics module.
    };

    // creacion de la red
    let container = document.getElementById("mynetwork");
    let network = new vis.Network(container, data, options);

    return () => {
      network.destroy(); // Limpia el grafo al desmontar el componente
    };
  }, []);

  // Cada que se cambia el input de lenguaje
  useEffect(() => {
    // Convertimos los input en arrays
    setLenguajeArray(
      lenguaje.split(",").map((simbolo) => simbolo.trim())
    );
  }, [lenguaje]);

  // Cada que se cambia el input de estados
  useEffect(() => {
    // Convertimos los input en arrays
    setEstadosArray(estados.split(",").map((estado) => estado.trim()));
  }, [estados]);

  // Funciones
  const submitForm = (e) => {
    e.preventDefault();
  };

  const continueForm = (e) => {
    e.preventDefault();
    // Desactivamos los inputs
    const inputLenguaje = document.getElementById("lenguaje");
    const inputEstados = document.getElementById("estados");

    inputLenguaje.disabled = true;
    inputEstados.disabled = true;

    // Mostramos las transiciones
    setMostrarTransiciones(true);
  };

  const returnForm = (e) => {
    e.preventDefault();
    // Activamos los inputs
    const inputLenguaje = document.getElementById("lenguaje");
    const inputEstados = document.getElementById("estados");

    inputLenguaje.disabled = false;
    inputEstados.disabled = false;

    // Ocultamos las transiciones
    setMostrarTransiciones(false);
  };

  return (
    <div className="container">
      <section className="container__children container__children--left">
        <h2>Transformador AFN a AFD</h2>
        <Form>
          <Input
            label="Lenguaje"
            inputType="text"
            placeholder="Escibe el lenguaje separando por coma [,]"
            id="lenguaje"
            value={lenguaje}
            onChange={(e) => setLenguaje(e.target.value)}
          />
          <Input
            label="Estados"
            inputType="text"
            placeholder="Escibe los estados separandos por coma [,]"
            id="estados"
            value={estados}
            onChange={(e) => setEstados(e.target.value)}
          />
          <div className="buttons__container">
            <FormButton
              id="btnContinuar"
              texto="Continuar"
              onClick={(e) => continueForm(e)}
            />
            <FormButton
              id="btnRegresar"
              texto="Regresar"
              onClick={(e) => returnForm(e)}
            />
          </div>

          {mostrarTransiciones && (
            <>
              <div className="transiciones__container">
                <p>Ingresa los estados correspondientes de cada transición</p>
                {estadosArray.map((estado) => (
                  <div className="transiciones__interno">
                    <h3>
                      Estado a evaluar:{" "}
                      <span className="white-container">{estado}</span>
                    </h3>

                    {lenguajeArray.map((caracter) => (
                      <div className="transicion">
                        <h4>
                          Simbolo{" "}
                          <span className="white-container">{caracter}</span> se
                          va al estado
                        </h4>
                        <select name="select">
                          <option value="" defaultValue disabled>
                            SELECCIONA UN ESTADO
                          </option>
                          {
                            estadosArray.map(estado => (
                              <option value={estado}>{estado}</option>
                            ))
                          }
                        </select>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <FormButton
                id="btnConvertir"
                texto="Convertir"
                onClick={(e) => submitForm(e)}
              />
            </>
          )}
        </Form>
      </section>
      <section className="container__children container__children--right">
        <div id="mynetwork"></div>
      </section>
    </div>
  );
}

export default App;
