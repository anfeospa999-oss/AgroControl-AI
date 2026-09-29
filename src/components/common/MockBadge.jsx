import React from 'react';

export const MockBadge = ({ text = "Datos Demo", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border bg-amber-100 text-amber-800 border-amber-200 opacity-90 shadow-sm ml-1.5 translate-y-[-1px] ${className}`}
      title="Datos simulados para fase de pruebas"
    >
      {text}
    </span>
  );
};
