import React from "react";

const CustomSelectOptions = ({
  value = "",
  label,
  disabled = false,
  ...rest
}) => {
  return (
    <option value={value} disabled={disabled} {...rest}>
      {label}
    </option>
  );
};

export default CustomSelectOptions;
