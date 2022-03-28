/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { money } from "../../../services/helpers/functions";
import { collection, store } from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import * as Icon from "react-feather";
import "./batch.css";
// import { useNavigate } from "react-router-dom";
import Alert from "../../../services/helpers/classes/Alert";

const Batch = () => {
  const initialState = {
    paymentGroup: "",
    paymentName: "",
    paymentCode: "",
    batch_no: "",
    noOfClaim: 0,
    total: 0,
    budgetHeadCode: "",
    max: 0,
    chartOfAccountCode: 0,
  };

  const [state, setState] = useState(initialState);

  const [disbursements, setDisbursements] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [paymentType, setPaymentType] = useState("");
  const [board, setBoard] = useState([]);

  // const navigate = useNavigate();

  const paymentTypes = [
    { value: "member-payment", label: "Member Payment", code: "MMP", max: 6 },
    { value: "staff-payment", label: "Staff Payment", code: "STP", max: 200 },
    { value: "third-party", label: "Third Party", code: "TPP", max: 1 },
    // { value: "custom", label: "Custom", code: "CSP" },
  ];

  const boardLength = board.length;

  const handleAddToBatch = (data) => {
    if (boardLength == 0) {
      setBoard([data, ...board]);
      setExpenditures(expenditures.filter((exp) => exp.id != data.id));
    } else if (
      data.budgetHeadCode === state.budgetHeadCode &&
      boardLength <= state.max
    ) {
      setBoard([data, ...board]);
      setExpenditures(expenditures.filter((exp) => exp.id != data.id));
    }
  };

  const handleRemoveExp = (data) => {
    const exp = board.filter((expp) => expp.id == data.id);
    const expt = exp[0];

    const boardData = board.filter((exp) => exp.id != expt.id);
    setBoard(boardData);
    setExpenditures([...expenditures, expt]);

    if (boardData.length == 0) {
      setState({
        ...state,
        batch_no: "",
      });
    }
  };

  const handleSubmit = () => {
    const data = {
      batch_no: state.batch_no,
      expenditures: board,
      noOfClaim: board.length,
      amount: state.total,
    };

    try {
      store("bundles", data)
        .then((res) => {
          const result = res.data;
          Alert.success("Batched!!", result.message);

          setState(initialState);
          setPaymentType("");
          setBoard([]);
          setExpenditures([]);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (boardLength >= 1) {
      const budgetCode = board[0].budgetHeadCode;
      const budgetAccountCode = board[0].chartOfAccountCode;
      const boardTotal =
        board.length > 0 &&
        board
          .map((bd) => bd && parseFloat(bd.amount))
          .reduce((sum, curr) => sum + curr, 0);

      setState({
        ...state,
        budgetHeadCode: budgetCode,
        total: boardTotal,
        chartOfAccountCode: budgetAccountCode,
      });
    } else {
      setState({
        ...state,
        budgetHeadCode: "",
        total: 0,
        chartOfAccountCode: 0,
      });
    }
  }, [boardLength]);

  useEffect(() => {
    try {
      collection("disbursements")
        .then((res) => {
          const result = res.data.data;
          setDisbursements(
            result.filter((exp) => exp && exp.status === "pending")
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (paymentType !== "") {
      setExpenditures(
        disbursements.filter((exp) => exp.payment_type === paymentType)
      );

      const typer = paymentTypes.filter((typ) => typ.value === paymentType);

      setState({
        ...state,
        paymentGroup: paymentType,
        paymentName: typer[0].label,
        paymentCode: typer[0].code,
        max: parseInt(typer[0].max),
      });
    } else {
      setExpenditures(disbursements);
      setState({
        ...state,
        paymentGroup: "",
        paymentName: "",
        paymentCode: "",
        max: 0,
      });
    }
  }, [paymentType]);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-3">
          <CustomSelect
            label="Payment Type"
            size="lg"
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
            disabled={board.length > 0}
          >
            <CustomSelectOptions
              label="Select Payment Type"
              value=""
              disabled
            />

            {paymentTypes.map((typ, i) => (
              <CustomSelectOptions
                key={i}
                label={typ.label}
                value={typ.value}
              />
            ))}
          </CustomSelect>
        </div>

        {state.paymentGroup !== "" && (
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title mt-3 mb-2">
                      {state.paymentName !== ""
                        ? state.paymentName
                        : "Expenditures"}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      {expenditures.length > 0 ? (
                        expenditures.map((exp) => (
                          <div className="col-md-12 mb-2" key={exp.id}>
                            <div className="payment-card">
                              <div className="row">
                                <div className="col-md-9">
                                  <p className="mb-2 text-success">
                                    {exp.code}
                                  </p>
                                  <h5 className="payment-title mb-0">
                                    {exp.beneficiary}
                                  </h5>
                                  <p className="text-muted">
                                    {exp.description}
                                  </p>

                                  <h4 className="amount-text text-success mb-0">
                                    {money(parseFloat(exp.amount))}
                                  </h4>
                                </div>
                                <div className="col-md-3">
                                  <div
                                    className="d-grid gap-2"
                                    style={{ height: "100%" }}
                                  >
                                    <button
                                      type="button"
                                      className="align-middle btn btn-success btn-xs"
                                      onClick={() => handleAddToBatch(exp)}
                                    >
                                      <Icon.Plus size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-md-12">
                          <div className="payment-card">
                            <div className="alert alert-danger">
                              No expenditures at this point
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title mt-3 mb-2">
                      Batch -{" "}
                      {state.batch_no !== ""
                        ? state.batch_no
                        : "No code Generated"}
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-primary btn-xs btn-rounded"
                            disabled={boardLength == 0 || state.batch_no !== ""}
                            onClick={() => {
                              const digitCode =
                                Math.floor(Math.random() * 90000) + 10000;
                              setState({
                                ...state,
                                batch_no:
                                  state.paymentCode +
                                  state.chartOfAccountCode +
                                  digitCode,
                              });
                            }}
                          >
                            {state.batch_no !== ""
                              ? "BATCH CODE GENERATED"
                              : "GENERATE BATCH NO."}
                          </button>
                        </div>
                      </div>
                      {board.length > 0 ? (
                        board.map((bd) => (
                          <div className="col-md-12 mb-2" key={bd.id}>
                            <div className="payment-card">
                              <div className="row">
                                <div className="col-md-9">
                                  <p className="mb-2 text-success">{bd.code}</p>
                                  <h5 className="payment-title mb-0">
                                    {bd.beneficiary}
                                  </h5>
                                  <p className="text-muted">{bd.description}</p>

                                  <h4 className="amount-text text-success mb-0">
                                    {money(parseFloat(bd.amount))}
                                  </h4>
                                </div>
                                <div className="col-md-3">
                                  <div
                                    className="d-grid gap-2"
                                    style={{ height: "100%" }}
                                  >
                                    <button
                                      type="button"
                                      className="align-middle btn btn-danger btn-xs"
                                      onClick={() => handleRemoveExp(bd)}
                                    >
                                      <Icon.X size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-md-12">
                          <div className="payment-card">
                            <div className="alert alert-danger">
                              Nothing has been batched
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="col-md-12 mt-3">
                        <div className="payment-card">
                          <h4>TOTAL: {money(state.total)}</h4>
                        </div>
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-success btn-rounded"
                            disabled={boardLength == 0 || state.batch_no === ""}
                            onClick={() => handleSubmit()}
                          >
                            BATCH PAYMENTS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Batch;
