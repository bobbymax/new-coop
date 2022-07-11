/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../../../services/helpers/classes/Alert";
import {
  batchRequests,
  collection,
} from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";
import Select from "react-select";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const Loans = () => {
  const initialState = {
    id: 0,
    code: "",
    amount: 0,
    budget_head_id: 0,
    reason: "",
    description: "",
    guarantors: [],
    budgetHead: null,
    hasLoan: false,
  };

  const location = useLocation();

  const statusState = {
    eligible: false,
    availability: false,
    withinLimit: false,
    mssgs: [],
  };

  const [state, setState] = useState(initialState);
  const [loanStatus, setLoanStatus] = useState(statusState);
  const [loans, setLoans] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  // const [update, setUpdate] = useState(false);

  const auth = useSelector((state) => state.auth.value.user);
  const navigate = useNavigate();

  const columns = [
    { key: "code", label: "Reference" },
    { key: "budget_head_name", label: "Category" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status" },
  ];

  // const handleUpdate = (data) => {
  //   setState({
  //     ...state,
  //     id: data.id,
  //     code: data.code,
  //     amount: data.amount,
  //     budget_head_id: data.budget_head_id,
  //     reason: data.reason,
  //     description: data.description,
  //     guarantors: data.guarantors,
  //   });
  // };

  const handleChange = (e) => {
    setState({
      ...state,
      guarantors: e,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let d = new Date();

    const data = {
      code: "LN" + d.getTime(),
      amount: state.amount,
      budget_head_id: state.budget_head_id,
      reason: state.reason,
      description: state.description,
      guarantors: state.guarantors,
    };

    console.log(data);

    navigate(`/loans/${data.code}/calculate`, {
      state: {
        loan: data,
        budgetHead: state.budgetHead,
      },
    });
  };

  // const handleDestroy = (data) => {
  //   Alert.flash(
  //     "Are you sure?",
  //     "warning",
  //     "You would not be able to revert this!!"
  //   ).then((result) => {
  //     if (result.isConfirmed) {
  //       destroy("loans", data)
  //         .then((res) => {
  //           setLoans([...loans.filter((loan) => loan.id != res.data.data.id)]);
  //           Alert.success("Deleted!!", res.data.message);
  //         })
  //         .catch((err) => console.log(err.message));
  //     }
  //   });
  // };

  const checkHasLoan = () => {
    const hasLoan = loans.filter(
      (loan) => loan.status === "pending" || loan.status !== "closed"
    );

    return hasLoan.length > 0 ? true : false;
  };

  useEffect(() => {
    if (location.state && location.state.loan && location.state.status) {
      const loan = location.state.loan;
      const status = location.state.status;

      setLoans([loan, ...loans]);
      Alert.success("Registered!!", status);
    }
  }, []);

  useEffect(() => {
    if (state.amount > 0 && state.budget_head_id > 0 && auth !== null) {
      const mssgs = [];
      const budgetHeadFilter = budgetHeads.filter(
        (budgt) => budgt?.id == state.budget_head_id
      );
      const budgetHead = budgetHeadFilter[0];

      const eligible = parseFloat(auth?.wallet?.current) * 2 >= state.amount;

      const availability =
        parseFloat(budgetHead?.fund?.actual_balance) > state.amount;

      const limit = parseFloat(budgetHead?.limit) > state.amount;

      mssgs.push(
        eligible
          ? { status: "success", body: "You are eligible for this loan" }
          : {
              status: "danger",
              body: "You are not eligible to apply for this loan",
            }
      );
      mssgs.push(
        availability
          ? { status: "success", body: "There are funds available" }
          : {
              status: "danger",
              body: "There are no funds available for this category",
            }
      );

      mssgs.push(
        limit
          ? {
              status: "success",
              body: "You are within the limits of this application",
            }
          : {
              status: "danger",
              body: "You cannot exceed the limits of this loan category",
            }
      );

      setState({
        ...state,
        budgetHead: budgetHead,
      });

      setLoanStatus({
        eligible: eligible,
        availability: availability,
        withinLimit: limit,
        mssgs: mssgs,
      });
    } else {
      setLoanStatus(statusState);
    }
  }, [state.amount, state.budget_head_id, auth]);

  useEffect(() => {
    try {
      collection("loans")
        .then((res) => {
          const result = res.data.data;
          setLoans(result.filter((loan) => loan && loan.user_id == auth.id));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      const membersData = collection("members");
      const budgetHeadsData = collection("budgetHeads");

      batchRequests([membersData, budgetHeadsData])
        .then(
          axios.spread((...res) => {
            const mems = res[0].data.data;
            const heads = res[1].data.data;
            const newData = [];
            const filtered = mems.filter(
              (user) => user && user.id != auth.id && !user.isAdministrator
            );

            filtered.map((ff) =>
              newData.push({
                value: ff.id,
                label: ff.firstname + " " + ff.surname,
              })
            );

            setBudgetHeads(
              heads.filter((budget) => budget && budget.category === "loan")
            );
            setMembers(newData);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <button
            type="button"
            className="btn btn-success btn-rounded mb-3"
            onClick={() => setOpen(true)}
            disabled={open || checkHasLoan()}
          >
            Request Loan
          </button>
        </div>

        {open && (
          <>
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title mt-3 mb-2">Request Loan</h3>
                </div>
                <div className="card-body">
                  {loanStatus.mssgs.length > 0 &&
                    loanStatus.mssgs.map((mssg, i) => (
                      <div className="col-md-12 mb-3" key={i}>
                        <div className={`alert alert-${mssg.status}`}>
                          {mssg.body}
                        </div>
                      </div>
                    ))}
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <TextInputField
                          label="Amount"
                          size="lg"
                          type="number"
                          value={state.amount}
                          onChange={(e) =>
                            setState({ ...state, amount: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-6">
                        <CustomSelect
                          label="Category"
                          size="lg"
                          value={state.budget_head_id}
                          onChange={(e) =>
                            setState({
                              ...state,
                              budget_head_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <CustomSelectOptions
                            label="Select Loan Category"
                            value={0}
                            disabled
                          />

                          {budgetHeads.length > 0 &&
                            budgetHeads.map((budget) => (
                              <CustomSelectOptions
                                key={budget.id}
                                value={budget.id}
                                label={budget.description.toUpperCase()}
                              />
                            ))}
                        </CustomSelect>
                      </div>
                      <div className="col-md-12">
                        <TextInputField
                          label="Reason"
                          size="lg"
                          placeholder="Enter Reason"
                          value={state.reason}
                          onChange={(e) =>
                            setState({ ...state, reason: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-12">
                        <Select
                          closeMenuOnSelect={false}
                          isMulti
                          options={members}
                          value={state.guarantors}
                          onChange={handleChange}
                          isDisabled={state.guarantors.length == 3}
                        />
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="btn-group">
                          <button
                            type="submit"
                            className="btn btn-success btn-rounded"
                            disabled={
                              state.amount == 0 ||
                              state.budget_head_id == 0 ||
                              state.reason === "" ||
                              state.guarantors.length < 1
                            }
                          >
                            Submit
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-rounded"
                            onClick={() => {
                              setOpen(false);
                              setState(initialState);
                              setLoanStatus(statusState);
                            }}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="col-md-12">
          <TableCard columns={columns} rows={loans} />
        </div>
      </div>
    </>
  );
};

export default Loans;
