/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TableCard from "../../../theme/components/tables/TableCard";
import LoanJS from "loanjs";
import {
  getMonthsArr,
  getRange,
  money,
} from "../../../services/helpers/functions";
import "./loan.css";
import moment from "moment";
import { store } from "../../../services/requests/controllers";

const LoanRequest = () => {
  const location = useLocation();

  const initialState = {
    tenor: 0,
    restrictions: [],
    frequency: "",
    interest: 0,
    commitment: 0,
  };

  const [state, setState] = useState(initialState);

  const [request, setRequest] = useState({});
  const [budget, setBudget] = useState({});
  const [paymentPlan, setPaymentPlan] = useState({});
  const [installments, setInstallments] = useState([]);

  const navigate = useNavigate();

  const columns = [
    { key: "index", label: "Due Date" },
    { key: "capital", label: "Capital", format: "currency" },
    { key: "installment", label: "Installment", format: "currency" },
    { key: "interest", label: "Interest", format: "currency" },
    { key: "interestSum", label: "Interest Sum", format: "currency" },
    { key: "remain", label: "Balance", format: "currency" },
  ];

  const closeRequest = () => {
    setState(initialState);
    setRequest({});
    setBudget({});
    setPaymentPlan({});
    setInstallments([]);
    navigate("/loans");
  };

  const handleSubmit = () => {
    const data = {
      amount: parseFloat(request.amount),
      code: request.code,
      budget_head_id: request.budget_head_id,
      reason: request.reason,
      guarantors: request.guarantors,
      instructions: installments,
      capitalSum: paymentPlan.capitalSum,
      committment: paymentPlan.committment,
      interestSum: paymentPlan.interestSum,
      totalPayable: paymentPlan.sum,
    };

    try {
      store("loans", data)
        .then((res) => {
          const result = res.data;
          const data = result.data;
          const message = result.message;

          navigate("/loans", {
            state: {
              loan: data,
              status: message,
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

  const handleTenorChange = (e) => {
    const value = parseInt(e.target.value);

    setState({
      ...state,
      tenor: value > 0 ? value : 0,
    });

    const committment =
      budget.commitment > 0 ? request.amount * (budget.commitment / 100) : 0;
    const loanAmount =
      budget.commitment > 0 && committment > 0
        ? request.amount - committment
        : request.amount;

    const interestRate =
      state.frequency !== "monthly" ? budget.interest * 12 : budget.interest;

    const cal = LoanJS.Loan(loanAmount, value, interestRate);

    const sum = committment > 0 ? cal.sum + committment : cal.sum;
    cal["committment"] = committment;
    cal.sum = sum;

    const newArrs = getSlicedMonths(cal.installments.length);

    const installments =
      cal.installments &&
      cal.installments.map((inst, i) => {
        inst["index"] = newArrs[i];
        return inst;
      });

    setPaymentPlan(cal);
    setInstallments(installments);
  };

  useEffect(() => {
    if (location.state && location.state.loan && location.state.budgetHead) {
      const loan = location.state.loan;
      const budgetHead = location.state.budgetHead;
      const minimumRepaymentTenor = budgetHead.frequency === "monthly" ? 3 : 1;
      setRequest(loan);
      setBudget(budgetHead);

      setState({
        ...state,
        restrictions: getRange(minimumRepaymentTenor, budgetHead.restriction),
        frequency: budgetHead && budgetHead.frequency,
        interest: budgetHead && budgetHead.interest,
        commitment: budgetHead && budgetHead.commitment,
      });
    }
  }, []);

  // console.log(installments);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="loan-card">
            <h5 className="card-title text-muted">{`${request.code} - ${request.reason}`}</h5>
            <h2 className="text-success">{money(request.amount)}</h2>
            <p className="text-muted mb-0">{budget && budget.description}</p>
            <ul className="list-group list-group-horizontal-sm mt-3">
              {request &&
                request.guarantors &&
                request.guarantors.length > 0 &&
                request.guarantors.map((staff, i) => (
                  <li key={i} className="list-group-item">
                    {staff.label.toUpperCase()}
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div className="col-md-12 mt-3">
          <CustomSelect
            label="RE-PAYMENT TENOR"
            size="lg"
            value={state.tenor}
            onChange={handleTenorChange}
          >
            <CustomSelectOptions
              label="SELECT RE-PAYMENT TENOR"
              value={0}
              disabled
            />
            {state?.restrictions?.length > 0 &&
              state?.restrictions?.map((res, i) => (
                <CustomSelectOptions
                  key={i}
                  value={res}
                  label={
                    res +
                    `${state.frequency === "monthly" ? " Months" : " Years"}`
                  }
                />
              ))}
          </CustomSelect>
        </div>

        <div className="col-md-12">
          <div className="row">
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">CAPITAL SUM</p>
                <h5 className="text-success">
                  {money(paymentPlan?.capitalSum ?? 0)}
                </h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">COMMITTMENT</p>
                <h5 className="text-success">
                  {money(paymentPlan?.committment ?? 0)}
                </h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">INTEREST SUM</p>
                <h5 className="text-success">
                  {money(paymentPlan?.interestSum ?? 0)}
                </h5>
              </div>
            </div>
            <div className="col-md-3">
              <div className="loan-card">
                <p className="text-muted mb-0">AMOUNT PAYABLE</p>
                <h5 className="text-success">{money(paymentPlan?.sum ?? 0)}</h5>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 mt-3">
          <TableCard columns={columns} rows={installments} />
        </div>

        <div className="col-md-12 mt-3">
          <div className="loan-card">
            <p className="text-muted">
              BY CLICKING ON SUBMIT, YOU HAVE AGREED TO THE TERMS AND CONDITIONS
              SURROUNDING THIS LOAN APPLICATION. IF YOU STILL WANT TO PROCEED
              CLICK SUBMIT, ELSE CANCEL.
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
              APPLY
            </button>
            <button
              type="button"
              className="btn btn-danger btn-rounded"
              onClick={closeRequest}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanRequest;
