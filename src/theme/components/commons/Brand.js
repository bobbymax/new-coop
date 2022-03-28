import React from "react";
import logo from "../../../assets/images/logo/logo.png";
import logoMini from "../../../assets/images/logo/logo-small.png";
import { Link } from "react-router-dom";

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
        <Link className="navbar-brand brand-logo" to="/">
          <img src={logo} alt="logo" />
        </Link>
        <Link className="navbar-brand brand-logo-mini" to="/">
          <img src={logoMini} alt="logo" />
        </Link>
      </div>
    </div>
  );
};

export default Brand;
