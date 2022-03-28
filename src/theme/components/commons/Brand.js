import React from "react";
import logo from "../../../assets/images/logo/logo.png";
import logoMini from "../../../assets/images/logo/logo-small.png";

const Brand = ({ handleToggle }) => {
  return (
    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
      <div className="me-3">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-bs-toggle="minimize"
          onClick={() => handleToggle()}
        >
          <span className="icon-menu" />
        </button>
      </div>
      <div>
        <a className="navbar-brand brand-logo" href="index.html">
          <img src={logo} alt="logo" />
        </a>
        <a className="navbar-brand brand-logo-mini" href="index.html">
          <img src={logoMini} alt="logo" />
        </a>
      </div>
    </div>
  );
};

export default Brand;
