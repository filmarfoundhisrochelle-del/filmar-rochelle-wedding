import React from "react";

export const Monogram = ({ size = 160, className = "" }) => {
  return (
    <svg
      width={size * 2.2}
      height={size}
      viewBox="0 0 500 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ maxWidth: "100%" }}
      data-testid="couple-monogram"
    >
      <text x="55" y="148" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="130" fontStyle="italic" fontWeight="300" fill="#2B2824">F</text>
      <text x="360" y="148" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="130" fontStyle="italic" fontWeight="300" fill="#2B2824">R</text>
      <path d="M125,108 Q170,130 218,118" stroke="#2B2824" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M282,118 Q330,130 375,108" stroke="#2B2824" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M250,88 C250,76 237,64 230,73 C223,82 230,94 250,110 C270,94 277,82 270,73 C263,64 250,76 250,88 Z" stroke="#2B2824" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="250" y="174" fontFamily="Cinzel, Cormorant Garamond, serif" fontSize="14" letterSpacing="7" fill="#2B2824" textAnchor="middle" fontWeight="400">FILMAR &amp; ROCHELLE</text>
      <text x="250" y="192" fontFamily="Cinzel, Cormorant Garamond, serif" fontSize="10" letterSpacing="5" fill="#857F76" textAnchor="middle" fontWeight="400">06.12.2026</text>
    </svg>
  );
};

export default Monogram;
