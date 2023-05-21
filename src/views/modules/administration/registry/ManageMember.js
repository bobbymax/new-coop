/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../../services/helpers/classes/Alert";
import { alter, fetch, store } from "../../../../services/requests/controllers";
import BasicTable from "../../../../theme/components/tables/BasicTable";
import AssignRoleToMember from "./modals/AssignRoleToMember";
import ModifyMemberAccount from "./modals/ModifyMemberAccount";
import ModifyMemberContribution from "./modals/ModifyMemberContribution";
import ResetPassword from "./modals/ResetPassword";

const ManageMember = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const modalControlState = {
    user_id: 0,
    addRoles: false,
    modify: false,
    contribution: false,
    passwordReset: false,
  };

  const [member, setMember] = useState({});
  const [modalControl, setModalControl] = useState(modalControlState);

  const handleRoleSubmit = (role) => {
    const data = {
      user_id: modalControl.user_id,
      role_id: role.role_id,
    };

    try {
      store("assign/member/role", data)
        .then((res) => {
          const result = res.data;

          setMember(result.data);
          Alert.success("Updated", result.message);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleModification = (modiState) => {
    const data = {
      user_id: modalControl.user_id,
      date_joined: modiState.date_joined,
      membership_no: modiState.membership_no,
      type: modiState.type,
    };

    try {
      alter("modify/members", data.user_id, data)
        .then((res) => {
          const result = res.data;
          setMember(result.data);
          Alert.success("Updated!!", result.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const modifyContribution = (feeState) => {
    const data = {
      user_id: modalControl.user_id,
      fee: feeState,
    };

    try {
      alter("modify/members/contribution", data.user_id, data)
        .then((res) => {
          const result = res.data;
          setMember(result.data);
          Alert.success("Updated!!", result.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const verifyMemberAccount = () => {
    try {
      fetch("verify/members", modalControl.user_id)
        .then((res) => {
          const result = res.data;
          setMember(result.data);
          Alert.success("Verified!!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClosePage = () => {
    navigate("/members");
  };

  const handlePasswordReset = (password) => {
    const data = {
      user_id: member?.id,
      password,
    };

    try {
      store("reset/pass", data)
        .then((res) => {
          const response = res.data;

          setMember(response.data);
          Alert.success("Reset Complete!!", response.message);
          handleClosePage();
        })
        .catch((err) => err.message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (location.state && location.state.member) {
      const data = location.state.member;
      setMember(data);
      setModalControl({
        ...modalControl,
        user_id: data && data.id,
      });
    }
  }, [location.state]);

  const roleColumns = [
    { key: "name", label: "Name" },
    { key: "deactivated", label: "Deactivated" },
  ];

  const contributionColumns = [
    { key: "fee", label: "Amount", format: "currency" },
    { key: "current", label: "Current", format: "falsy" },
    { key: "created_at", label: "Updated At", format: "date" },
  ];

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-4">
          <button
            type="button"
            className="btn btn-rounded btn-primary"
            onClick={() => handleClosePage()}
          >
            Close
          </button>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mt-3">Member Details</h3>
            </div>
            <div className="card-body">
              <table className="table table-bordered table-striped table-hover">
                <tbody>
                  <tr>
                    <td>
                      Firstname: <strong>{member?.firstname}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Middlename:{" "}
                      <strong>
                        {member?.middlename !== null
                          ? member?.middlename
                          : "NONE"}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Surname: <strong>{member && member.surname}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Type: <strong>{member && member.type}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Date Joined:{" "}
                      <strong>
                        {member?.date_joined !== null
                          ? moment(member?.date_joined).format("LL")
                          : "NOT SET!!"}
                      </strong>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Status:{" "}
                      <strong>
                        {member?.status === "active"
                          ? "VERIFIED!!"
                          : "DEACTIVATED"}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mt-3">Manage Record</h3>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button
                  type="button"
                  className="btn btn-danger btn-block"
                  onClick={() =>
                    setModalControl({ ...modalControl, addRoles: true })
                  }
                >
                  ASSIGN ROLES TO MEMBER
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() =>
                    setModalControl({ ...modalControl, modify: true })
                  }
                >
                  MODIFY MEMBER ACCOUNT
                </button>
                <button
                  type="button"
                  className="btn btn-dark btn-block"
                  onClick={() => verifyMemberAccount()}
                  disabled={member?.status === "active"}
                >
                  VERIFY MEMBER
                </button>
                <button
                  type="button"
                  className="btn btn-info btn-block"
                  onClick={() =>
                    setModalControl({ ...modalControl, passwordReset: true })
                  }
                >
                  RESET PASSWORD
                </button>
                <button
                  type="button"
                  className="btn btn-warning btn-block"
                  onClick={() =>
                    setModalControl({ ...modalControl, contribution: true })
                  }
                >
                  MODIFY CONTRIBUTIONS
                </button>
                <button type="button" className="btn btn-success btn-block">
                  PRINT STATEMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12 mb-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mt-2 mb-2">Roles</h3>
            </div>
            <div className="card-body">
              <BasicTable
                columns={roleColumns}
                rows={member?.roles}
                message="No Roles Added to this Member"
              />
            </div>
          </div>
        </div>
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mt-2 mb-2">Contributions</h3>
            </div>
            <div className="card-body">
              <BasicTable
                columns={contributionColumns}
                rows={member?.contributions}
                message="No Roles Added to this Member"
                showColumn
              />
            </div>
          </div>
        </div>
      </div>

      <AssignRoleToMember
        show={modalControl.addRoles}
        onHide={() => setModalControl({ ...modalControl, addRoles: false })}
        handleRoleSubmit={handleRoleSubmit}
      />

      <ModifyMemberAccount
        show={modalControl.modify}
        onHide={() => setModalControl({ ...modalControl, modify: false })}
        handleModification={handleModification}
        type={member?.type}
      />

      <ModifyMemberContribution
        show={modalControl.contribution}
        onHide={() => setModalControl({ ...modalControl, contribution: false })}
        modifyContribution={modifyContribution}
      />

      <ResetPassword
        show={modalControl.passwordReset}
        onHide={() =>
          setModalControl({ ...modalControl, passwordReset: false })
        }
        handlePasswordReset={handlePasswordReset}
      />
    </>
  );
};

export default ManageMember;
