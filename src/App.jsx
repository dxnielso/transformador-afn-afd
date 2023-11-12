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
    const matrizTransiciones = generarMatrizTransiciones(combinaciones);
    generarMatrizAFD(matrizTransiciones);
  };

  const generarMatrizAFD = (matrizTransiciones) => {
    const matrizAFD = {};
    const conjuntoEstados = new Set();

    // Agregar la primera propiedad
    const primeraClave = Object.keys(matrizTransiciones)[0];
    const primeraTransicion = matrizTransiciones[primeraClave];
    matrizAFD[primeraClave] = { ...primeraTransicion };
    conjuntoEstados.add(primeraClave);

    // Función para verificar si una clave ya existe en la matrizAFD
    const claveExisteEnAFD = (clave) => conjuntoEstados.has(clave);

    // Recorrer la matriz final para validar que todos los estados estén dentro
    let nuevasPropiedades = true;

    while (nuevasPropiedades) {
      nuevasPropiedades = false;

      for (const estado in matrizAFD) {
        const transiciones = matrizAFD[estado];
        console.log("Iterando un objeto de la matrizAFD: ", estado);

        // Recorrer cada elemento del objeto que sería 0 y 1
        for (const simbolo in transiciones) {
          const arreglo = transiciones[simbolo];
          const estadoPuroAFD = arreglo.join("");

          console.log("Estado puro: ", estadoPuroAFD);

          if (!claveExisteEnAFD(estadoPuroAFD)) {
            console.log("No existe, agregando...");
            // Código para meter ese estado en el
            matrizAFD[estadoPuroAFD] = { ...matrizTransiciones[estadoPuroAFD] };
            conjuntoEstados.add(estadoPuroAFD);
            nuevasPropiedades = true; // Indicar que se han agregado nuevas propiedades
          } else {
            console.log("Existe");
          }
        }
      }
    }
    console.log("Matriz AFD: ", matrizAFD);
    console.log("Conjunto de estados: ", [...conjuntoEstados]);
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

    // Limpiamos el arreglo de transiciones
    setTransiciones([]);

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
    crearGrafo();
  };

  const crearGrafo = () => {
    // creacion de los estados
    let nodes = new vis.DataSet(
      estadosArray.map((estado, index) => {
        if (index != estadosArray.length - 1) {
          return { id: estado, label: estado };
        } else {
          return { id: estado, shape: "box", label: estado, color: "green" };
        }
      })
    );

    // creacion de las transiciones
    let edges = new vis.DataSet(
      transiciones.map((transicion) => ({
        from: transicion.from,
        to: transicion.to,
        label: transicion.simbolo,
      }))
    );

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
    new vis.Network(container, data, options);
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
        {mostrarTransiciones && (
          <>
            <div id="mynetwork"></div>
            {transiciones.length > 0 && (
              <div>
                <FormButton
                  id="btnActualizar"
                  texto="Actualizar grafo"
                  onClick={() => crearGrafo()}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default App;
