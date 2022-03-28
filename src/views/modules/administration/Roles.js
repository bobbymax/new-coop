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
import CardLoader from "../../../theme/components/preloaders/CardLoader";
import TableCard from "../../../theme/components/tables/TableCard";

const Roles = () => {
  const initialState = {
    id: 0,
    name: "",
    slots: 0,
  };

  const [state, setState] = useState(initialState);
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "name", label: "Name" },
    { key: "slots", label: "Slots" },
  ];

  const handleUpdate = (data) => {
    setLoading(true);
    setState({
      ...state,
      id: data.id,
      name: data.name,
      slots: data.slots,
    });
    setUpdate(true);
    setOpen(true);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: state.name,
      slots: parseInt(state.slots),
    };

    if (update) {
      try {
        alter("roles", state.id, data)
          .then((res) => {
            const data = res.data;

            setRoles(
              roles.map((el) => {
                if (data.data.id == el.id) {
                  return data.data;
                }

                return el;
              })
            );
            setLoading(false);

            Alert.success("Updated!", data.message);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      try {
        store("roles", data)
          .then((res) => {
            const result = res.data;
            setRoles([result.data, ...roles]);
            setLoading(false);
            Alert.success("Created!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    setUpdate(false);
    setState(initialState);
    setOpen(false);
  };

  const handleDestroy = (data) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        destroy("roles", data.label)
          .then((res) => {
            setRoles([...roles.filter((role) => role.id !== res.data.data.id)]);
            Alert.success("Deleted!!", res.data.message);
          })
          .catch((err) => console.log(err.message));
      }
    });
  };

  useEffect(() => {
    try {
      setLoading(true);
      collection("roles")
        .then((res) => {
          const data = res.data.data;
          setRoles(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {loading ? <CardLoader /> : null}

      <div className="row">
        <div className="col-md-12 mb-3">
          <button
            type="button"
            className="btn btn-success"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Add Role
          </button>
        </div>

        {open && (
          <div className="col-md-12 mb-3">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3">Add Role</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-7">
                      <TextInputField
                        label="Name"
                        value={state.name}
                        onChange={(e) =>
                          setState({ ...state, name: e.target.value })
                        }
                        placeholder="Enter Role Name"
                        size="lg"
                      />
                    </div>
                    <div className="col-md-5">
                      <TextInputField
                        label="Slots"
                        type="number"
                        value={state.slots}
                        onChange={(e) =>
                          setState({ ...state, slots: e.target.value })
                        }
                        placeholder="Enter Role Slot"
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
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="col-md-12">
          <TableCard
            columns={columns}
            rows={roles}
            handleEdit={handleUpdate}
            handleDelete={handleDestroy}
          />
        </div>
      </div>
    </>
  );
};

export default Roles;
