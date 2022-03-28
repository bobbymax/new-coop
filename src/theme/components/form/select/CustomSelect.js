import React from "react";

const CustomSelect = ({
  label = "",
  value = "",
  onChange = undefined,
  children,
  error = false,
  errorMessage = null,
  additionalClasses = "",
  name = "",
  size = "md",
  ...rest
}) => {
  return (
    <>
      <div className="form-group">
        <label className="form-label">{label}</label>
        <select
          className={`form-control ${size === "lg" && "form-control-lg"}`}
          value={value}
          onChange={onChange}
          name={name}
          {...rest}
        >
          {children}
        </select>
      </div>
    </>
  );
};

export default CustomSelect;
