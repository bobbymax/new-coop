import React from "react";

const Wrapper = ({ additionalClasses = "", children, ...rest }) => {
  return (
    <div className={`container-scroller ${additionalClasses}`} {...rest}>
      {children}
    </div>
  );
};

export default Wrapper;
