/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../../../services/helpers/classes/Alert";
import { money } from "../../../services/helpers/functions";
import {
  alter,
  batchRequests,
  collection,
  destroy,
  fetch,
  store,
} from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";

const Expenditures = () => {
  const initialState = {
    id: 0,
    budget_head_id: 0,
    chart_of_account_id: 0,
    payment_type: "",
    type: "",
    code: "",
    beneficiary: "",
    actual_balance: 0,
    new_balance: 0,
    loan_id: 0,
    description: "",
    amount: 0,
    loanReferenceCode: "",
  };
  const auth = useSelector((state) => state.auth.value.user);
  const [state, setState] = useState(initialState);
  const [expenditures, setExpenditures] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const columns = [
    { key: "code", label: "Reference Number" },
    { key: "chartOfAccountName", label: "Account Name" },
    { key: "beneficiary", label: "Beneficiary" },
    { key: "amount", label: "Amount", format: "currency" },
  ];

  const paymentTypes = [
    { value: "member-payment", label: "Member Payment", code: "MMP" },
    { value: "staff-payment", label: "Staff Payment", code: "STP" },
    { value: "third-party", label: "Third Party", code: "TPP" },
    { value: "custom", label: "Custom", code: "CSP" },
  ];

  const handleUpdate = (data) => {
    setState({
      id: data.id,
      budget_head_id: data.budget_head_id,
      chart_of_account_id: data.chart_of_account_id,
      payment_type: data.payment_type,
      type: data.type,
      code: data.code,
      beneficiary: data.beneficiary,
      loan_id: data.loan_id,
      description: data.description,
      amount: parseFloat(data.amount),
    });
    setOpen(true);
    setUpdate(true);
  };

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("disbursements", data)
          .then((res) => {
            setExpenditures([
              ...expenditures.filter((exp) => exp.id != res.data.data.id),
            ]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      budget_head_id: state.budget_head_id,
      chart_of_account_id: state.chart_of_account_id,
      payment_type: state.payment_type,
      code: state.code,
      beneficiary: state.beneficiary,
      loan_id: state.loan_id,
      description: state.description,
      amount: state.amount,
    };

    if (update) {
      try {
        alter("disbursements", state.id, data)
          .then((res) => {
            const result = res.data;

            setExpenditures(
              expenditures.map((exp) => {
                if (exp.id == result.data.id) {
                  return result.data;
                }

                return exp;
              })
            );

            Alert.success("Updated!!", result.data);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        store("disbursements", data)
          .then((res) => {
            const result = res.data;
            setExpenditures([result.data, ...expenditures]);
            Alert.success("Created!!", result.message);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
    setState(initialState);
    setOpen(false);
    setUpdate(false);
  };

  useEffect(() => {
    if (state.chart_of_account_id > 0 && state.payment_type !== "") {
      const chartAccount = chartOfAccounts.filter(
        (account) => account && account.id == state.chart_of_account_id
      );
      const payType = paymentTypes.filter(
        (typ) => typ.value === state.payment_type
      );
      const digitCode = Math.floor(Math.random() * 90000) + 10000;

      const expenditureCode =
        chartAccount[0].code + payType[0].code + digitCode;

      setState({
        ...state,
        code: expenditureCode,
      });
    }
  }, [state.chart_of_account_id, state.payment_type]);

  useEffect(() => {
    if (state.budget_head_id > 0) {
      const budget = budgetHeads.filter(
        (budgt) => budgt.id == state.budget_head_id
      );
      const fund = budget && budget[0].fund;

      setState({
        ...state,
        actual_balance: fund ? fund.booked_balance : 0,
      });
    }
  }, [state.budget_head_id]);

  useEffect(() => {
    if (state.loanReferenceCode !== "") {
      try {
        fetch("fetch/loans", state.loanReferenceCode)
          .then((res) => {
            const data = res.data.data;
            const beneficiary =
              data.owner.firstname.toUpperCase() +
              " " +
              data.owner.surname.toUpperCase();

            setState({
              ...state,
              loan_id: data.id,
              budget_head_id: data.budget_head_id,
              beneficiary: beneficiary,
              amount: parseFloat(data.amount),
            });
            console.log(data);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    } else {
      setState({
        ...state,
        loan_id: 0,
        budget_head_id: 0,
        beneficiary: "",
        actual_balance: 0,
        new_balance: 0,
        amount: 0,
      });
    }
  }, [state.loanReferenceCode]);

  useEffect(() => {
    if (state.amount > 0 && parseFloat(state.actual_balance) > 0) {
      const diff = parseFloat(state.actual_balance) - state.amount;

      setState({
        ...state,
        new_balance: diff,
      });
    }
  }, [state.amount, state.actual_balance]);

  useEffect(() => {
    if (auth !== null) {
      try {
        collection("disbursements")
          .then((res) => {
            const result = res.data.data;

            setExpenditures(
              result.filter((exp) => exp && exp.user_id == auth.id)
            );
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth]);

  useEffect(() => {
    try {
      const chartOfAccountsData = collection("chartOfAccounts");
      const budgetHeadsData = collection("budgetHeads");

      batchRequests([chartOfAccountsData, budgetHeadsData])
        .then(
          axios.spread((...res) => {
            const charts = res[0].data.data;
            const budgets = res[1].data.data;

            setChartOfAccounts(charts);
            setBudgetHeads(budgets);
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
        <div className="col-md-12 mb-3">
          <button
            type="button"
            className="btn btn-success btn-rounded"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Create Expenditure
          </button>
        </div>
        {open && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3 mb-2">Create Expenditure</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12">
                      <TextInputField
                        label="Expenditure Code"
                        size="lg"
                        value={state.code}
                        onChange={(e) =>
                          setState({
                            ...state,
                            code: e.target.value,
                          })
                        }
                        disabled
                      />
                    </div>
                    <div className="col-md-4">
                      <CustomSelect
                        label="Account Code"
                        size="lg"
                        value={state.chart_of_account_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            chart_of_account_id: parseInt(e.target.value),
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Account Code"
                          value={0}
                          disabled
                        />

                        {chartOfAccounts.length > 0 &&
                          chartOfAccounts.map((account) => (
                            <CustomSelectOptions
                              key={account.id}
                              label={account.name}
                              value={account.id}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-4">
                      <CustomSelect
                        label="Payment Type"
                        size="lg"
                        value={state.payment_type}
                        onChange={(e) =>
                          setState({
                            ...state,
                            payment_type: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Payment Type"
                          value=""
                          disabled
                        />

                        {paymentTypes.map((payment, i) => (
                          <CustomSelectOptions
                            key={i}
                            label={payment.label}
                            value={payment.value}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="Reference Code"
                        size="lg"
                        placeholder="Enter Reference Code Here"
                        value={state.loanReferenceCode}
                        onChange={(e) =>
                          setState({
                            ...state,
                            loanReferenceCode: e.target.value,
                          })
                        }
                        disabled={state.payment_type !== "member-payment"}
                      />
                    </div>
                    <div className="col-md-12">
                      <CustomSelect
                        label="Sub Budget Head"
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
                          label="Select Sub Budget Head"
                          value={0}
                          disabled
                        />

                        {budgetHeads.length > 0 &&
                          budgetHeads.map((budget) => (
                            <CustomSelectOptions
                              key={budget.id}
                              label={budget.description}
                              value={budget.id}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-6">
                      <TextInputField
                        label="Available Balance"
                        size="lg"
                        value={money(state.actual_balance)}
                        onChange={(e) =>
                          setState({
                            ...state,
                            actual_balance: e.target.value,
                          })
                        }
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <TextInputField
                        label="New Balance"
                        size="lg"
                        value={money(state.new_balance)}
                        onChange={(e) =>
                          setState({
                            ...state,
                            new_balance: e.target.value,
                          })
                        }
                        disabled
                      />
                    </div>
                    <div className="col-md-12">
                      <TextInputField
                        label="Beneficiary"
                        size="lg"
                        placeholder="Enter Beneficiary Here"
                        value={state.beneficiary}
                        onChange={(e) =>
                          setState({
                            ...state,
                            beneficiary: e.target.value,
                          })
                        }
                        disabled={state.payment_type === "member-payment"}
                      />
                    </div>
                    <div className="col-md-12">
                      <TextInputField
                        label="Amount"
                        size="lg"
                        type="number"
                        value={state.amount}
                        onChange={(e) =>
                          setState({
                            ...state,
                            amount: parseFloat(e.target.value),
                          })
                        }
                        disabled={state.payment_type === "member-payment"}
                      />
                    </div>

                    <div className="col-md-12">
                      <TextInputField
                        label="Description"
                        size="lg"
                        placeholder="Enter Payment Description Here"
                        value={state.description}
                        onChange={(e) =>
                          setState({
                            ...state,
                            description: e.target.value,
                          })
                        }
                        multiline={4}
                      />
                    </div>
                    <div className="col-md-12 mt-3">
                      <div className="btn-group">
                        <button
                          type="submit"
                          className="btn btn-success btn-rounded"
                        >
                          Submit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-rounded"
                          onClick={() => {
                            setOpen(false);
                            setUpdate(false);
                            setState(initialState);
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
        )}
        <div className="col-md-12">
          <TableCard
            columns={columns}
            rows={expenditures}
            handleEdit={handleUpdate}
            handleDelete={handleDestroy}
          />
        </div>
      </div>
    </>
  );
};

export default Expenditures;
