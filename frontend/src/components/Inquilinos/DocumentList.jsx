// src/components/Inquilinos/DocumentList.jsx
import React from 'react';

const DocumentList = ({ documents = [], onRemove }) => {
  return (
    <div className="docs-anexados">
      <label>Documentos Anexados</label>
      <ul>
        {documents.length === 0 ? (
          <li>Nenhum documento anexado.</li>
        ) : (
          documents.map((doc, index) => (
            <li key={index}>
              <input
                type="checkbox"
                name="docs"
                value={doc}
                onChange={() => onRemove?.(doc)}
              />{' '}
              {doc}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DocumentList;
