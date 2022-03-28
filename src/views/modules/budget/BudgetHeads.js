/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
  alter,
  collection,
  destroy,
  store,
} from "../../../services/requests/controllers";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import Alert from "../../../services/helpers/classes/Alert";

const BudgetHeads = () => {
  const initialState = {
    id: 0,
    code: "",
    budget_id: 0,
    category: "",
    type: "",
    commitment: 0,
    interest: 0,
    frequency: "",
    limit: 0,
    restriction: 0,
    payable: "",
    description: "",
  };

  const [state, setState] = useState(initialState);

  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const columns = [
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "type", label: "Type" },
  ];

  const handleUpdate = (data) => {
    setState({
      ...state,
      id: data.id,
      code: data.code,
      budget_id: data.budget_id,
      category: data.category,
      type: data.type,
      commitment: data.commitment,
      interest: data.interest,
      frequency: data.frequency,
      limit: data.limit,
      restriction: data.restriction,
      payable: data.payable,
      description: data.description,
    });
    setUpdate(true);
    setOpen(true);
  };

  const handleDelete = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("budgetHeads", data)
          .then((res) => {
            setSubBudgetHeads([
              ...subBudgetHeads.filter((budgt) => budgt.id != res.data.data.id),
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
      code: state.code,
      budget_id: state.budget_id,
      category: state.category,
      type: state.type,
      commitment: state.commitment,
      interest: state.interest,
      frequency: state.frequency,
      limit: state.limit,
      restriction: state.restriction,
      payable: state.payable,
      description: state.description,
    };

    if (update) {
      try {
        alter("budgetHeads", state.id, data)
          .then((res) => {
            const result = res.data;

            setSubBudgetHeads(
              subBudgetHeads.map((sub) => {
                if (sub.id == result.data.id) {
                  return result.data;
                }

                return sub;
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
        store("budgetHeads", data)
          .then((res) => {
            const result = res.data;

            setSubBudgetHeads([result.data, ...subBudgetHeads]);
            Alert.success("Created!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    }

    setOpen(false);
    setState(initialState);
    setUpdate(false);
  };

  useEffect(() => {
    try {
      collection("budgetHeads")
        .then((res) => {
          setSubBudgetHeads(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    try {
      collection("budgets")
        .then((res) => {
          setBudgetHeads(res.data.data);
        })
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
            className="btn btn-success mb-3"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Add Sub Budget Head
          </button>
        </div>
        {open && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3 mb-2">Add Sub Budget Head</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <TextInputField
                        label="Code"
                        placeholder="Enter Budget Code"
                        value={state.code}
                        onChange={(e) =>
                          setState({ ...state, code: e.target.value })
                        }
                        size="lg"
                      />
                    </div>
                    <div className="col-md-8">
                      <CustomSelect
                        label="Budget Head"
                        value={state.budget_id}
                        onChange={(e) =>
                          setState({ ...state, budget_id: e.target.value })
                        }
                        size="lg"
                      >
                        <CustomSelectOptions
                          label="Select Budget Head"
                          value={0}
                          disabled
                        />

                        {budgetHeads.length > 0 &&
                          budgetHeads.map((budgt) => (
                            <CustomSelectOptions
                              key={budgt.id}
                              label={budgt.description}
                              value={budgt.id}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-6">
                      <CustomSelect
                        label="Sub Budget Type"
                        value={state.type}
                        onChange={(e) =>
                          setState({ ...state, type: e.target.value })
                        }
                        size="lg"
                      >
                        <CustomSelectOptions
                          label="Select Sub Budget Type"
                          value=""
                          disabled
                        />

                        {["Capital", "Recursive", "Personnel"].map((typ, i) => (
                          <CustomSelectOptions
                            key={i}
                            label={typ}
                            value={typ.toLowerCase()}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-6">
                      <CustomSelect
                        label="Sub Budget Category"
                        value={state.category}
                        onChange={(e) =>
                          setState({ ...state, category: e.target.value })
                        }
                        size="lg"
                      >
                        <CustomSelectOptions
                          label="Select Sub Budget Category"
                          value=""
                          disabled
                        />

                        {["Loan", "Asset", "Shares"].map((typ, i) => (
                          <CustomSelectOptions
                            key={i}
                            label={typ}
                            value={typ.toLowerCase()}
                          />
                        ))}
                      </CustomSelect>
                    </div>

                    {state.category === "loan" && (
                      <>
                        <div className="col-md-3">
                          <TextInputField
                            label="Commitment"
                            type="number"
                            value={state.commitment}
                            onChange={(e) =>
                              setState({
                                ...state,
                                commitment: e.target.value,
                              })
                            }
                            size="lg"
                          />
                        </div>
                        <div className="col-md-3">
                          <TextInputField
                            label="Loan Interest %"
                            type="number"
                            value={state.interest}
                            onChange={(e) =>
                              setState({
                                ...state,
                                interest: e.target.value,
                              })
                            }
                            size="lg"
                          />
                        </div>
                        <div className="col-md-6">
                          <TextInputField
                            label="Loan Limit (NGN)"
                            type="number"
                            value={state.limit}
                            onChange={(e) =>
                              setState({
                                ...state,
                                limit: e.target.value,
                              })
                            }
                            size="lg"
                          />
                        </div>
                        <div className="col-md-4">
                          <TextInputField
                            label="Payment restriction"
                            type="number"
                            value={state.restriction}
                            onChange={(e) =>
                              setState({
                                ...state,
                                restriction: e.target.value,
                              })
                            }
                            size="lg"
                          />
                        </div>
                        <div className="col-md-4">
                          <CustomSelect
                            label="Payment Frequency"
                            value={state.frequency}
                            onChange={(e) =>
                              setState({ ...state, frequency: e.target.value })
                            }
                            size="lg"
                          >
                            <CustomSelectOptions
                              label="Select Payment Frequency"
                              value=""
                              disabled
                            />

                            {["Annually", "Monthly", "Special"].map(
                              (freq, i) => (
                                <CustomSelectOptions
                                  key={i}
                                  label={freq}
                                  value={freq.toLowerCase()}
                                />
                              )
                            )}
                          </CustomSelect>
                        </div>
                        <div className="col-md-4">
                          <CustomSelect
                            label="Payment Plan"
                            value={state.payable}
                            onChange={(e) =>
                              setState({ ...state, payable: e.target.value })
                            }
                            size="lg"
                          >
                            <CustomSelectOptions
                              label="Select Payment Plan"
                              value=""
                              disabled
                            />

                            {[
                              "Undefined",
                              "Contribution",
                              "Salary",
                              "Upfront",
                            ].map((pay, i) => (
                              <CustomSelectOptions
                                key={i}
                                label={pay}
                                value={pay.toLowerCase()}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                      </>
                    )}

                    <div className="col-md-12">
                      <TextInputField
                        label="Description"
                        placeholder="Enter Sub Budget Name"
                        value={state.description}
                        onChange={(e) =>
                          setState({ ...state, description: e.target.value })
                        }
                        size="lg"
                        multiline={4}
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
            rows={subBudgetHeads}
            handleEdit={handleUpdate}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};

export default BudgetHeads;
