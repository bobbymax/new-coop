/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../../services/helpers/classes/Alert";
import {
  alter,
  collection,
  destroy,
  store,
} from "../../../services/requests/controllers";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";

const AccountCodes = () => {
  const initialState = {
    id: 0,
    range: "",
    name: "",
  };

  const [state, setState] = useState(initialState);
  const [accountCodes, setAccountCodes] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const columns = [
    { key: "range", label: "Range" },
    { key: "name", label: "Name" },
  ];

  const handleUpdate = (data) => {
    setState({
      ...state,
      id: data.id,
      range: data.range,
      name: data.name,
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
        destroy("accountCodes", data)
          .then((res) => {
            setAccountCodes([
              ...accountCodes.filter(
                (account) => account.id != res.data.data.id
              ),
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
      range: state.range,
      name: state.name,
    };

    if (update) {
      try {
        alter("accountCodes", state.id, data)
          .then((res) => {
            const result = res.data;

            setAccountCodes(
              accountCodes.map((account) => {
                if (account.id == result.data.id) {
                  return result.data;
                }

                return account;
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
        store("accountCodes", data)
          .then((res) => {
            const result = res.data;

            setAccountCodes([result.data, ...accountCodes]);
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
    setUpdate(false);
    setState(initialState);
  };

  useEffect(() => {
    try {
      collection("accountCodes")
        .then((res) => {
          const result = res.data.data;
          setAccountCodes(result);
        })
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
        <div className="col-md-12 mb-3">
          <button
            type="button"
            className="btn btn-success btn-rounded"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Add Account Code
          </button>
        </div>
        {open && (
          <>
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title mt-3 mb-2">Add Account Code</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-4">
                        <TextInputField
                          label="Range"
                          placeholder="Enter range value"
                          value={state.range}
                          onChange={(e) =>
                            setState({ ...state, range: e.target.value })
                          }
                          size="lg"
                        />
                      </div>
                      <div className="col-md-8">
                        <TextInputField
                          label="Name"
                          placeholder="Enter Account Code Name"
                          value={state.name}
                          onChange={(e) =>
                            setState({ ...state, name: e.target.value })
                          }
                          size="lg"
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
          </>
        )}
        <div className="col-md-12">
          <TableCard
            columns={columns}
            rows={accountCodes}
            handleEdit={handleUpdate}
            handleDelete={handleDestroy}
          />
        </div>
      </div>
    </>
  );
};

export default AccountCodes;
