import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo/logo.png";
import TextInputField from "../../theme/components/form/TextInputField";
import { login } from "../../services/requests/auth.controller";
import { authenticate } from "../../features/auth/userSlice";

const Login = () => {
  const initialState = {
    staff_no: "",
    password: "",
    error: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (state.staff_no !== "" && state.password !== "") {
      const data = {
        staff_no: state.staff_no,
        password: state.password,
      };

      try {
        setLoading(true);
        login(data)
          .then((res) => {
            setTimeout(() => {
              dispatch(authenticate(res.data));
              setState(initialState);
              navigate("/");
            }, 2000);
          })
          .catch((err) => {
            setLoading(false);
            setState({
              ...state,
              error: err.message,
            });
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      setState({
        ...state,
        error: "fields are required",
      });
    }
  };

  return (
    <div className="col-lg-5 mx-auto">
      <div className="auth-form-light text-left py-5 px-4 px-sm-5">
        <div className="brand-logo">
          <img src={logo} alt="logo" />
        </div>
        <form onSubmit={handleSubmit} className="pt-3">
          <TextInputField
            label="Membership No."
            value={state.staff_no}
            onChange={(e) => setState({ ...state, staff_no: e.target.value })}
            placeholder="Enter Membership Number"
            id="exampleInputEmail1"
            size="lg"
          />

          <TextInputField
            label="Password"
            type="password"
            value={state.password}
            onChange={(e) => setState({ ...state, password: e.target.value })}
            placeholder="Enter Password Here"
            id="exampleInputPassword1"
            size="lg"
          />

          <div className="mt-3">
            <button
              className="btn btn-block btn-success btn-lg font-weight-medium auth-form-btn"
              type="submit"
              disabled={loading}
            >
              SIGN IN
            </button>
          </div>

          <div className="text-center mt-4 fw-light">
            Not a Member?{" "}
            <Link to="/register" className="text-success">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
