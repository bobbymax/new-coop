/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { money } from "../../../services/helpers/functions";
import { collection, fetch } from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";

const ApplyLoans = () => {
  const navigate = useNavigate();
  const initialState = {
    code: "",
    amount: 0,
    budget_head_id: 0,
    reason: "",
    member: "",
    balance: 0,
    newBalance: 0,
    user_id: 0,
    error: "",
  };
  const [state, setState] = useState(initialState);
  const [budgetHeads, setBudgetHeads] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let d = new Date();

    const data = {
      code: "LN" + d.getTime(),
      user_id: state.user_id,
      amount: state.amount,
      budget_head_id: state.budget_head_id,
      reason: state.reason,
      serviceCode: state.code,
    };

    console.log(data);

    const budgetHead = budgetHeads.filter(
      (head) => head.id == state.budget_head_id
    )[0];

    navigate(`/admin/loans/${data.code}/calculate`, {
      state: {
        loan: data,
        budgetHead,
      },
    });
  };

  useEffect(() => {
    if (state.code !== "" && state.code?.length >= 10) {
      try {
        fetch("services/code", state.code)
          .then((res) => {
            const result = res.data.data;
            // console.log(result);
            const amount =
              result?.amount !== "0.00" ? parseFloat(result?.amount) : 0;
            setState({
              ...state,
              user_id: result?.controller?.id,
              member:
                result?.controller?.firstname?.toUpperCase() +
                " " +
                result?.controller?.surname?.toUpperCase(),
              amount,
            });
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [state.code]);

  useEffect(() => {
    if (state.budget_head_id > 0) {
      const budget = budgetHeads.filter(
        (bud) => bud.id == state.budget_head_id
      )[0];
      console.log(budget);

      setState({
        ...state,
        balance: parseFloat(budget?.fund?.booked_balance),
      });
    }
  }, [state.budget_head_id]);

  useEffect(() => {
    if (state.amount > 0 && state.balance > 0) {
      const fee = state.balance - state.amount;

      if (fee >= 0) {
        setState({
          ...state,
          newBalance: parseFloat(fee),
        });
      } else {
        setState({
          ...state,
          error: "You cannot exhaust this fund past its balance!!",
          newBalance: 0,
        });
      }
    } else {
      setState({
        ...state,
        newBalance: 0,
      });
    }
  }, [state.amount, state.balance]);

  useEffect(() => {
    try {
      collection("budgetHeads")
        .then((res) => {
          const result = res.data.data;
          setBudgetHeads(result.filter((head) => head?.category === "loan"));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-header mt-3">APPLY LOAN TO MEMBER</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-5">
              <TextInputField
                label="SERVICE CODE"
                value={state.code}
                onChange={(e) => setState({ ...state, code: e.target.value })}
                placeholder="ENTER SERVICE CODE"
                required
              />
            </div>
            <div className="col-md-7">
              <TextInputField
                label="MEMBER"
                value={state.member}
                onChange={(e) => setState({ ...state, member: e.target.value })}
                placeholder="ENTER MEMBER NAME"
                disabled
              />
            </div>
            <div className="col-md-7">
              <CustomSelect
                label="BUDGET HEAD"
                value={state.budget_head_id}
                onChange={(e) =>
                  setState({ ...state, budget_head_id: e.target.value })
                }
                required
              >
                <CustomSelectOptions
                  label={"SELECT BUDGET HEAD"}
                  value={0}
                  disabled
                />

                {budgetHeads?.length &&
                  budgetHeads?.map((budget) => (
                    <CustomSelectOptions
                      key={budget.id}
                      value={budget.id}
                      label={budget?.description?.toUpperCase()}
                    />
                  ))}
              </CustomSelect>
            </div>
            <div className="col-md-5">
              <TextInputField
                label="BALANCE"
                value={money(state.balance)}
                onChange={(e) =>
                  setState({ ...state, balance: e.target.value })
                }
                disabled
              />
            </div>
            <div className="col-md-5">
              <TextInputField
                label="LOAN AMOUNT"
                type="number"
                value={state.amount}
                onChange={(e) => setState({ ...state, amount: e.target.value })}
                required
              />
            </div>
            <div className="col-md-7">
              <TextInputField
                label="NEW BALANCE"
                value={money(state.newBalance)}
                onChange={(e) =>
                  setState({ ...state, newBalance: e.target.value })
                }
                disabled
              />
            </div>
            <div className="col-md-12">
              <TextInputField
                label="REASON"
                placeholder="ENTER REASON HERE"
                value={state.reason}
                onChange={(e) => setState({ ...state, reason: e.target.value })}
                multiline={4}
                required
              />
            </div>
            <div className="col-md-12">
              <div className="btn-group btn-rounded">
                <button type="submit" className="btn btn-success btn-sm">
                  SUBMIT
                </button>
                <button type="button" className="btn btn-danger btn-sm">
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoans;
