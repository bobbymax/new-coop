/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
  alter,
  collection,
  destroy,
  store,
} from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";
import TextInputField from "../../../theme/components/form/TextInputField";
import Alert from "../../../services/helpers/classes/Alert";

const Budgets = () => {
  const initialState = {
    id: 0,
    description: "",
  };

  const [budgetHeads, setBudgetHeads] = useState([]);
  const [state, setState] = useState(initialState);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const columns = [
    { key: "code", label: "Code" },
    { key: "description", label: "Description" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      description: state.description,
    };

    if (update) {
      try {
        alter("budgets", state.id, data)
          .then((res) => {
            const result = res.data;

            setBudgetHeads(
              budgetHeads.map((budg) => {
                if (budg.id == result.data.id) {
                  return result.data;
                }

                return budg;
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
        store("budgets", data)
          .then((res) => {
            const result = res.data;

            setBudgetHeads([result.data, ...budgetHeads]);
            Alert.success("Created!!", result.message);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }

    setOpen(false);
    setUpdate(false);
    setState(initialState);
  };

  const handleUpdate = (data) => {
    setState({
      ...state,
      id: data.id,
      description: data.description,
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
        destroy("budgets", data)
          .then((res) => {
            setBudgetHeads([
              ...budgetHeads.filter((budgt) => budgt.id != res.data.data.id),
            ]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

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
        <div className="col-md-12 mb-4">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Add Budget Head
          </button>
        </div>
        {open && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3 mb-3">Add Budget Head</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="col-md-12">
                    <TextInputField
                      label="Description"
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                      placeholder="Enter Budget Description Here"
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
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="col-md-12">
          <TableCard
            columns={columns}
            rows={budgetHeads}
            handleEdit={handleUpdate}
            handleDelete={handleDestroy}
          />
        </div>
      </div>
    </>
  );
};

export default Budgets;
