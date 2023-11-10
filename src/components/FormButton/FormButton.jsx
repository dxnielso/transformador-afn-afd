import './formButton.css'

const FormButton = ({ id, texto, onClick }) => {
  return <button id={id} onClick={onClick} type='button'>{texto}</button>;
};

export default FormButton;