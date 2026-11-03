import React from 'react';

interface SombreroSaoProps {
  className?: string;
  size?: number;
}

export const SombreroSao: React.FC<SombreroSaoProps> = ({ className = 'w-6 h-6', size }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`inline-block shrink-0 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Sombrero de Saó Cruceño</title>
      {/* Sombra suave debajo del ala */}
      <ellipse cx="32" cy="49" rx="27" ry="6" fill="#000000" fillOpacity="0.12" />

      {/* Ala exterior del sombrero de saó */}
      <ellipse cx="32" cy="45" rx="28" ry="10" fill="#E6C875" stroke="#B88A2E" strokeWidth="1.5" />
      <ellipse cx="32" cy="45" rx="25" ry="8" fill="#F0D993" />

      {/* Líneas de tejido de saó en el ala */}
      <path d="M7 45 C15 42 49 42 57 45" stroke="#D4A747" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M12 47 C20 44 44 44 52 47" stroke="#C49635" strokeWidth="0.8" />

      {/* Copa del sombrero de saó */}
      <path
        d="M20 41 C19 25 24 17 32 17 C40 17 45 25 44 41 Z"
        fill="#F4DF9E"
        stroke="#B88A2E"
        strokeWidth="1.5"
      />
      {/* Hundimiento / detalle superior de la copa */}
      <path
        d="M27 17 C29 20 35 20 37 17"
        stroke="#B88A2E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Textura de saó en la copa */}
      <path d="M22 34 C27 32 37 32 42 34" stroke="#D4A747" strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M24 27 C28 25 36 25 40 27" stroke="#D4A747" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* Cinta Verde Cruceña */}
      <path
        d="M19.8 41 C23.5 44 40.5 44 44.2 41 L44 36.5 C40 39.5 24 39.5 20 36.5 Z"
        fill="#0D592C"
        stroke="#083E1E"
        strokeWidth="0.8"
      />
      {/* Franja blanca en el centro de la cinta (Bandera cruceña verde-blanco-verde) */}
      <path
        d="M20 39 C24 41.5 40 41.5 44 39"
        stroke="#FFFFFF"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
};
