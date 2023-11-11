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
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [simbolo, setSimbolo] = useState("");

  // Almacenan los valores de los inputs pero en arrays
  const [lenguajeArray, setLenguajeArray] = useState([]);
  const [estadosArray, setEstadosArray] = useState([]);

  // Almacena las transiciones
  const [transiciones, setTransiciones] = useState([]);

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
    if (lenguaje) {
      // Convertimos los input en arrays
      setLenguajeArray(lenguaje.split(",").map((simbolo) => simbolo.trim()));
    }
  }, [lenguaje]);

  // Cada que se cambia el input de estados
  useEffect(() => {
    if (estados) {
      // Convertimos los input en arrays
      setEstadosArray(estados.split(",").map((estado) => estado.trim()));
    }
  }, [estados]);

  // Funciones
  const submitForm = (e) => {
    e.preventDefault();
    const combinaciones = generarArrayEstados();
    console.log(generarMatrizTransiciones(combinaciones));
  };

  const generarMatrizTransiciones = (combinaciones) => {
    // Crear matriz de transiciones
    const matrizTransiciones = {};

    // Inicializar la matriz de transiciones
    for (const conjuntoEstado of combinaciones) {
      // Crear una entrada en la matriz de transiciones para el conjunto de estados actual
      matrizTransiciones[conjuntoEstado.join("")] = {};

      // Iterar sobre cada símbolo del lenguaje
      for (const simbolo of lenguajeArray) {
        // Array para almacenar los nuevos estados alcanzados con el símbolo actual
        const nuevosEstados = [];

        // Iterar sobre cada objeto de transición
        for (const transicion of transiciones) {
          // Verificar si la transición es aplicable al conjunto de estados y al símbolo actual
          if (
            conjuntoEstado.includes(transicion.from) &&
            transicion.simbolo == simbolo &&
            !nuevosEstados.includes(transicion.to)
          ) {
            // Agregar el estado de destino al array de nuevos estados
            nuevosEstados.push(transicion.to);
          }
        }

        // Almacenar los nuevos estados en la matriz de transiciones
        matrizTransiciones[conjuntoEstado.join("")][simbolo] = nuevosEstados;
      }
    }
    return matrizTransiciones;
  };

  const generarArrayEstados = () => {
    // Función principal para generar combinaciones de longitud 'length'
    function generarCombinaciones(arr, length) {
      const result = []; // Array para almacenar las combinaciones resultantes

      // Verifica que la longitud sea válida
      if (length <= 0 || length > arr.length) {
        console.error("Longitud no válida");
        return result;
      }

      // Función recursiva para generar combinaciones
      function generarCombinacionesRecursivas(
        prefix,
        startIndex,
        remainingLength
      ) {
        // Caso base: cuando la longitud deseada es 0, se agrega la combinación al resultado
        if (remainingLength === 0) {
          result.push([...prefix]); // Se utiliza [...prefix] para evitar la referencia al array original
          return;
        }

        // Bucle para explorar todas las combinaciones posibles
        for (let i = startIndex; i < arr.length; i++) {
          prefix.push(arr[i]); // Agrega el elemento actual al prefijo
          generarCombinacionesRecursivas(prefix, i + 1, remainingLength - 1); // Llamada recursiva con el nuevo prefijo y parámetros actualizados
          prefix.pop(); // Elimina el último elemento agregado para probar otras combinaciones
        }
      }

      // Inicia el proceso de generación de combinaciones
      generarCombinacionesRecursivas([], 0, length);

      return result; // Devuelve el array con todas las combinaciones generadas
    }

    let combinaciones = []; // aqui se van almacenar todas las combinaciones

    for (let index = 1; index <= estadosArray.length; index++) {
      combinaciones = combinaciones.concat(
        generarCombinaciones(estadosArray, index)
      );
    }
    return combinaciones;
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

  const addTransition = (e) => {
    e.preventDefault();
    setTransiciones([
      ...transiciones,
      {
        from,
        to,
        simbolo,
      },
    ]);
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
              texto="Modificar"
              onClick={(e) => returnForm(e)}
            />
          </div>

          {mostrarTransiciones && (
            <>
              <div className="transiciones__container">
                <p>Ingresa los estados correspondientes de cada transición</p>
                <div className="transicion">
                  <div className="transicion__flex">
                    <p>Del estado </p>
                    <select
                      name="select"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    >
                      <option value="" defaultValue disabled>
                        SELECCIONA UN ESTADO
                      </option>
                      {estadosArray.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="transicion__flex">
                    <p>Se va al estado</p>
                    <select
                      name="select"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    >
                      <option value="" defaultValue disabled>
                        SELECCIONA UN ESTADO
                      </option>
                      {estadosArray.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="transicion__flex">
                    <p>Con el caracter</p>
                    <select
                      name="select"
                      value={simbolo}
                      onChange={(e) => setSimbolo(e.target.value)}
                    >
                      <option value="" defaultValue disabled>
                        SELECCIONA UN CARACTER
                      </option>
                      {lenguajeArray.map((caracter) => (
                        <option key={caracter} value={caracter}>
                          {caracter}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <FormButton
                    id="btnAgregar"
                    texto="Agregar transición"
                    onClick={(e) => addTransition(e)}
                  />
                </div>
              </div>
              <FormButton
                id="btnConvertir"
                texto="Convertir"
                onClick={(e) => submitForm(e)}
                color="008000"
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
