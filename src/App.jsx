// Styles
import "./App.css";
// Components
import Form from "./components/Form/Form";
import Input from "./components/Input/Input";
import FormButton from "./components/FormButton/FormButton";
// Hooks
import { useEffect, useState } from "react";
// Library
import Swal from "sweetalert2";

function App() {
  // useStates
  const [mostrarTransiciones, setMostrarTransiciones] = useState(false); // indica si muestra o no las transiciones

  // Almacenan los valores de los inputs
  const [lenguaje, setLenguaje] = useState("");
  const [estados, setEstados] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [simbolo, setSimbolo] = useState("");
  const [estadoInicial, setEstadoInicial] = useState("");

  // Almacenan los valores de los inputs pero en arrays
  const [lenguajeArray, setLenguajeArray] = useState([]);
  const [estadosArray, setEstadosArray] = useState([]);

  const [transiciones, setTransiciones] = useState([]); // Almacena las transiciones
  const [matrizAFD, setMatrizAFD] = useState({}); // almacena la matriz AFD

  // Cada que se cambia el input de lenguaje
  useEffect(() => {
    if (lenguaje) {
      // Convertimos los input en arrays
      setLenguajeArray(lenguaje.split(",").map((simbolo) => simbolo.trim()));
    } else {
      setLenguajeArray([]);
    }
  }, [lenguaje]);

  // Cada que se cambia el input de estados
  useEffect(() => {
    if (estados) {
      // Convertimos los input en arrays
      setEstadosArray(estados.split(",").map((estado) => estado.trim()));
      setEstadoInicial("");
    } else {
      setEstadosArray([]);
    }
  }, [estados]);
  useEffect(() => {
    if (!mostrarTransiciones) {
      // Activamos los inputs
      const inputLenguaje = document.getElementById("lenguaje");
      const inputEstados = document.getElementById("estados");
      const selectEstadoInicial = document.getElementById(
        "selectEstadoInicial"
      );

      inputLenguaje.disabled = false;
      inputEstados.disabled = false;
      selectEstadoInicial.disabled = false;

      setTransiciones([]); // Limpiamos el arreglo de transiciones
      setMatrizAFD({}); // limpiamos la matriz del AFD

      // Ocultamos las transiciones
      setFrom("")
      setTo("")
      setSimbolo("")
    }
  }, [mostrarTransiciones]);

  useEffect(() => {
    if (!lenguaje || !estados || !estadoInicial) {
      setMostrarTransiciones(false);
    }
  }, [lenguaje, estados, estadoInicial]);

  // Funciones
  const submitForm = (e) => {
    // e.preventDefault();

    Swal.fire({
      title: "Convirtiendo...",
      timer: 1500, // 3 segundos
      showConfirmButton: false,
      timerProgressBar: true,
      willOpen: () => {
        // Aquí puedes realizar acciones después de mostrar la ventana de carga
        // console.log("La ventana de carga se ha mostrado");
      },
      didClose: () => {
        // Puedes agregar más acciones aquí, como realizar algo después de la carga
        const combinaciones = generarArrayEstados(); // obtener arreglo con todas las combinaciones posibles de estados
        const matrizTransiciones = generarMatrizTransiciones(combinaciones); // obtener la matriz de transiciones del AFN
        generarMatrizAFD(matrizTransiciones); // generar la matriz del AFD
        actualizarGrafoAFD();

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Listo",
          showConfirmButton: false,
          timer: 800,
        });
      },
    });
  };

  const generarMatrizAFD = (matrizTransiciones) => {
    // console.log("Matriz: ", matrizTransiciones);
    const matrizAFD = {};
    const conjuntoEstados = new Set();

    // Agregar la primera propiedad
    const primeraTransicion = matrizTransiciones[estadoInicial];
    matrizAFD[estadoInicial] = { ...primeraTransicion };
    // console.log("Primera transicion: ", primeraTransicion);
    conjuntoEstados.add(estadoInicial);

    // Función para verificar si una clave ya existe en la matrizAFD
    const claveExisteEnAFD = (clave) => conjuntoEstados.has(clave);

    // Recorrer la matriz final para validar que todos los estados estén dentro
    let nuevasPropiedades = true;

    while (nuevasPropiedades) {
      nuevasPropiedades = false;

      for (const estado in matrizAFD) {
        const transiciones = matrizAFD[estado];
        // console.log("Iterando un objeto de la matrizAFD: ", estado);
        // console.log("Matriz AFD: ", matrizAFD);
        // console.log("Conjunto de estados: ", [...conjuntoEstados]);

        // Recorrer cada elemento del objeto que sería 0 y 1
        for (const simbolo in transiciones) {
          const arreglo = transiciones[simbolo];
          const estadoPuroAFD = arreglo.join("");

          // console.log("Estado puro: ", estadoPuroAFD);

          if (!claveExisteEnAFD(estadoPuroAFD)) {
            // console.log("No existe, agregando...");
            // Código para meter ese estado en el
            // console.log("Error: ", matrizTransiciones[estadoPuroAFD]);
            matrizAFD[estadoPuroAFD] = { ...matrizTransiciones[estadoPuroAFD] };
            conjuntoEstados.add(estadoPuroAFD);
            nuevasPropiedades = true; // Indicar que se han agregado nuevas propiedades
          } else {
            // console.log("Existe");
          }
        }
      }
    }
    // console.log("Matriz AFD: ", matrizAFD);
    // console.log("Conjunto de estados: ", [...conjuntoEstados]);
    setMatrizAFD(matrizAFD);
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

        // Almacenar los nuevos estados en la matriz de transiciones - antes ordenamos cada elemento del arreglo con sort()
        matrizTransiciones[conjuntoEstado.join("")][simbolo] = nuevosEstados
          .slice()
          .sort();
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

    if (lenguaje && estados && estadoInicial) {
      // Desactivamos los inputs
      const inputLenguaje = document.getElementById("lenguaje");
      const inputEstados = document.getElementById("estados");
      const selectEstadoInicial = document.getElementById(
        "selectEstadoInicial"
      );

      inputLenguaje.disabled = true;
      inputEstados.disabled = true;
      selectEstadoInicial.disabled = true;

      // Mostramos las transiciones
      setMostrarTransiciones(true);
    } else {
      Swal.fire({
        title: "Campos vacíos",
        text: "Debes ingresar todos los datos solicitados",
        icon: "error",
      });
    }
  };

  const returnForm = (e) => {
    e.preventDefault();
    setMostrarTransiciones(false);
  };

  const addTransition = (e) => {
    e.preventDefault();
    if (from && to && simbolo) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Transición agregada",
        showConfirmButton: false,
        timer: 700,
      });
      setTransiciones([
        ...transiciones,
        {
          from,
          to,
          simbolo,
        },
      ]);
      crearGrafo(estadosArray, transiciones, "grafoAFN");
    } else {
      Swal.fire({
        title: "Error",
        text: "Debes llenar todos los campos de la transición",
        icon: "error",
      });
    }
  };

  const crearGrafo = (estados, transiciones, divID) => {
    // creacion de los estados
    let nodes = new vis.DataSet(
      estados.map((estado, index) => {
        if (index != estados.length - 1) {
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
    let container = document.getElementById(divID);
    new vis.Network(container, data, options);
  };

  const actualizarGrafoAFD = () => {
    const transiciones = []; // aqui voy almacenas las transiciones
    for (const propiedad in matrizAFD) {
      const transicion = matrizAFD[propiedad];

      // 0 y 1
      for (const simbolo in transicion) {
        const arregloTransiciones = transicion[simbolo];
        transiciones.push({
          from: propiedad,
          to: arregloTransiciones.join(""),
          simbolo,
        });
      }
    }
    crearGrafo(Object.keys(matrizAFD), transiciones, "grafoAFD");
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
          <div>
            <select
              id="selectEstadoInicial"
              name="select"
              value={estadoInicial}
              onChange={(e) => setEstadoInicial(e.target.value)}
            >
              <option value="" defaultValue disabled>
                SELECCIONA UN ESTADO INICIAL
              </option>
              {estadosArray.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
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
            <div id="grafoAFN"></div>
            {transiciones.length > 0 && (
              <div>
                <FormButton
                  id="btnActualizarGrafoAFN"
                  texto="Actualizar grafo"
                  onClick={() =>
                    crearGrafo(estadosArray, transiciones, "grafoAFN")
                  }
                />
              </div>
            )}
          </>
        )}
        {Object.keys(matrizAFD).length != 0 && <div id="grafoAFD"></div>}
      </section>
    </div>
  );
}

export default App;
