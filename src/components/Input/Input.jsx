import './input.css'

const Input = ({ label, inputType, placeholder, idInput }) => {
  return (
    <div>
      <label htmlFor={idInput}>
        {label}
        <input type={inputType} placeholder={placeholder} id={idInput} />
      </label>
    </div>
  );
};

export default Input;
