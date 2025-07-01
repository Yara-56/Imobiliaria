// src/components/Inquilinos/InputField.jsx
import React from 'react';

const InputField = ({ label, id, type = "text", value, onChange, required = false }) => {
  return (
    <div>
      <label htmlFor={id}>{label}{required && " *"}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required={required}
        className="input-form"
        placeholder={label}
      />
    </div>
  );
};

export default InputField;
