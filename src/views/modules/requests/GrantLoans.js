/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../../../services/helpers/classes/Alert";
import { alter, collection } from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";

const GrantLoans = () => {
  const initialState = {
    id: 0,
    loan_id: 0,
    reason: "",
    name: "",
    remark: "",
    status: "",
  };

  const auth = useSelector((state) => state.auth.value.user);
  const [state, setState] = useState(initialState);
  const [loans, setLoans] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const columns = [
    { key: "code", label: "Reference No." },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "reason", label: "Reason" },
    { key: "beneficiary", label: "Beneficiary" },
  ];

  const handleUpdate = (data) => {
    if (data.status === "pending") {
      setState({
        ...state,
        id: data?.id,
        loan_id: data?.loan_id,
        remark: data?.remark ?? "",
        status: data?.status,
      });
      setOpen(true);
    } else {
      setError("You cannot edit a payment to have acted on");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      remark: state.remark,
      status: state.status,
    };

    try {
      alter("guarantors", state.id, data)
        .then((res) => {
          const result = res.data;

          setLoans(
            loans.map((loan) => {
              if (loan.id == result.data.id) {
                return result.data;
              }

              return loan;
            })
          );

          Alert.success("Guaranteed!!", result.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }

    setOpen(false);
    setState(initialState);
  };

  useEffect(() => {
    try {
      collection("guarantors")
        .then((res) => {
          const result = res.data.data;

          setLoans(result.filter((data) => data && data.user_id == auth.id));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (error !== "") {
      const intervalI = setInterval(() => {
        setError("");
      }, 2000);

      return () => clearInterval(intervalI);
    }
  }, [error]);

  return (
    <>
      <div className="row">
        {error !== "" && (
          <div className="col-md-12 mb-3">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}
        {open && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3 mb-2">Update Loan Status</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12">
                      <TextInputField
                        label="Remark"
                        placeholder="Enter Remark Here"
                        multiline={4}
                        size="lg"
                        value={state.remark}
                        onChange={(e) =>
                          setState({ ...state, remark: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-12">
                      <CustomSelect
                        label="Status"
                        size="lg"
                        value={state.status}
                        onChange={(e) =>
                          setState({ ...state, status: e.target.value })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Status"
                          value=""
                          disabled
                        />

                        {["Approved", "Denied"].map((stat, i) => (
                          <CustomSelectOptions
                            key={i}
                            label={stat}
                            value={stat.toLowerCase()}
                          />
                        ))}
                      </CustomSelect>
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
          <TableCard columns={columns} rows={loans} handleEdit={handleUpdate} />
        </div>
      </div>
    </>
  );
};

export default GrantLoans;
