/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CustomSelect from "../../../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../../../theme/components/form/TextInputField";

const ModifyMemberAccount = ({ type = "", handleModification, ...props }) => {
  const initialModifyState = {
    membership_no: "",
    type: "",
    date_joined: "",
  };

  const [modifyState, setModifyState] = useState(initialModifyState);

  const handleModifySubmit = () => {
    handleModification(modifyState);
    setModifyState(initialModifyState);
    props.onHide();
  };

  const handleModifyClose = () => {
    setModifyState(initialModifyState);
    props.onHide();
  };

  useEffect(() => {
    setModifyState({
      ...modifyState,
      type: type,
    });
  }, []);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {`Modify Account`.toUpperCase()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-4">
            <TextInputField
              placeholder="Enter Membership No."
              label="Membership Number"
              value={modifyState.membership_no}
              onChange={(e) =>
                setModifyState({
                  ...modifyState,
                  membership_no: e.target.value,
                })
              }
              size="lg"
            />
          </div>
          <div className="col-md-4">
            <CustomSelect
              label="Member Type"
              value={modifyState.type}
              onChange={(e) =>
                setModifyState({
                  ...modifyState,
                  type: e.target.value,
                })
              }
              size="lg"
            >
              <CustomSelectOptions
                disabled
                value=""
                label="Select Member Type"
              />
              {["Exco", "Member"].map((typ, i) => (
                <CustomSelectOptions
                  key={i}
                  label={typ}
                  value={typ.toLowerCase()}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-4">
            <TextInputField
              type="date"
              label="Date Joined"
              value={modifyState.date_joined}
              onChange={(e) =>
                setModifyState({
                  ...modifyState,
                  date_joined: e.target.value,
                })
              }
              size="lg"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleModifySubmit}>
          Submit
        </Button>
        <Button
          type="button"
          className="btn btn-danger"
          onClick={handleModifyClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyMemberAccount;
