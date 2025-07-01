// src/components/Inquilinos/FieldDisplay.jsx
import React from 'react';

const FieldDisplay = ({ label, value }) => {
  return (
    <div>
      <label>{label}</label>
      <span className="dado-fixo">{value}</span>
    </div>
  );
};

export default FieldDisplay;
