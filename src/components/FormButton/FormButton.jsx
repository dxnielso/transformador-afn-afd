import './formButton.css'

const FormButton = ({ id, texto, onClick, color="0477DB" }) => {
  return <button id={id} onClick={onClick} type='button' style={{backgroundColor: `#${color}`}}>{texto}</button>;
};

export default FormButton;