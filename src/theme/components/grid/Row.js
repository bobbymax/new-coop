import React from "react";

const Row = ({ additionalClasses = "", flex = false, children, ...rest }) => {
  return (
    <div
      className={`row ${flex && "flex-grow"} ${additionalClasses}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Row;
