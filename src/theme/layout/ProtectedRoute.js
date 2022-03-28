import React from "react";
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

  const handleLogOut = () => {
    dispatch(disembark());
    navigate("/login");
  };

  return (
    <div className="container-scroller">
      <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
        <Brand />
        <TopBar auth={auth} logOut={handleLogOut} />
      </nav>
      <div className="container-fluid page-body-wrapper">
        <Sidebar auth={auth} />
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
  );
};

export default ProtectedRoute;
