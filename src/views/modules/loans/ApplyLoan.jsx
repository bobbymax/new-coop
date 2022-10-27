/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import LoanJS from "loanjs";
import {
  getMonthsArr,
  getRange,
  money,
} from "../../../services/helpers/functions";
import {
  batchRequests,
  collection,
  store,
} from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";

const ApplyLoan = () => {
  const initialState = {
    member: null,
    category: null,
    amount: 0,
    reason: "",
    restrictions: [],
    frequency: "",
    interest: 0,
    committment: 0,
    tenor: 0,
    issued_date: "",
    split_months: [],
  };

  const [state, setState] = useState(initialState);
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [paymentPlan, setPaymentPlan] = useState({});
  const [installments, setInstallments] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let d = new Date();

    const data = {
      user_id: state.member?.value,
      amount: parseFloat(state.amount),
      code: "LN" + d.getTime(),
      budget_head_id: state.category?.value,
      reason: state.reason,
      // guarantors: state.guarantors,
      instructions: installments,
      capitalSum: paymentPlan.capitalSum,
      committment: paymentPlan.committment,
      interestSum: paymentPlan.interestSum,
      totalPayable: paymentPlan.sum,
    };

    try {
      store("admin/loans", data)
        .then((res) => {
          const result = res.data;
          //   const data = result.data;
          const message = result.message;

          setState(initialState);
          setInstallments([]);
          setTimeout(() => {
            setStatus(message);
            setError(false);
          }, 2000);
        })
        .catch((err) => {
          console.log(err.message);
          setTimeout(() => {
            setError(true);
            setStatus(err.reponse.data.message);
          }, 2000);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { key: "index", label: "Due Date" },
    { key: "capital", label: "Capital", format: "currency" },
    { key: "installment", label: "Installment", format: "currency" },
    { key: "interest", label: "Interest", format: "currency" },
    { key: "interestSum", label: "Interest Sum", format: "currency" },
    { key: "remain", label: "Balance", format: "currency" },
  ];

  const handleChange = (e) => {
    setState({
      ...state,
      member: e,
    });
  };

  const filteredMembers = () => {
    let newData = [];
    if (members?.length < 1) {
      return newData;
    }

    members.map((user) =>
      newData.push({
        value: user?.id,
        label: user?.firstname + " " + user?.surname,
      })
    );

    return newData;
  };

  const filteredCategories = () => {
    let newDat = [];
    if (categories?.length < 1) {
      return newDat;
    }

    categories.map((cat) =>
      newDat.push({
        value: cat?.id,
        label: cat?.description,
      })
    );

    return newDat;
  };

  const getSlicedMonths = (issued_date, count) => {
    const d = new Date(issued_date);
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
    if (state.category !== null) {
      const loanCategory = categories.filter(
        (cat) => cat.id == state.category?.value
      )[0];
      //   console.log(loanCategory);
      const minRepaymentTenor = loanCategory?.frequency === "monthly" ? 3 : 1;
      setState({
        ...state,
        restrictions: getRange(minRepaymentTenor, loanCategory?.restriction),
        frequency: loanCategory?.frequency,
        interest: loanCategory?.interest,
        committment: loanCategory?.commitment,
      });
    }
  }, [state.category]);

  useEffect(() => {
    if (
      state.amount > 10000 &&
      state.category !== null &&
      state.tenor > 0 &&
      state.issued_date !== ""
    ) {
      const loanCategory = categories.filter(
        (cat) => cat.id == state.category?.value
      )[0];

      const committment =
        loanCategory?.commitment > 0
          ? state.amount * (loanCategory?.commitment / 100)
          : 0;

      const loanAmount =
        loanCategory?.commitment > 0 && committment > 0
          ? state.amount - committment
          : state.amount;

      const interestRate =
        state.frequency !== "monthly"
          ? loanCategory?.interest * 12
          : loanCategory?.interest;

      const cal = LoanJS.Loan(loanAmount, state.tenor, interestRate);
      const sum = committment > 0 ? cal?.sum + committment : cal?.sum;
      cal["committment"] = committment;
      cal.sum = sum;

      const newArrs = getSlicedMonths(
        state.issued_date,
        cal.installments.length
      );

      const installs = cal?.installments.map((inst, i) => {
        inst["index"] = newArrs[i];
        inst["status"] = "pending";
        return inst;
      });

      setPaymentPlan(cal);
      setInstallments(installs);
    }
  }, [state.amount, state.category, state.tenor, state.issued_date]);

  useEffect(() => {
    try {
      const memberData = collection("members");
      const categoriesData = collection("budgetHeads");
      batchRequests([memberData, categoriesData])
        .then(
          axios.spread((...res) => {
            const memRes = res[0].data.data;
            const catsRes = res[1].data.data;

            const filtered = memRes.filter((user) => !user?.isAdministrator);
            setMembers(filtered);

            setCategories(
              catsRes.filter((budget) => budget && budget.category === "loan")
            );
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
        {status !== "" && (
          <div className="col-md-12">
            <div className={`alert alert-${error ? "danger" : "success"}`}>
              {status}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-8">
              <p>Member Name</p>
              <Select
                closeMenuOnSelect={true}
                options={filteredMembers()}
                value={state.member}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <p>Loan Category</p>
              <Select
                closeMenuOnSelect={true}
                options={filteredCategories()}
                value={state.category}
                onChange={(e) => setState({ ...state, category: e })}
              />
            </div>
            <div className="col-md-4 mt-3">
              <TextInputField
                label="Amount"
                value={state.amount}
                onChange={(e) =>
                  setState({ ...state, amount: parseFloat(e.target.value) })
                }
              />
            </div>
            <div className="col-md-4 mt-3">
              <TextInputField
                label="Issued Date"
                type="date"
                value={state.issued_date}
                onChange={(e) =>
                  setState({
                    ...state,
                    issued_date: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-md-4 mt-3">
              <CustomSelect
                label="Tenor"
                value={state.tenor}
                onChange={(e) => setState({ ...state, tenor: e.target.value })}
              >
                <CustomSelectOptions label="Select Tenor" value={0} disabled />
                {state.restrictions?.map((res, i) => (
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
              <TextInputField
                label="Reason"
                value={state.reason}
                onChange={(e) => setState({ ...state, reason: e.target.value })}
                multiline={4}
                size="lg"
              />
            </div>
            <div className="col-md-12 mb-4">
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
                    <h5 className="text-success">
                      {money(paymentPlan?.sum ?? 0)}
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mb-3">
              <TableCard columns={columns} rows={installments} />
            </div>
            <div className="col-md-12">
              <button
                type="submit"
                className="btn btn-success"
                disabled={
                  state.tenor < 1 ||
                  state.reason === "" ||
                  state.member === null ||
                  state.category === null ||
                  state.issued_date === "" ||
                  state.amount < 10000
                }
              >
                Apply Loan
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ApplyLoan;
