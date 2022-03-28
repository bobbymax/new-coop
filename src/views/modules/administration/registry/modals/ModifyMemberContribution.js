import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import TextInputField from "../../../../../theme/components/form/TextInputField";

const ModifyMemberContribution = ({ modifyContribution, ...props }) => {
  const [newFee, setNewFee] = useState(0);

  const handleContributionClose = () => {
    setNewFee(0);
    props.onHide();
  };

  const handleContributionSubmit = () => {
    modifyContribution(newFee);
    setNewFee(0);
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
          {`Modify Member's Contribution`.toUpperCase()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <TextInputField
          label="ENTER NEW AMOUNT"
          type="number"
          value={newFee}
          onChange={(e) => setNewFee(parseFloat(e.target.value))}
          size="lg"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleContributionSubmit}>
          Submit
        </Button>
        <Button
          type="button"
          className="btn btn-danger"
          onClick={handleContributionClose}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifyMemberContribution;
