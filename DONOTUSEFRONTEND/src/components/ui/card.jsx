import React from "react";

export const Card = ({ children, className = "", ...props }) => (
  <div {...props} className={`p-4 border rounded-lg shadow-md ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "", ...props }) => (
  <div {...props} className={`p-2 ${className}`}>
    {children}
  </div>
);

export default Card;
