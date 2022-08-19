/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import * as Icon from "react-feather";
import { useSelector } from "react-redux";
import Alert from "../../../services/helpers/classes/Alert";
import { getMonthsArr, money } from "../../../services/helpers/functions";
import authHeader from "../../../services/requests/auth.header";
import {
  alter,
  batchRequests,
  collection,
  fetch,
  store,
} from "../../../services/requests/controllers";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import TableCard from "../../../theme/components/tables/TableCard";

const ServiceRequest = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const initialState = {
    id: 0,
    loan_id: 0,
    loanRef: "",
    service_category_id: 0,
    takeOff: "",
    destination: "",
    from: "",
    to: "",
    airline: "",
    type: "",
    trip: "",
    liquidate: "",
    timeOfDay: "",
    amount: 0,
    month: "",
    open: false,
    isRequesting: false,
    isUpdating: false,
    category: "",
    next_payment: 0,
    payable: 0,
    passengers: "",
  };
  const [state, setState] = useState(initialState);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [services, setServices] = useState([]);

  const columns = [
    { key: "code", label: "Code" },
    { key: "category", label: "Category" },
    { key: "created_at", label: "Requested Date" },
    { key: "status", label: "Status" },
  ];

  const handleEdit = (data) => {
    setState({
      ...state,
      isUpdating: true,
      open: true,
      id: data.id,
      service_category_id: data.service_category_id,
      code: data.code,
      description: data.description,
      method_of_payment: data.method_of_payment,
      other: data.other,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const category = serviceCategories.filter(
      (cat) => cat.id == state.service_category_id
    )[0];

    const generatedCode =
      category?.code + Math.floor(Math.random() * 9000) + 1000;

    setState({
      ...state,
      isRequesting: true,
    });

    const data = {
      service_category_id: state.service_category_id,
      code: category?.code + Math.floor(Math.random() * 9000) + 1000,
      loan_id: state.loan_id,
      takeOff: state.takeOff,
      destination: state.destination,
      from: state.from,
      to: state.from,
      airline: state.airline,
      type: state.type,
      trip: state.trip,
      liquidate: state.liquidate,
      timeOfDay: state.timeOfDay,
      amount: state.amount,
      month: state.month,
      passengers: state.passengers,
    };

    // console.log(data);

    if (state.isUpdating) {
      try {
        alter("services", state.id, data)
          .then((res) => {
            const result = res.data;
            setServices(
              services.map((service) => {
                if (service.id == result.data.id) {
                  return result.data;
                }

                return service;
              })
            );
            setState(initialState);
            Alert.success("Success!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
            Alert.error("Oops!!", "Something went wrong!!");
          });
      } catch (error) {
        console.log(error);
        setState({
          ...state,
          isUpdating: false,
          isRequesting: false,
        });
      }
    } else {
      try {
        store("services", data)
          .then((res) => {
            const result = res.data;

            setServices([result.data, ...services]);
            setState(initialState);
            Alert.success("Success!!", result.message);
          })
          .catch((err) => {
            setState({
              ...state,
              isRequesting: false,
            });
            console.log(err.messages);
            Alert.error("Oops!!", "Something went wrong!!");
          });
      } catch (error) {
        console.log(error);
        setState({
          ...state,
          isRequesting: false,
          isUpdating: false,
        });
      }
    }
  };

  useEffect(() => {
    if (state.loanRef !== "" && state.loanRef?.length >= 10) {
      try {
        fetch("fetch/loans", state.loanRef)
          .then((res) => {
            const result = res.data.data;
            const installments = result?.instructions;
            const remains = installments?.filter(
              (installment) => installment?.paid == 0
            );
            const nextPayment = remains?.length > 0 ? remains[0] : undefined;

            setState({
              ...state,
              loan_id: result?.id,
              next_payment: parseFloat(nextPayment?.installment),
              payable:
                remains !== undefined
                  ? remains
                      ?.map((fee) => parseFloat(fee?.installment))
                      .reduce((sum, prev) => sum + prev, 0)
                  : 0,
            });
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [state.loanRef]);

  useEffect(() => {
    if (state.payable > 0 && state.liquidate === "full") {
      setState({
        ...state,
        amount: state.payable,
      });
    } else {
      setState({
        ...state,
        amount: 0,
      });
    }
  }, [state.payable, state.liquidate]);

  useEffect(() => {
    if (state.service_category_id > 0) {
      const cat = serviceCategories.filter(
        (cate) => cate.id == state.service_category_id
      )[0];

      // console.log(cat);
      setState({
        ...state,
        category: cat.label,
      });
    }
  }, [state.service_category_id]);

  useEffect(() => {
    try {
      const categoriesData = collection("serviceCategories");
      const servicesData = collection("services");

      batchRequests([categoriesData, servicesData])
        .then(
          axios.spread((...res) => {
            const categories = res[0].data.data;
            const services = res[1].data.data;

            setServiceCategories(categories);
            setServices(services.filter((serv) => serv.user_id == auth.id));
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
        <div className="col-md-12 mb-4">
          <button
            type="button"
            className="btn btn-success btn-rounded btn-sm"
            onClick={() => setState({ ...state, isRequesting: true })}
            disabled={state.isRequesting}
          >
            <Icon.PlusSquare size={14} style={{ marginRight: 8 }} />
            {`Make Request`?.toUpperCase()}
          </button>
        </div>

        {state.isRequesting && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3">Make Service Request</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <CustomSelect
                        label="SERVICE CATEGORY"
                        value={state.service_category_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            service_category_id: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="SELECT CATEGORY"
                          value={0}
                          disabled
                        />

                        {serviceCategories?.length > 0 &&
                          serviceCategories?.map((cat) => (
                            <CustomSelectOptions
                              key={cat.id}
                              value={cat.id}
                              label={cat.name?.toUpperCase()}
                            />
                          ))}
                      </CustomSelect>
                    </div>

                    {state.category === "air-ticket-purchase" && (
                      <>
                        <div className="col-md-4">
                          <CustomSelect
                            label="TRIP TYPE"
                            value={state.type}
                            onChange={(e) =>
                              setState({
                                ...state,
                                type: e.target.value,
                              })
                            }
                          >
                            <CustomSelectOptions
                              label="SELECT TYPE"
                              value=""
                              disabled
                            />

                            {["international", "local"]?.map((typ, i) => (
                              <CustomSelectOptions
                                key={i}
                                value={typ}
                                label={typ?.toUpperCase()}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                        <div className="col-md-4">
                          <CustomSelect
                            label="ROUTE"
                            value={state.trip}
                            onChange={(e) =>
                              setState({
                                ...state,
                                trip: e.target.value,
                              })
                            }
                          >
                            <CustomSelectOptions
                              label="SELECT ROUTE"
                              value=""
                              disabled
                            />

                            {[
                              { key: "one-way", label: "One Way" },
                              { key: "return", label: "Return" },
                            ]?.map((typ, i) => (
                              <CustomSelectOptions
                                key={i}
                                value={typ.key}
                                label={typ.label?.toUpperCase()}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                        <div className="col-md-4">
                          <TextInputField
                            label="FROM"
                            placeholder="ENTER TAKE OFF STATE"
                            value={state.takeOff}
                            onChange={(e) =>
                              setState({ ...state, takeOff: e.target.value })
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <TextInputField
                            label="TO"
                            placeholder="ENTER DESTINATION"
                            value={state.destination}
                            onChange={(e) =>
                              setState({
                                ...state,
                                destination: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <CustomSelect
                            label="PREFERRED FLIGHT PERIOD"
                            value={state.timeOfDay}
                            onChange={(e) =>
                              setState({
                                ...state,
                                timeOfDay: e.target.value,
                              })
                            }
                          >
                            <CustomSelectOptions
                              label="SELECT PERIOD"
                              value=""
                              disabled
                            />

                            {["morning", "afternoon", "evening"]?.map(
                              (typ, i) => (
                                <CustomSelectOptions
                                  key={i}
                                  value={typ}
                                  label={typ?.toUpperCase()}
                                />
                              )
                            )}
                          </CustomSelect>
                        </div>

                        <div className="col-md-4">
                          <TextInputField
                            label="DEPARTURE"
                            type="date"
                            value={state.from}
                            onChange={(e) =>
                              setState({ ...state, from: e.target.value })
                            }
                          />
                        </div>

                        <div className="col-md-4">
                          <TextInputField
                            label="ARRIVAL"
                            type="date"
                            value={state.to}
                            onChange={(e) =>
                              setState({ ...state, to: e.target.value })
                            }
                            disabled={state.trip === "one-way"}
                          />
                        </div>

                        <div className="col-md-4">
                          <TextInputField
                            label="PREFERRED AIRLINE"
                            placeholder="ENTER AIRLINE NAME"
                            value={state.airline}
                            onChange={(e) =>
                              setState({ ...state, airline: e.target.value })
                            }
                          />
                        </div>

                        <div className="col-md-12">
                          <TextInputField
                            label="PASSENGERS"
                            placeholder="SEPERATE NAMES WITH A COMMA EG: AMAKA, YINKA"
                            value={state.passengers}
                            onChange={(e) =>
                              setState({ ...state, passengers: e.target.value })
                            }
                          />
                        </div>
                      </>
                    )}

                    {state.category === "liquidation" && (
                      <>
                        <div className="col-md-4">
                          <TextInputField
                            label="LOAN REFERENCE CODE"
                            placeholder="ENTER CODE HERE"
                            value={state.loanRef}
                            onChange={(e) =>
                              setState({ ...state, loanRef: e.target.value })
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <TextInputField
                            label="NEXT PAYMENT"
                            placeholder="NEXT PAYMENT"
                            value={money(state.next_payment)}
                            onChange={(e) =>
                              setState({
                                ...state,
                                next_payment: e.target.value,
                              })
                            }
                            disabled
                          />
                        </div>
                        <div className="col-md-4">
                          <TextInputField
                            label="TOTAL PAYABLE"
                            placeholder="TOTAL PAYABLE"
                            value={money(state.payable)}
                            onChange={(e) =>
                              setState({
                                ...state,
                                payable: e.target.value,
                              })
                            }
                            disabled
                          />
                        </div>
                        <div className="col-md-4">
                          <CustomSelect
                            label="LIQUIDATE"
                            value={state.liquidate}
                            onChange={(e) =>
                              setState({
                                ...state,
                                liquidate: e.target.value,
                              })
                            }
                          >
                            <CustomSelectOptions
                              label="SELECT FORM"
                              value=""
                              disabled
                            />

                            {["partially", "full"]?.map((monh, i) => (
                              <CustomSelectOptions
                                key={i}
                                value={monh}
                                label={monh?.toUpperCase()}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                      </>
                    )}

                    {(state.category === "update-contribution-fee" ||
                      state.category === "liquidation") && (
                      <div className="col-md-4">
                        <TextInputField
                          label={
                            state.category === "update-contribution-fee"
                              ? "NEW FEE"
                              : "AMOUNT"
                          }
                          value={state.amount}
                          onChange={(e) =>
                            setState({ ...state, amount: e.target.value })
                          }
                          disabled={
                            state.category === "liquidation" &&
                            state.liquidate === "full"
                          }
                        />
                      </div>
                    )}

                    {state.category === "update-contribution-fee" && (
                      <div className="col-md-4">
                        <CustomSelect
                          label="COMMENCE MONTH"
                          value={state.month}
                          onChange={(e) =>
                            setState({
                              ...state,
                              month: e.target.value,
                            })
                          }
                        >
                          <CustomSelectOptions
                            label="SELECT MONTH"
                            value=""
                            disabled
                          />

                          {getMonthsArr()?.length > 0 &&
                            getMonthsArr()?.map((monh, i) => (
                              <CustomSelectOptions
                                key={i}
                                value={monh?.toLowerCase()}
                                label={monh?.toUpperCase()}
                              />
                            ))}
                        </CustomSelect>
                      </div>
                    )}

                    <div className="col-md-12">
                      <div className="btn-group btn-rounded">
                        <button
                          type="submit"
                          className="btn btn-success btn-sm"
                        >
                          <Icon.Send size={14} style={{ marginRight: 8 }} />
                          Submit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setState(initialState);
                          }}
                        >
                          <Icon.X size={14} style={{ marginRight: 8 }} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <TableCard columns={columns} rows={services} handleEdit={handleEdit} />
      </div>
    </>
  );
};

export default ServiceRequest;
