/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateLoggedInAuth } from "../../../features/auth/userSlice";
import Alert from "../../../services/helpers/classes/Alert";
import { money } from "../../../services/helpers/functions";
import { alter, store } from "../../../services/requests/controllers";
import TextInputField from "../../../theme/components/form/TextInputField";
import "./member-style.css";

const Profile = () => {
  const initialState = {
    firstname: "",
    middlename: "",
    surname: "",
    staff_no: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    mobile: "",
    bank_name: "",
    account_name: "",
    account_number: "",
    contribution_fee: 0,
    name: "",
    relationship: "",
    tabIndex: "",
  };
  const links = [
    { key: "profile", label: "Profile", active: true },
    { key: "account", label: "Account", active: false },
    { key: "contribution", label: "Contribution", active: false },
    { key: "security", label: "Security", active: false },
  ];

  const auth = useSelector((state) => state.auth.value.user);
  const dispatch = useDispatch();
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    const body = {
      firstname: state.firstname,
      surname: state.surname,
      middlename: state.middlename,
      staff_no: state.staff_no,
      email: state.email,
      designation: state.designation,
      mobile: state.mobile,
    };

    setLoading(true);

    try {
      alter("members", auth?.id, body)
        .then((res) => {
          const result = res.data;
          dispatch(updateLoggedInAuth(result));
          setLoading(false);
          Alert.success("Profile Updated!!", result.message);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

    // console.log(body);
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();

    const body = {
      bank: state.bank_name,
      account_number: state.account_number,
      account_name: state.account_name,
      entity: "staff",
      holder: "staff",
      holder_id: auth?.id,
      url: "profile-update",
    };

    setLoading(true);

    try {
      store("accounts", body)
        .then((res) => {
          const result = res.data;
          // setAccounts([result.data, ...accounts]);
          dispatch(updateLoggedInAuth(result));
          setLoading(false);
          Alert.success("Account Added!!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setState({
      ...state,
      bank_name: "",
      account_name: "",
      account_number: "",
    });
    // console.log(body);
  };

  const makeAccountPrimary = (account) => {
    const body = {
      user_id: auth?.id,
      primary: true,
    };

    setLoading(true);
    try {
      alter("primary/accounts", account?.id, body)
        .then((res) => {
          const result = res.data;
          dispatch(updateLoggedInAuth(result));
          //   setAccounts(
          //     accounts.map((act) => {
          //       if (act.id == result.data.id) {
          //         return result.data;
          //       }

          //       return act;
          //     })
          //   );
          setLoading(false);
          Alert.success("Primary Account!!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
          Alert.error("Oops!!", "Something went wrong!!");
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleContributionUpdate = (e) => {
    e.preventDefault();

    const body = {
      user_id: auth?.id,
      fee: state.contribution_fee,
      month: moment().format("MMMM"),
    };

    setLoading(true);

    try {
      store("contributions", body)
        .then((res) => {
          const result = res.data;
          dispatch(updateLoggedInAuth(result));
          setLoading(false);
          Alert.success("Contribution Updated!!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
          Alert.error("Oops!!", "Something went wrong!!");
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    setState({
      ...state,
      contribution_fee: 0,
    });

    // console.log(body);
  };

  const passwordReset = (e) => {
    e.preventDefault();

    const body = {
      user_id: auth?.id,
      password: state.password,
      confirmPassword: state.confirmPassword,
    };

    console.log(body);
  };

  useEffect(() => {
    if (auth !== null) {
      setState({
        ...state,
        firstname: auth?.firstname,
        middlename: auth?.middlename ?? "",
        surname: auth?.surname ?? "",
        staff_no: auth?.staff_no,
        email: auth?.email,
        designation: auth?.designation ?? "",
        mobile: auth?.mobile ?? "",
        tabIndex: "profile",
      });

      setAccounts(auth?.accounts);
    }
  }, [auth]);

  return (
    <>
      {loading ? "Loading..." : null}
      <div className="row">
        {/* Tab Navigation */}
        <div className="col-md-12 mb-3">
          <ul className="nav nav-tabs">
            {links.map((anchor, i) => (
              <li key={i} className="nav-item">
                <Link
                  to="#"
                  className={`nav-link ${
                    state.tabIndex === anchor.key && "active"
                  }`}
                  title={anchor.key}
                  onClick={() => setState({ ...state, tabIndex: anchor.key })}
                >
                  {anchor.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Tab Content Area */}
        {state.tabIndex === "profile" && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleProfileUpdate}>
                  <div className="row">
                    <div className="col-md-4">
                      <TextInputField
                        label="Firstname"
                        value={state.firstname}
                        onChange={(e) =>
                          setState({ ...state, firstname: e.target.value })
                        }
                        size="lg"
                        disabled
                      />
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="Middlename"
                        value={state.middlename}
                        onChange={(e) =>
                          setState({ ...state, middlename: e.target.value })
                        }
                        size="lg"
                        disabled
                      />
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="Surname"
                        value={state.surname}
                        onChange={(e) =>
                          setState({ ...state, surname: e.target.value })
                        }
                        size="lg"
                        disabled
                      />
                    </div>
                    <div className="col-md-5">
                      <TextInputField
                        label="Membership No."
                        value={state.staff_no}
                        onChange={(e) =>
                          setState({ ...state, staff_no: e.target.value })
                        }
                        size="lg"
                        disabled
                      />
                    </div>
                    <div className="col-md-7">
                      <TextInputField
                        label="Email"
                        value={state.email}
                        onChange={(e) =>
                          setState({ ...state, email: e.target.value })
                        }
                        size="lg"
                      />
                    </div>
                    <div className="col-md-8">
                      <TextInputField
                        label="Designation"
                        placeholder="ENTER DESIGNATION HERE"
                        value={state.designation}
                        onChange={(e) =>
                          setState({ ...state, designation: e.target.value })
                        }
                        size="lg"
                      />
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="Mobile"
                        placeholder="ENTER MOBILE NUMBER"
                        value={state.mobile}
                        onChange={(e) =>
                          setState({ ...state, mobile: e.target.value })
                        }
                        size="lg"
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="btn-group btn-rounded">
                        <button type="submit" className="btn btn-success">
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Account Tab Content Area */}
        {state.tabIndex === "account" && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-5">
                    <form onSubmit={handleAccountUpdate}>
                      <div className="row">
                        <div className="col-md-12">
                          <TextInputField
                            label="Bank Name"
                            placeholder="ENTER BANK NAME"
                            size="lg"
                            value={state.bank_name}
                            onChange={(e) =>
                              setState({ ...state, bank_name: e.target.value })
                            }
                            disabled={accounts?.length == 3}
                            required
                          />
                        </div>
                        <div className="col-md-12">
                          <TextInputField
                            label="Account Number"
                            placeholder="ENTER ACCOUNT NUMBER"
                            size="lg"
                            value={state.account_number}
                            onChange={(e) =>
                              setState({
                                ...state,
                                account_number: e.target.value,
                              })
                            }
                            disabled={accounts?.length == 3}
                            required
                          />
                        </div>
                        <div className="col-md-12">
                          <TextInputField
                            label="Account Name"
                            placeholder="ENTER ACCOUNT NAME"
                            size="lg"
                            value={state.account_name}
                            onChange={(e) =>
                              setState({
                                ...state,
                                account_name: e.target.value,
                              })
                            }
                            disabled={accounts?.length == 3}
                            required
                          />
                        </div>
                        <div className="col-md-12">
                          <div className="btn-group btn-rounded">
                            <button
                              type="submit"
                              className="btn btn-success"
                              disabled={accounts?.length == 3}
                            >
                              Add Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-7">
                    {accounts?.length > 0 &&
                      accounts.map((account) => (
                        <div key={account.id} className="account-card mb-2">
                          <small className="bank__text">
                            {account?.bank?.toUpperCase()}
                          </small>
                          <h4 className="bank__username">
                            {account?.account_name?.toUpperCase()}
                          </h4>
                          <small>{account?.account_number}</small>{" "}
                          {account.primary ? (
                            <small style={{ fontSize: 9 }}>
                              DEFAULT ACCOUNT
                            </small>
                          ) : (
                            <Link
                              to="#"
                              className="bank__link"
                              onClick={() => makeAccountPrimary(account)}
                            >
                              MAKE PRIMARY
                            </Link>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contribution Tab Content Area */}
        {state.tabIndex === "contribution" && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <form onSubmit={handleContributionUpdate}>
                      <div className="row">
                        <div className="col-md-8">
                          <TextInputField
                            size="lg"
                            placeholder="ENTER CONTRIBUTION FEE"
                            value={state.contribution_fee}
                            onChange={(e) =>
                              setState({
                                ...state,
                                contribution_fee: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <button
                            type="submit"
                            className="btn btn-success btn-block"
                          >
                            UPDATE CONTRIBUTION
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-12">
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Month</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auth?.contributions?.length > 0 ? (
                          auth?.contributions?.map((cont, i) => (
                            <tr key={i}>
                              <td>{money(cont?.fee)}</td>
                              <td>{cont?.month}</td>
                              <td>
                                {cont?.current == 1 ? "Current" : "Previous"}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="text-danger">
                              NO CONTRIBUTION COMMITMENT!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secutiry Tab Content Area */}
        {state.tabIndex === "security" && (
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <form onSubmit={passwordReset}>
                  <div className="row">
                    <div className="col-md-6">
                      <TextInputField
                        label="Password"
                        type="password"
                        size="lg"
                        value={state.password}
                        onChange={(e) =>
                          setState({ ...state, password: e.target.value })
                        }
                        id="change-password"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <TextInputField
                        label="Confirm Password"
                        type="password"
                        size="lg"
                        value={state.confirmPassword}
                        onChange={(e) =>
                          setState({
                            ...state,
                            confirmPassword: e.target.value,
                          })
                        }
                        id="confirm-password"
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <button
                        type="submit"
                        className="btn btn-success btn-rounded"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
