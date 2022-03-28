import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";

const LoanAction = ({ handleApproval, ...props }) => {
  const initialState = {
    remark: "",
    status: "",
  };

  const [actionState, setActionState] = useState(initialState);

  const handleClose = () => {
    setActionState(initialState);
    props.onHide();
  };

  const handleSubmit = () => {
    handleApproval(actionState);
    setActionState(initialState);
    props.onHide();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {`Assign Role to Member`.toUpperCase()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CustomSelect
          value={actionState.status}
          onChange={(e) =>
            setActionState({
              ...actionState,
              status: e.target.value,
            })
          }
          size="lg"
        >
          <CustomSelectOptions disabled value="" label="Select Status" />
          {["Approved", "Declined"].map((act, i) => (
            <CustomSelectOptions
              key={i}
              label={act}
              value={act.toLowerCase()}
            />
          ))}
        </CustomSelect>
        {actionState.status === "decline" && (
          <TextInputField
            placeholder="Enter Reason"
            value={actionState.remark}
            onChange={(e) =>
              setActionState({ ...actionState, remark: e.target.value })
            }
            size="lg"
            multiline={4}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
        <Button type="button" className="btn btn-danger" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanAction;
