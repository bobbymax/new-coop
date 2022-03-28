/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import Alert from "../../../services/helpers/classes/Alert";
import {
  store,
  alter,
  destroy,
  collection,
  batchRequests,
} from "../../../services/requests/controllers";
import TextInputField from "../../../theme/components/form/TextInputField";
import CardLoader from "../../../theme/components/preloaders/CardLoader";
import TableCard from "../../../theme/components/tables/TableCard";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import axios from "axios";
import CustomCheckBox from "../../../theme/components/form/CustomCheckBox";

const Settings = () => {
  const initialState = {
    key: "",
    display_name: "",
    input_type: "",
    details: "",
    roles: [],
  };

  const [state, setState] = useState(initialState);
  const [settings, setSettings] = useState([]);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "key", label: "Key" },
    { key: "display_name", label: "Display Name" },
    { key: "input_type", label: "Input Type" },
  ];

  const options = [
    { key: "text", label: "Text" },
    { key: "textarea", label: "Textarea" },
    { key: "file", label: "File" },
    { key: "number", label: "Number" },
    { key: "password", label: "Password" },
    { key: "email", label: "Email" },
    { key: "checkbox", label: "Checkbox" },
    { key: "radio", label: "Radio" },
    { key: "select", label: "Select" },
  ];

  const updateRow = (data) => {
    setUpdate(true);
    setState(data);
    setOpen(true);
  };

  const deleteRow = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("settings", data.id)
          .then((res) => {
            setSettings([
              ...settings.filter((stg) => stg.id !== res.data.data.id),
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
      key: state.key,
      display_name: state.display_name,
      input_type: state.input_type,
      details: state.details,
      roles: state.roles,
    };

    if (update) {
      try {
        alter("settings", state.issd, data)
          .then((res) => {
            const result = res.data.data;

            setSettings(
              settings.map((stg) => {
                if (result.id === stg.id) {
                  return result;
                }

                return stg;
              })
            );
            setUpdate(false);
            setState(initialState);
            setOpen(false);

            Alert.success("Updated!!", res.data.message);
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        store("settings", data)
          .then((res) => {
            setSettings([res.data.data, ...settings]);
            setState(initialState);
            setOpen(false);
            Alert.success("Created!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    try {
      const settingsData = collection("settings");
      const rolesData = collection("roles");

      setLoading(true);
      batchRequests([settingsData, rolesData])
        .then(
          axios.spread((...res) => {
            const dataSettings = res[0].data.data;
            const dataRoles = res[1].data.data;

            setSettings(dataSettings);
            setRoles(dataRoles);
            setLoading(false);
          })
        )
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <CardLoader /> : null}

      <div className="row">
        <div className="col-md-12">
          <div className="page-titles">
            <button
              className="btn btn-success mb-4"
              onClick={() => setOpen(!open)}
              disabled={open}
            >
              <i className="fa fa-plus-square"></i> Add Setting
            </button>
          </div>
        </div>

        {open && (
          <div className="col-md-12 mb-3">
            <div className="card">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="container">
                    <div className="row">
                      <div className="col-md-4">
                        <TextInputField
                          label="Key"
                          placeholder="Enter Setting Key"
                          value={state.key}
                          onChange={(e) =>
                            setState({ ...state, key: e.target.value })
                          }
                          size="lg"
                        />
                      </div>
                      <div className="col-md-4">
                        <TextInputField
                          label="Display Name"
                          placeholder="Enter Display Name"
                          value={state.display_name}
                          onChange={(e) =>
                            setState({
                              ...state,
                              display_name: e.target.value,
                            })
                          }
                          required
                          size="lg"
                        />
                      </div>

                      <div className="col-md-4">
                        <CustomSelect
                          label="Input Type"
                          value={state.input_type}
                          onChange={(e) =>
                            setState({
                              ...state,
                              input_type: e.target.value,
                            })
                          }
                          size="lg"
                        >
                          <CustomSelectOptions
                            value=""
                            label="Select Input Type"
                            disabled
                          />
                          {options.map((opt, i) => (
                            <CustomSelectOptions
                              key={i}
                              value={opt.key}
                              label={opt.label}
                            />
                          ))}
                        </CustomSelect>
                      </div>
                      <div className="col-md-12">
                        <TextInputField
                          label="Details"
                          placeholder="Enter Details"
                          value={state.details}
                          onChange={(e) =>
                            setState({ ...state, details: e.target.value })
                          }
                          multiline={4}
                          size="lg"
                        />
                      </div>
                      <div className="col-md-12">
                        <div className="form-group">
                          <div className="row">
                            {roles.length > 0 &&
                              roles.map((role) => (
                                <div key={role.id} className="col-md-3">
                                  <CustomCheckBox
                                    id={`roles-${role.id}`}
                                    label={role.name}
                                    value={role.id}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        !state.roles.includes(e.target.value) &&
                                          setState({
                                            ...state,
                                            roles: [
                                              e.target.value,
                                              ...state.roles,
                                            ],
                                          });
                                      } else {
                                        state.roles.includes(e.target.value) &&
                                          setState({
                                            ...state,
                                            roles: state.roles.filter(
                                              (role) => role != e.target.value
                                            ),
                                          });
                                      }
                                    }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 mt-3">
                        <div className="btn-group">
                          <button type="submit" className="btn btn-primary">
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
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-12">
          <TableCard
            columns={columns}
            rows={settings}
            handleEdit={updateRow}
            handleDelete={deleteRow}
          />
        </div>
      </div>
    </>
  );
};

export default Settings;
