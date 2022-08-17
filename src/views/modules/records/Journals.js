/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import axios from "axios";
import { useEffect, useState } from "react";
import {
  batchRequests,
  collection,
  fetch,
  store,
} from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import * as Icon from "react-feather";
import Alert from "../../../services/helpers/classes/Alert";

const styles = {
  headerWrapper: {
    backgroundColor: "#2c3e50",
    padding: 9,
  },
  secondHeader: {
    fontSize: 14,
    letterSpacing: 4,
    color: "#ecf0f1",
    marginBottom: 0,
    fontWeight: 600,
  },
};

const Journals = () => {
  const initialState = {
    paymentCode: "",
    disbursement_id: 0,
    account_code_id: 0,
    chart_of_account_id: 0,
    budget_head_id: 0,
    amount: 0,
    debitAmount: 0,
    receiverAmount: 0,
    description: "",
    payment_methods: "",
    receiverBeneficiary: "",
    receiverPaymentType: "",
    debitBeneficiary: "",
    debitPaymentType: "",
    entries: [],
  };
  const paymentMethods = [
    { key: "electronic", label: "Electronic" },
    { key: "check", label: "Check" },
    { key: "cash", label: "Cash" },
  ];

  const paymentTypes = [
    { key: "credit", label: "Credit" },
    { key: "debit", label: "Debit" },
  ];

  const [state, setState] = useState(initialState);
  // eslint-disable-next-line no-unused-vars
  const [accountCodes, setAccountCodes] = useState([]);
  const [chartOfAccounts, setChartOfAccounts] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSubmitting(true);
    const data = {
      disbursement_id: state.disbursement_id,
      account_code_id: state.account_code_id,
      chart_of_account_id: state.chart_of_account_id,
      budget_head_id: state.budget_head_id,
      amount: state.amount,
      description: state.description,
      payment_methods: state.payment_methods,
      entries: [
        {
          description: state.debitBeneficiary,
          amount: state.debitAmount,
          payment_type: state.debitPaymentType,
        },
        {
          description: state.receiverBeneficiary,
          amount: state.receiverAmount,
          payment_type: state.receiverPaymentType,
        },
      ],
    };

    // console.log(data);

    try {
      store("journals", data)
        .then((res) => {
          const result = res.data;
          console.log(result.data);
          Alert.success("Transaction Added!!", result.message);
          setSubmitting(false);
          setState(initialState);
        })
        .catch((err) => {
          console.log(err.message);
          setSubmitting(false);
        });
    } catch (error) {
      console.log(error);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (state.paymentCode !== "" && state.paymentCode?.length >= 10) {
      try {
        fetch("fetch/disbursements", state.paymentCode)
          .then((res) => {
            const result = res.data.data;

            const creditor =
              result?.flag === "inflow" ? "" : result?.budgetHeadName;

            if (!result?.journal_entered) {
              setState({
                ...state,
                disbursement_id: result?.id,
                account_code_id: result?.account_code_id,
                chart_of_account_id: result?.chart_of_account_id,
                budget_head_id: result?.budget_head_id,
                amount: parseFloat(result?.amount),
                description: result?.description,
                debitBeneficiary: creditor,
                debitAmount: parseFloat(result?.amount),
                debitPaymentType: "debit",
                receiverBeneficiary: result?.beneficiary,
                receiverAmount: parseFloat(result?.amount),
                receiverPaymentType: "credit",
              });
            } else {
              Alert.error(
                "Oops!!",
                "Seems like you have already entered this payment!!"
              );
            }

            // console.log(result);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [state.paymentCode]);

  useEffect(() => {
    try {
      const accountCodeData = collection("accountCodes");
      const accountChartData = collection("chartOfAccounts");
      const budgetHeads = collection("budgetHeads");

      batchRequests([accountCodeData, accountChartData, budgetHeads])
        .then(
          axios.spread((...res) => {
            const accountCode = res[0].data.data;
            const chartOfAccount = res[1].data.data;
            const budgetHead = res[2].data.data;

            setAccountCodes(accountCode);
            setChartOfAccounts(chartOfAccount);
            setBudgetHeads(budgetHead);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(accountCodes, chartOfAccounts, budgetHeads);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title mt-3">Add Journal Entry</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="first-section mb-3">
                  <div className="row">
                    <div className="col-md-7">
                      <CustomSelect
                        label="PAYMENT METHOD"
                        value={state.payment_methods}
                        onChange={(e) =>
                          setState({
                            ...state,
                            payment_methods: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Payment Method"
                          value=""
                          disabled
                        />

                        {paymentMethods?.length > 0 &&
                          paymentMethods?.map((mth, i) => (
                            <CustomSelectOptions
                              label={mth?.label}
                              value={mth?.key}
                              key={i}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-5">
                      <TextInputField
                        label="PAYMENT CODE"
                        placeholder="ENTER DISBURSEMENT CODE"
                        value={state.paymentCode}
                        onChange={(e) =>
                          setState({ ...state, paymentCode: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <CustomSelect
                        label="CHART OF ACCOUNT"
                        value={state.chart_of_account_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            chart_of_account_id: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Account Chart"
                          value={0}
                          disabled
                        />

                        {chartOfAccounts?.length > 0 &&
                          chartOfAccounts?.map((chart) => (
                            <CustomSelectOptions
                              label={chart?.name}
                              value={chart?.id}
                              key={chart?.id}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-8">
                      <CustomSelect
                        label="Account"
                        value={state.budget_head_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            budget_head_id: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Account"
                          value={0}
                          disabled
                        />

                        {budgetHeads?.length > 0 &&
                          budgetHeads?.map((budget) => (
                            <CustomSelectOptions
                              label={budget?.description}
                              value={budget?.id}
                              key={budget?.id}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-12">
                      <TextInputField
                        label="AMOUNT"
                        type="number"
                        value={state.amount}
                        onChange={(e) =>
                          setState({ ...state, amount: e.target.value })
                        }
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="second-section">
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <div
                        className="second-header"
                        style={styles.headerWrapper}
                      >
                        <h4 style={styles.secondHeader}>ENTRIES</h4>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <TextInputField
                        label="CREDITOR"
                        placeholder="ENTER BENEFICIARY"
                        value={state.debitBeneficiary}
                        onChange={(e) =>
                          setState({
                            ...state,
                            debitBeneficiary: e.target.value,
                          })
                        }
                        disabled={submitting}
                      />
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="AMOUNT"
                        type="number"
                        value={state.debitAmount}
                        onChange={(e) =>
                          setState({
                            ...state,
                            debitAmount: e.target.value,
                          })
                        }
                        disabled={submitting}
                      />
                    </div>
                    <div className="col-md-3">
                      <CustomSelect
                        label="TYPE"
                        value={state.debitPaymentType}
                        onChange={(e) =>
                          setState({
                            ...state,
                            debitPaymentType: e.target.value,
                          })
                        }
                        disabled={submitting}
                      >
                        <CustomSelectOptions
                          label="Select Payment Type"
                          value=""
                          disabled
                        />

                        {paymentTypes?.length > 0 &&
                          paymentTypes?.map((mth, i) => (
                            <CustomSelectOptions
                              label={mth?.label}
                              value={mth?.key}
                              key={i}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-5">
                      <TextInputField
                        label="RECEIVER"
                        placeholder="ENTER BENEFICIARY"
                        value={state.receiverBeneficiary}
                        onChange={(e) =>
                          setState({
                            ...state,
                            receiverBeneficiary: e.target.value,
                          })
                        }
                        disabled={submitting}
                      />
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="AMOUNT"
                        type="number"
                        value={state.receiverAmount}
                        onChange={(e) =>
                          setState({
                            ...state,
                            receiverAmount: e.target.value,
                          })
                        }
                        disabled={submitting}
                      />
                    </div>
                    <div className="col-md-3">
                      <CustomSelect
                        label="TYPE"
                        value={state.receiverPaymentType}
                        onChange={(e) =>
                          setState({
                            ...state,
                            receiverPaymentType: e.target.value,
                          })
                        }
                        disabled={submitting}
                      >
                        <CustomSelectOptions
                          label="Select Payment Type"
                          value=""
                          disabled
                        />

                        {paymentTypes?.length > 0 &&
                          paymentTypes?.map((mth, i) => (
                            <CustomSelectOptions
                              label={mth?.label}
                              value={mth?.key}
                              key={i}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                  </div>
                </div>
                <div className="form-footer mt-3">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="btn-group btn-rounded">
                        <button
                          type="submit"
                          className="btn btn-success btn-sm"
                          disabled={
                            state.debitBeneficiary === "" ||
                            state.debitAmount == 0 ||
                            state.debitPaymentType === "" ||
                            state.payment_methods === "" ||
                            state.receiverBeneficiary === "" ||
                            state.receiverAmount == 0 ||
                            state.receiverPaymentType === "" ||
                            submitting
                          }
                        >
                          <Icon.Send size={12} style={{ marginRight: 6 }} />
                          SUBMIT
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setState(initialState)}
                        >
                          <Icon.XSquare size={12} style={{ marginRight: 6 }} />
                          CLEAR
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Journals;
