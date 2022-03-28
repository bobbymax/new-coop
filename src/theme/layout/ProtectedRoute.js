import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { disembark } from "../../features/auth/userSlice";
import Brand from "../components/commons/Brand";
import Footer from "../components/commons/Footer";
import Sidebar from "../components/commons/Sidebar";
import TopBar from "../components/commons/TopBar";

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth.value.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [iconsOnly, setIconsOnly] = useState(false);
  const [offCanvas, setOffCanvas] = useState(false);

  const handleLogOut = () => {
    dispatch(disembark());
    navigate("/login");
  };

  const handleSideBarToggle = () => {
    setIconsOnly(!iconsOnly);
  };

  const handleOffCanvas = () => {
    setOffCanvas(!offCanvas);
  };

  return (
    <div className={`${iconsOnly ? "sidebar-icon-only" : ""}`}>
      <div className="container-scroller">
        <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
          <Brand handleToggle={handleSideBarToggle} />
          <TopBar
            auth={auth}
            logOut={handleLogOut}
            handleOffCanvas={handleOffCanvas}
          />
        </nav>
        <div className="container-fluid page-body-wrapper">
          <Sidebar auth={auth} offCanvas={offCanvas} />
          <div className="main-panel">
            <div className="content-wrapper">
              <div className="row">
                {auth ? children : <Navigate to="/login" />}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedRoute;
