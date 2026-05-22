import React from "react";

export const Monogram = ({ size = 160, className = "" }) => {
  return (
    <img
      src="/monogram.png"
      alt="Filmar & Rochelle monogram"
      className={className}
      style={{ height: size * 1.8, width: "auto", maxWidth: "100%" }}
      data-testid="couple-monogram"
    />
  );
};

export default Monogram;
