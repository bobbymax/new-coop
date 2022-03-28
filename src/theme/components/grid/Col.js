import React from "react";

const Col = ({
  xs = 0,
  sm = 0,
  md = 0,
  lg = 0,
  xl = 0,
  xxl = 0,
  additionalClasses = "",
  children,
  ...rest
}) => {
  return (
    <div
      className={`${xs > 0 && "col-xs-" + xs} ${sm > 0 && "col-sm-" + sm} ${
        md > 0 && "col-md-" + md
      } ${lg > 0 && "col-lg-" + lg} ${xl > 0 && "col-xl-" + xl} ${
        xxl > 0 && "col-xxl-" + xxl
      } ${additionalClasses}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Col;
