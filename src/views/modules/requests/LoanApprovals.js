/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../../../services/helpers/classes/Alert";
import { money } from "../../../services/helpers/functions";
import { collection, store } from "../../../services/requests/controllers";
import LoanAction from "./LoanAction";

const LoanApprovals = () => {
  const initialState = {
    id: 0,
    user_id: 0,
    loan_id: 0,
    loan: null,
  };
  const auth = useSelector((state) => state.auth.value.user);
  const [state, setState] = useState(initialState);
  const [loans, setLoans] = useState([]);
  const [stage, setStage] = useState("");
  const [level, setLevel] = useState(0);
  const [show, setShow] = useState(false);

  const handleApproval = (actionState) => {
    const data = {
      loan_id: state.loan_id,
      remark: actionState.remark,
      status: actionState.status,
      level: level,
      stage: stage,
    };

    try {
      store("mandates", data)
        .then((res) => {
          const result = res.data;

          setLoans(loans.filter((loan) => loan && loan.id != result.data.id));
          Alert.success("Updated!!", result.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const actOnLoan = (data) => {
    setState({
      ...state,
      loan_id: data,
    });
    setShow(true);
  };

  useEffect(() => {
    try {
      collection("loans").then((res) => {
        const result = res.data.data;
        let lev = 0;
        const loadedLoans = result.filter(
          (loan) =>
            loan &&
            loan.status === "registered" &&
            auth.roleLabels.includes(loan.stage)
        );
        const stag = loadedLoans.length > 0 && loadedLoans[0].stage;

        if (stag && stag === "treasury-officer") {
          lev = 1;
        } else if (stag && stag === "general-secretary") {
          lev = 2;
        } else if (stag && stag === "president") {
          lev = 3;
        }

        setLevel(lev);
        setLoans(loadedLoans);
        setStage(loadedLoans.length > 0 ? loadedLoans[0].stage : "");
      });
    } catch (error) {
      console.log(error);
    }
  }, [auth]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card-area">
            <div className="row">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <div className="col-md-4" key={loan.id}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-subtitle card-subtitle-dash mb-2 text-muted">
                          <span
                            className="badge badge-success"
                            style={{ fontSize: 9 }}
                          >
                            {loan.budget_head_name}
                          </span>
                        </p>
                        <h4 className="card-title card-title-dash">
                          {loan.name.toUpperCase()}
                        </h4>
                        <p className="card-subtitle card-subtitle-dash mt-0">
                          {loan.reason}
                        </p>

                        <div className="d-sm-flex align-items-center mt-2 justify-content-between">
                          <h3 className="me-2 fw-bold text-success">
                            {money(loan.amount)}
                          </h3>
                        </div>

                        <div className="btn-group mt-3">
                          <button
                            className="btn btn-xs btn-warning"
                            onClick={() => actOnLoan(loan.id)}
                            disabled={level != 1}
                          >
                            {auth.roleLabels.includes(stage) && level == 1
                              ? "MANAGE LOAN"
                              : "..."}
                          </button>
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => actOnLoan(loan.id)}
                            disabled={level != 2}
                          >
                            {auth.roleLabels.includes(stage) && level == 2
                              ? "MANAGE LOAN"
                              : "..."}
                          </button>
                          <button
                            className="btn btn-xs btn-info"
                            onClick={() => actOnLoan(loan.id)}
                            disabled={level != 3}
                          >
                            {auth.roleLabels.includes(stage) && level == 3
                              ? "MANAGE LOAN"
                              : "..."}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-md-12">
                  <div className="alert alert-danger">
                    There are no loan requests at the moment!!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoanAction
        show={show}
        onHide={() => setShow(false)}
        handleApproval={handleApproval}
      />
    </>
  );
};

export default LoanApprovals;
