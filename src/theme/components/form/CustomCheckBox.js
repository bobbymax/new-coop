import React from "react";

const CustomCheckBox = ({
  label,
  type = "checkbox",
  value = "",
  onChange = undefined,
  disabled = false,
  name = "",
  id = "",
  ...rest
}) => {
  return (
    <div className="form-check form-check-success">
      <label htmlFor={id} className="form-check-label">
        <input
          type={type}
          className="form-check-input"
          value={value}
          onChange={onChange}
          disabled={disabled}
          name={name}
          id={id}
          {...rest}
        />
        {label}
        <i className="input-helper"></i>
      </label>
    </div>
  );
};

export default CustomCheckBox;
