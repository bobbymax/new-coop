/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getMonthsArr,
  getRange,
  money,
} from "../../../services/helpers/functions";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";
import LoanJS from "loanjs";
import "./loan.css";
import moment from "moment";
import { alter } from "../../../services/requests/controllers";

const Decision = () => {
  const initialState = {
    id: 0,
    code: "",
    amount: 0,
    previousAmount: 0,
    tenor: 0,
    frequency: "",
    capitalSum: 0,
    committment: 0,
    interestSum: 0,
    sum: 0,
    guarantors: [],
    restrictions: [],
  };

  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState(initialState);
  const [budgetHead, setBudgetHead] = useState({});
  const [loan, setLoan] = useState({});
  const [installments, setInstallments] = useState([]);
  const [update, setUpdate] = useState(false);

  const columns = [
    { key: "due", label: "Due Date", format: "date" },
    { key: "capital", label: "Capital", format: "currency" },
    { key: "installment", label: "Installment", format: "currency" },
    { key: "interest", label: "Interest", format: "currency" },
    { key: "interestSum", label: "Interest Sum", format: "currency" },
    { key: "remain", label: "Balance", format: "currency" },
  ];

  const handleSubmit = () => {
    const data = {
      amount: state.amount,
      previousAmount: state.previousAmount,
      capitalSum: state.capitalSum,
      committment: state.committment,
      interestSum: state.interestSum,
      totalPayable: state.sum,
      instructions: installments,
    };

    // console.log(data);

    try {
      alter("loans", state.id, data)
        .then((res) => {
          const result = res.data;

          navigate("/loan/decision", {
            state: {
              loan: result.data,
              status: result.message,
            },
          });
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const getSlicedMonths = (count) => {
    const d = new Date();
    const date = d.getDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    const spread = Math.ceil(count / 12);
    const months = getMonthsArr();
    const selectedMonth = date > 15 ? month + 1 : month;
    const newMonths = months.slice(selectedMonth);
    const newArr = [];

    for (let i = 0; i <= spread; i++) {
      const startPoints = i == 0 ? newMonths : months;
      const newYear = year + i;
      startPoints.map((month, i) => {
        const newDate = moment(newYear + "-" + month + "-" + 26).format("LL");
        return newArr.push(newDate);
      });
    }

    return newArr.slice(0, count);
  };

  useEffect(() => {
    if (state.amount != state.previousAmount || state.tenor > 0) {
      console.log("here");

      const committment =
        budgetHead.commitment > 0
          ? state.amount * (budgetHead.commitment / 100)
          : 0;

      const loanAmount =
        budgetHead.commitment > 0 && committment > 0
          ? state.amount - committment
          : state.amount;

      const interestRate =
        state.frequency !== "monthly"
          ? budgetHead.interest * 12
          : budgetHead.interest;

      const schedule = LoanJS.Loan(loanAmount, state.tenor, interestRate);

      const sum = committment > 0 ? schedule.sum + committment : schedule.sum;
      schedule["committment"] = committment;
      schedule.sum = sum;

      const newArrs = getSlicedMonths(schedule.installments.length);

      const installments =
        schedule.installments &&
        schedule.installments.map((inst, i) => {
          inst["due"] = newArrs[i];
          return inst;
        });

      setInstallments(installments);
      setState({
        ...state,
        capitalSum: schedule.capitalSum,
        committment: schedule.committment,
        interestSum: schedule.interestSum,
        sum: schedule.sum,
      });
    }
  }, [state.amount, state.tenor]);

  useEffect(() => {
    if (location.state && location.state.loan && location.state.budget) {
      const data = location.state.loan;
      const budget = location.state.budget;
      const installments = data ? data.instructions : [];
      const minimumRepaymentTenor =
        budget && budget.frequency === "monthly" ? 3 : 1;

      setLoan(data);
      setBudgetHead(budget);
      setInstallments(installments);

      setState({
        ...state,
        id: data ? data.id : 0,
        code: data ? data.code : "",
        amount: data ? parseFloat(data.amount) : 0,
        previousAmount: data ? parseFloat(data.amount) : 0,
        tenor: data && data.instructions ? data.instructions.length : 0,
        frequency: budget && budget.frequency,
        capitalSum: data ? parseFloat(data.capitalSum) : 0,
        committment: data ? parseFloat(data.committment) : 0,
        interestSum: data ? parseFloat(data.interestSum) : 0,
        sum: data ? parseFloat(data.totalPayable) : 0,
        guarantors: data ? data.sponsors : [],
        restrictions: budget
          ? getRange(minimumRepaymentTenor, budget.restriction)
          : [],
      });
    }
  }, []);

  // console.log(loan, state);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-4">
          <button
            type="button"
            className="btn btn-warning btn-rounded"
            onClick={() => setUpdate(true)}
            disabled={update}
          >
            MANAGE LOAN
          </button>
        </div>
        <div className="col-md-12">
          <div className="loan-card">
            <h5 className="card-title text-muted">{`${loan.code} - ${loan.reason}`}</h5>
            <h2 className="text-success">{money(loan.amount)}</h2>
            <p className="text-muted mb-0">
              {budgetHead && budgetHead.description}
            </p>
            <ul className="list-group list-group-horizontal-sm mt-3">
              {state.guarantors.length > 0 &&
                state.guarantors.map((sponsor, i) => (
                  <li key={i} className="list-group-item">
                    {sponsor.member.firstname.toUpperCase() +
                      " " +
                      sponsor.member.surname.toUpperCase()}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="col-md-12 mt-3">
          <div className="row">
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">CAPITAL SUM</p>
                <h5 className="text-success">{money(state.capitalSum ?? 0)}</h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">COMMITTMENT</p>
                <h5 className="text-success">
                  {money(state.committment ?? 0)}
                </h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">INTEREST SUM</p>
                <h5 className="text-success">
                  {money(state.interestSum ?? 0)}
                </h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">AMOUNT PAYABLE</p>
                <h5 className="text-success">{money(state.sum ?? 0)}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 mt-3">
          <div className="row">
            <div className="col-md-7">
              <TextInputField
                placeholder="ENTER NEW AMOUNT"
                type="number"
                value={state.amount}
                onChange={(e) =>
                  setState({ ...state, amount: parseFloat(e.target.value) })
                }
                size="lg"
                disabled={!update}
              />
            </div>
            <div className="col-md-5">
              <CustomSelect
                size="lg"
                value={state.tenor}
                onChange={(e) =>
                  setState({
                    ...state,
                    tenor: parseInt(e.target.value),
                  })
                }
                disabled={!update}
              >
                <CustomSelectOptions
                  label="SELECT RE-PAYMENT TENOR"
                  value={0}
                  disabled
                />

                {state.restrictions.map((rest, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={rest}
                    label={
                      rest +
                      `${state.frequency === "monthly" ? " Months" : " Years"}`
                    }
                  />
                ))}
              </CustomSelect>
            </div>
          </div>
        </div>

        <div className="col-md-12 mt-3">
          <TableCard columns={columns} rows={installments} />
        </div>
        <div className="col-md-12 mt-3">
          <div className="loan-card">
            <p className="text-muted">
              BY CLICKING ON APPROVE, YOU HAVE AGREED TO THE TERMS AND
              CONDITIONS SURROUNDING THIS LOAN APPLICATION. IF YOU STILL WANT TO
              PROCEED CLICK APPROVE, ELSE CANCEL.
            </p>
          </div>
        </div>
        <div className="col-md-12 mt-3">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-success btn-rounded"
              onClick={handleSubmit}
            >
              APPROVE
            </button>
            <button
              type="button"
              className="btn btn-danger btn-rounded"
              onClick={() => setUpdate(false)}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Decision;
