/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "../../../routes/menu";
import slugify from "slugify";
import "./custom-styles.css";

const Sidebar = ({ auth }) => {
  const location = useLocation();

  const runToArray = (data) => {
    const arr = [];

    data.map((sing) => arr.push(sing.path));

    return arr;
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        {navigation.map((nav, i) => {
          if (
            nav.roles.some((role) => auth && auth.roleLabels.includes(role))
          ) {
            if (nav.type === "dashboard") {
              return (
                <li
                  className={`nav-item ${
                    location.pathname === nav.path ? " active" : ""
                  }`}
                  key={i}
                >
                  <Link className="nav-link" to={nav.path}>
                    <i className={`mdi menu-icon ${nav.icon}`} />
                    <span className="menu-title">{nav.title}</span>
                  </Link>
                </li>
              );
            } else if (nav.type === "category") {
              return (
                <div key={i}>
                  <li className="nav-item nav-category">{nav.title}</li>
                  {nav.children.length > 0 &&
                    nav.children.map((child, key) => {
                      if (
                        child.roles.some(
                          (rl) => auth && auth.roleLabels.includes(rl)
                        )
                      ) {
                        if (child.children.length == 0) {
                          return (
                            <li
                              className={`nav-item ${
                                location.pathname === child.path
                                  ? " active"
                                  : ""
                              }`}
                              key={key}
                            >
                              <Link className="nav-link" to={child.path}>
                                <i className={`menu-icon mdi ${child.icon}`} />
                                <span className="menu-title">
                                  {child.title}
                                </span>
                              </Link>
                            </li>
                          );
                        } else {
                          return (
                            <li
                              className={`nav-item ${
                                runToArray(child.children).includes(
                                  location.pathname
                                )
                                  ? "active"
                                  : ""
                              }`}
                              key={key}
                            >
                              <a
                                className="nav-link"
                                data-bs-toggle="collapse"
                                href={`#${slugify(child.title)}`}
                                aria-expanded="false"
                                aria-controls={slugify(child.title)}
                              >
                                <i className={`menu-icon mdi ${child.icon}`} />
                                <span className="menu-title">
                                  {child.title}
                                </span>
                                <i className="menu-arrow" />
                              </a>
                              <div
                                className="collapse"
                                id={slugify(child.title)}
                              >
                                <ul className="nav flex-column sub-menu">
                                  {child.children.length > 0 &&
                                    child.children.map(
                                      (sub, i) =>
                                        sub.roles.some(
                                          (srl) =>
                                            auth &&
                                            auth.roleLabels.includes(srl)
                                        ) && (
                                          <li className="nav-item" key={i}>
                                            <Link
                                              className="nav-link"
                                              to={sub.path}
                                            >
                                              {sub.title}
                                            </Link>
                                          </li>
                                        )
                                    )}
                                </ul>
                              </div>
                            </li>
                          );
                        }
                      }
                    })}
                </div>
              );
            } else {
              return (
                <li
                  className={`nav-item ${
                    location.pathname === nav.path ? "active" : ""
                  }`}
                  key={i}
                >
                  <Link className="nav-link" to={nav.path}>
                    <i className={`mdi menu-icon ${nav.icon}`} />
                    <span className="menu-title">{nav.title}</span>
                  </Link>
                </li>
              );
            }
          }
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
