import React from "react";
export const RadioGroup = ({ value, onValueChange, className, children, ...props }) => (
  <div className={className} {...props}>{React.Children.map(children, child => React.cloneElement(child, { groupValue: value, onGroupChange: onValueChange }))}</div>
);
export const RadioGroupItem = ({ value, id, groupValue, onGroupChange, ...props }) => (
  <input type="radio" id={id} value={value} checked={groupValue===value} onChange={()=>onGroupChange(value)} {...props} />
);
