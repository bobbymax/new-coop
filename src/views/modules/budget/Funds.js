/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Alert from "../../../services/helpers/classes/Alert";
import {
  alter,
  batchRequests,
  collection,
  destroy,
  store,
} from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";

const Funds = () => {
  const initialState = {
    id: 0,
    budget_head_id: 0,
    approved_amount: 0,
    description: "",
    actual_balance: 0,
    booked_balance: 0,
    booked_expenditure: 0,
    actual_expenditure: 0,
    budgetHead: null,
  };

  const [state, setState] = useState(initialState);
  const [funds, setFunds] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const columns = [
    { key: "budget_head_code", label: "Budget Code" },
    { key: "budget_head_name", label: "Description" },
    { key: "approved_amount", label: "Approved Amount", format: "currency" },
    { key: "actual_balance", label: "Balance", format: "currency" },
  ];

  const handleUpdate = (data) => {
    setState({
      ...state,
      id: data.id,
      budget_head_id: data.budget_head_id,
      approved_amount: data.approved_amount,
      description: data.description,
      actual_balance: data.actual_balance,
      booked_balance: data.booked_balance,
      booked_expenditure: data.booked_expenditure,
      actual_expenditure: data.actual_expenditure,
      budgetHead: data.budget_head,
    });
    setUpdate(true);
    setOpen(true);
  };

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("funds", data)
          .then((res) => {
            setFunds([...funds.filter((fund) => fund.id != res.data.data.id)]);
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
      approved_amount: state.approved_amount,
      description: state.description,
    };

    if (update) {
      try {
        alter("funds", state.id, data)
          .then((res) => {
            const result = res.data;

            setFunds(
              funds.map((fund) => {
                if (fund.id == result.data.id) {
                  return result.data;
                }

                return fund;
              })
            );

            Alert.success("Updated!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        store("funds", data)
          .then((res) => {
            const result = res.data;

            setFunds([result.data, ...funds]);
            Alert.success("Created!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    }

    setState(initialState);
    setUpdate(false);
    setOpen(false);
  };

  useEffect(() => {
    try {
      const budgetHeads = collection("budgetHeads");
      const budgetFunds = collection("funds");
      batchRequests([budgetHeads, budgetFunds])
        .then(
          axios.spread((...res) => {
            const budgetHeadsData = res[0].data.data;
            const fundsData = res[1].data.data;

            setFunds(fundsData);
            setSubBudgetHeads(
              budgetHeadsData.filter((budgt) => budgt && budgt.fund === null)
            );
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
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
            className="btn btn-success mb-4"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Credit Sub Budget Head
          </button>
        </div>
        {open && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3 mb-2">Add Fund</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-7">
                      <CustomSelect
                        label="Sub Budget Head"
                        value={state.budget_head_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            budget_head_id: parseInt(e.target.value),
                          })
                        }
                        size="lg"
                      >
                        <CustomSelectOptions
                          label="Select Sub Budget Head"
                          value={0}
                          disabled
                        />

                        {subBudgetHeads.map((budget) => (
                          <CustomSelectOptions
                            key={budget.id}
                            label={budget.description}
                            value={budget.id}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-5">
                      <TextInputField
                        label="Approved Amount"
                        type="number"
                        value={state.approved_amount}
                        onChange={(e) =>
                          setState({
                            ...state,
                            approved_amount: parseFloat(e.target.value),
                          })
                        }
                        size="lg"
                      />
                    </div>
                    <div className="col-md-12">
                      <TextInputField
                        label="Description"
                        value={state.description}
                        onChange={(e) =>
                          setState({
                            ...state,
                            description: e.target.value,
                          })
                        }
                        placeholder="Enter description here"
                        multiline={4}
                        size="lg"
                      />
                    </div>
                    <div className="col-md-12 mt-3">
                      <div className="btn-group">
                        <button type="submit" className="btn btn-success">
                          Submit
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger"
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
            rows={funds}
            handleEdit={handleUpdate}
            handleDelete={handleDestroy}
          />
        </div>
      </div>
    </>
  );
};

export default Funds;
