import './input.css'

const Input = ({ label, inputType, placeholder, id, value, onChange }) => {
  return (
    <div>
      <label htmlFor={id}>
        <span>{label}</span>
        <input type={inputType} placeholder={placeholder} id={id} value={value} onChange={onChange} />
      </label>
    </div>
  );
};

export default Input;
