import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { collection } from "../../../../../services/requests/controllers";
import CustomSelect from "../../../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../../../theme/components/form/select/CustomSelectOptions";

const AssignRoleToMember = ({ handleRoleSubmit, ...props }) => {
  const initialModalState = {
    role_id: 0,
  };
  const [modalState, setModalState] = useState(initialModalState);
  const [roles, setRoles] = useState([]);

  const handleClose = () => {
    setModalState(initialModalState);
    props.onHide();
  };

  const handleSubmit = () => {
    handleRoleSubmit(modalState);
    setModalState(initialModalState);
    props.onHide();
  };

  useEffect(() => {
    try {
      collection("roles")
        .then((res) => setRoles(res.data.data))
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
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
          {`Assign Role to Member`.toUpperCase()}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CustomSelect
          value={modalState.role_id}
          onChange={(e) =>
            setModalState({
              ...modalState,
              role_id: parseInt(e.target.value),
            })
          }
          size="lg"
        >
          <CustomSelectOptions disabled value={0} label="Select Role" />
          {roles.length > 0 &&
            roles.map((role) => (
              <CustomSelectOptions
                key={role.id}
                label={role.name}
                value={role.id}
              />
            ))}
        </CustomSelect>
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

export default AssignRoleToMember;
