// src/components/Inquilinos/SectionBox.jsx
import React from 'react';

const SectionBox = ({ title, children }) => {
  return (
    <div className="caixa-branca">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};

export default SectionBox;
