import React from "react";

const TextInputField = ({
  label = "",
  type = "text",
  value = "",
  onChange = undefined,
  placeholder = "",
  required = false,
  multiline = 0,
  error = false,
  errorMessage = null,
  additionalClasses = "",
  disabled = false,
  name = "",
  size = "md",
  id = "",
  ...rest
}) => {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {multiline === 0 ? (
        <input
          className={`form-control ${
            size === "lg" && "form-control-lg"
          } ${additionalClasses}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          name={name}
          id={id}
          {...rest}
        />
      ) : (
        <textarea
          className={`form-control ${
            size === "lg" && "form-control-lg"
          } ${additionalClasses}`}
          rows={multiline}
          required={required}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          name={name}
          id={id}
          {...rest}
        ></textarea>
      )}
    </div>
  );
};

export default TextInputField;
