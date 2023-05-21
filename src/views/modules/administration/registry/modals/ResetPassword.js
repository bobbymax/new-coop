/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TextInputField from "../../../../../theme/components/form/TextInputField";

const ResetPassword = ({ handlePasswordReset, ...props }) => {
  const initialPasswordState = {
    member_no: "",
    password: "",
    confirmPassword: "",
    changePasswordOnLogin: false,
  };

  const [passwordState, setPasswordState] = useState(initialPasswordState);
  const [error, setError] = useState("");

  const resetPassword = () => {
    if (passwordState.password === passwordState.confirmPassword) {
      handlePasswordReset(passwordState.password);
      setPasswordState(initialPasswordState);
      setError("");
      props.onHide();
    } else {
      setError("Passwords do not match!! Please fix this");
    }
  };

  const handlePasswordResetClose = () => {
    setPasswordState(initialPasswordState);
    setError("");
    props.onHide();
  };

  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {`Reset Password`.toUpperCase()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          {error !== "" && (
            <div className="col-md-12">
              <div className="alert alert-danger">{error}</div>
            </div>
          )}
          <div className="col-md-12">
            <TextInputField
              placeholder="Enter Password"
              label="New Password"
              value={passwordState.password}
              onChange={(e) =>
                setPasswordState({
                  ...passwordState,
                  password: e.target.value,
                })
              }
              size="lg"
              type="password"
            />
          </div>
          <div className="col-md-12">
            <TextInputField
              placeholder="Confirm Password"
              label="Confirm Password"
              value={passwordState.confirmPassword}
              onChange={(e) =>
                setPasswordState({
                  ...passwordState,
                  confirmPassword: e.target.value,
                })
              }
              size="lg"
              type="password"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={resetPassword}
          disabled={
            passwordState.password === "" ||
            passwordState.confirmPassword === "" ||
            passwordState.password !== passwordState.confirmPassword
          }
        >
          Submit
        </Button>
        <Button
          type="button"
          className="btn btn-danger"
          onClick={handlePasswordResetClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResetPassword;
