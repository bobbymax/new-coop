/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import axios from "axios";
import React, { useEffect, useState } from "react";
import Alert from "../../../services/helpers/classes/Alert";
import { getRange } from "../../../services/helpers/functions";
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

const ChartOfAccount = () => {
  const initialState = {
    id: 0,
    account_code_id: 0,
    code: 0,
    name: "",
    range: [],
    error: "",
    accountCodeRange: "",
  };

  const [state, setState] = useState(initialState);
  const [accountCodes, setAccountCodes] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const columns = [
    { key: "account_code_name", label: "Account Code" },
    { key: "range", label: "Range" },
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
  ];

  const splitRangeValue = (val) => {
    const rangeArr = val.split("-");
    const min = parseInt(rangeArr[0].trim());
    const max = parseInt(rangeArr[1].trim());

    return getRange(min, max);
  };

  const handleUpdate = (data) => {
    setState({
      ...state,
      id: data.id,
      account_code_id: data.account_code_id,
      code: data.code,
      name: data.name,
      range: splitRangeValue(data.range),
      accountCodeRange: data.range,
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
        destroy("chartOfAccounts", data)
          .then((res) => {
            setChartOfAccounts([
              ...chartOfAccounts.filter(
                (chart) => chart.id != res.data.data.id
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
      account_code_id: state.account_code_id,
      code: state.code,
      name: state.name,
    };

    if (update) {
      alter("chartOfAccounts", state.id, data)
        .then((res) => {
          const result = res.data;

          setChartOfAccounts(
            chartOfAccounts.map((account) => {
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
    } else {
      store("chartOfAccounts", data)
        .then((res) => {
          const result = res.data;

          setChartOfAccounts([result.data, ...chartOfAccounts]);

          Alert.success("Created!!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    setOpen(false);
    setUpdate(false);
    setState(initialState);
  };

  useEffect(() => {
    if (state.account_code_id > 0) {
      const codeVal = accountCodes.filter(
        (code) => code.id == state.account_code_id
      );
      const accountCode = codeVal[0];

      setState({
        ...state,
        accountCodeRange: accountCode && accountCode.range,
        range: splitRangeValue(accountCode && accountCode.range),
      });
    }
  }, [state.account_code_id]);

  useEffect(() => {
    if (
      typeof state.code === "number" &&
      state.code > 0 &&
      state.range.length > 0
    ) {
      !state.range.includes(state.code)
        ? setState({
            ...state,
            error:
              "The Code does not fall within the given range of the selected Account Code",
          })
        : setState({ ...state, error: "" });
    }
  }, [state.code, state.range]);

  useEffect(() => {
    try {
      const requestOne = collection("accountCodes");
      const requestTwo = collection("chartOfAccounts");

      batchRequests([requestOne, requestTwo])
        .then(
          axios.spread((...res) => {
            const accountCodesData = res[0].data.data;
            const chartOfAccountsData = res[1].data.data;

            setAccountCodes(accountCodesData);
            setChartOfAccounts(chartOfAccountsData);
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
            className="btn btn-success btn-rounded mb-4"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Add Account Chart
          </button>
        </div>
        {open && (
          <>
            <div className="col-md-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title mt-3 mb-2">Add Account Chart</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      {state.error !== "" && (
                        <div className="col-md-12 mb-2">
                          <div className="alert alert-danger">
                            {state.error}
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 mb-2">
                        <TextInputField
                          label="Account Code Range"
                          size="lg"
                          value={state.accountCodeRange}
                          onChange={(e) =>
                            setState({
                              ...state,
                              accountCodeRange: e.target.value,
                            })
                          }
                          disabled
                        />
                      </div>
                      <div className="col-md-4">
                        <CustomSelect
                          label="Account Code"
                          size="lg"
                          value={state.account_code_id}
                          onChange={(e) =>
                            setState({
                              ...state,
                              account_code_id: parseInt(e.target.value),
                            })
                          }
                        >
                          <CustomSelectOptions
                            label="Select Account Code"
                            value={0}
                            disabled
                          />

                          {accountCodes.length > 0 &&
                            accountCodes.map((acCode) => (
                              <CustomSelectOptions
                                key={acCode.id}
                                label={acCode.name}
                                value={acCode.id}
                              />
                            ))}
                        </CustomSelect>
                      </div>
                      <div className="col-md-4">
                        <TextInputField
                          label="Code"
                          type="number"
                          size="lg"
                          value={state.code}
                          onChange={(e) =>
                            setState({
                              ...state,
                              code: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-md-4">
                        <TextInputField
                          label="Name"
                          size="lg"
                          value={state.name}
                          onChange={(e) =>
                            setState({
                              ...state,
                              name: e.target.value,
                            })
                          }
                          placeholder="Enter Name"
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
            rows={chartOfAccounts}
            handleEdit={handleUpdate}
            handleDelete={handleDestroy}
          />
        </div>
      </div>
    </>
  );
};

export default ChartOfAccount;
