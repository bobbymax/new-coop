/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Alert from "../../../services/helpers/classes/Alert";
import {
  alter,
  collection,
  store,
} from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";
import * as Icon from "react-feather";
import TextInputField from "../../../theme/components/form/TextInputField";

const ServiceCategories = () => {
  const initialState = {
    id: 0,
    name: "",
    type: "",
    code: "",
    description: "",
    open: false,
    isUpdating: false,
    isSubmitting: false,
  };
  const [state, setState] = useState(initialState);
  const [categories, setCategories] = useState([]);

  const columns = [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "type", label: "Type" },
  ];

  const handleEdit = (data) => {
    setState({
      ...state,
      id: data.id,
      name: data.name,
      type: data.type,
      code: data.code,
      description: data.description,
      open: true,
      isUpdating: true,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: state.name,
      type: state.type,
      code: state.code,
      description: state.description,
    };

    setState({
      ...state,
      isSubmitting: true,
    });

    if (state.isUpdating) {
      try {
        alter("serviceCategories", state.id, data)
          .then((res) => {
            const result = res.data;
            setCategories(
              categories.map((category) => {
                if (category.id == result.data.id) {
                  return result.data;
                }

                return category;
              })
            );
            setState(initialState);
            Alert.success("Success!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
            setState({
              ...state,
              isSubmitting: false,
            });
            Alert.error("Oops!!", "Something went wrong..");
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        store("serviceCategories", data)
          .then((res) => {
            const result = res.data;
            setCategories([result.data, ...categories]);
            setState(initialState);
            Alert.success("Success!!", result.message);
          })
          .catch((err) => {
            console.log(err.message);
            setState({
              ...state,
              isSubmitting: false,
            });
            Alert.error("Oops!!", "Something went wrong..");
          });
      } catch (error) {
        setState({
          ...state,
          isSubmitting: false,
          isUpdating: false,
        });
        console.log(error);
      }
    }
  };

  useEffect(() => {
    try {
      collection("serviceCategories")
        .then((res) => {
          const result = res.data.data;
          setCategories(result);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(categories);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-4">
          <button
            type="button"
            className="btn btn-success btn-rounded btn-sm"
            onClick={() => setState({ ...state, open: true })}
            disabled={state.open}
          >
            <Icon.PlusSquare size={14} style={{ marginRight: 7 }} />
            Add Service Category
          </button>
        </div>

        {state.open && (
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mt-3">Add Service Category</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <TextInputField
                        label="Name"
                        placeholder="Enter Category Name Here"
                        value={state.name}
                        onChange={(e) =>
                          setState({ ...state, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="Code"
                        placeholder="Enter Category Code Here"
                        value={state.code}
                        onChange={(e) =>
                          setState({ ...state, code: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <TextInputField
                        label="Type"
                        placeholder="Enter Category Type Here"
                        value={state.type}
                        onChange={(e) =>
                          setState({ ...state, type: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <TextInputField
                        label="Description"
                        placeholder="Enter Category Description Here"
                        value={state.description}
                        onChange={(e) =>
                          setState({ ...state, description: e.target.value })
                        }
                        multiline={4}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="btn-group btn-rounded">
                        <button
                          type="submit"
                          className="btn btn-success btn-sm"
                          disabled={
                            state.name === "" || state.description === ""
                          }
                        >
                          <Icon.Send size={14} style={{ marginRight: 7 }} />
                          Submit
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setState(initialState)}
                        >
                          <Icon.XCircle size={14} style={{ marginRight: 7 }} />
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

        <TableCard
          columns={columns}
          rows={categories}
          handleEdit={handleEdit}
        />
      </div>
    </>
  );
};

export default ServiceCategories;
