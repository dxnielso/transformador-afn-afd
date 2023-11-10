// Styles
import "./App.css";
// Components
import Form from "./components/Form/Form";
import Input from "./components/Input/Input";
import FormButton from "./components/FormButton/FormButton";
// Hooks
import { useEffect } from "react";

function App() {
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

  return (
    <div className="container">
      <section className="container__children container__children--left">
        <h2>Transformador AFN a AFD</h2>
        <Form>
          {/* Lenguaje */}
          <div>
            <h3>Lenguaje</h3>
            <Input
              label="¿Cuantos simbolos tiene el lenguaje"
              inputType="number"
              placeholder="Ingresa la cantidad de simbolos que conforman el lenguaje"
              idInput="cantidad-simbolos-lenguaje"
            />
          </div>

          {/* Estados */}
          <div>
            <h3>Estados</h3>
            <Input
              label="¿Cuantos estados tiene?"
              inputType="number"
              placeholder="Ingresa la cantidad de estados"
              idInput="cantidad-estados"
            />
          </div>
        </Form>
      </section>
      <section className="container__children container__children--right">
        <div id="mynetwork"></div>
      </section>
    </div>
  );
}

export default App;
