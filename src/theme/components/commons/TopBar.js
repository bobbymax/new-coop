/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import avatar from "../../../assets/images/faces/avatar.png";

const TopBar = ({ auth, logOut, handleOffCanvas }) => {
  return (
    <div className="navbar-menu-wrapper d-flex align-items-top">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <form className="search-form" action="#">
            <i className="icon-search" />
            <input
              type="search"
              className="form-control"
              placeholder="Search Here"
              title="Search here"
            />
          </form>
        </li>

        <li className="nav-item dropdown d-none d-lg-block user-dropdown">
          <a
            className="nav-link"
            id="UserDropdown"
            href="#"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              className="img-xs rounded-circle"
              src={avatar}
              alt="Profile image"
            />
          </a>
          <div
            className="dropdown-menu dropdown-menu-right navbar-dropdown"
            aria-labelledby="UserDropdown"
          >
            <div className="dropdown-header text-center">
              <img
                className="img-md rounded-circle"
                src={avatar}
                alt="Profile image"
                style={{ width: "50%" }}
              />
              <p className="mb-1 mt-3 font-weight-semibold">
                {auth && auth.firstname + " " + auth.surname}
              </p>
              <p className="fw-light text-muted mb-0">{auth && auth.email}</p>
            </div>
            {/* <a className="dropdown-item">
              <i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2" />
              My Profile
            </a> */}
            <Link to="#" className="dropdown-item" onClick={logOut}>
              <i className="dropdown-item-icon mdi mdi-power text-primary me-2" />
              Sign Out
            </Link>
          </div>
        </li>
      </ul>
      <button
        className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
        type="button"
        data-bs-toggle="offcanvas"
        onClick={() => handleOffCanvas()}
      >
        <span className="mdi mdi-menu" />
      </button>
    </div>
  );
};

export default TopBar;
