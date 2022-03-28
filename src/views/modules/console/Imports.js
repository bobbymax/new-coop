/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import CustomSelect from "../../../theme/components/form/select/CustomSelect";
import CustomSelectOptions from "../../../theme/components/form/select/CustomSelectOptions";
import TextInputField from "../../../theme/components/form/TextInputField";
import slugify from "slugify";
import * as XLSX from "xlsx";
import TableCard from "../../../theme/components/tables/TableCard";
import { store } from "../../../services/requests/controllers";
import Alert from "../../../services/helpers/classes/Alert";
import CardLoader from "../../../theme/components/preloaders/CardLoader";

const Imports = () => {
  const initialState = {
    entity: "",
    data: [],
    uplaoded: "",
    file: null,
  };
  const EXTS = ["xlsx", "csv"];
  const enitities = [
    { value: "members", label: "Members" },
    { value: "loans", label: "Loans" },
    { value: "budget-heads", label: "Budget Heads" },
    { value: "sub-budget-heads", label: "Sub Budget Heads" },
    { value: "grade-levels", label: "Grade Levels" },
    { value: "roles", label: "Roles" },
  ];

  const [state, setState] = useState(initialState);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const convertToJson = (headers, data) => {
    const rows = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((el, index) => {
        rowData[headers[index].key] = el;
      });
      rows.push(rowData);
    });
    // console.log(headers)
    return rows;
  };

  const handleImports = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);

    const nameArr = file.name.split(".");
    const ext = nameArr[nameArr.length - 1];

    try {
      if (EXTS.includes(ext)) {
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers = jsonData[0];
        const columns = headers.map((head) => ({
          key: slugify(head, {
            lower: true,
            strict: true,
            remove: undefined,
          }),
          label: head,
        }));

        setColumns(columns);

        jsonData.splice(0, 1);
        setRows(convertToJson(columns, jsonData));
      } else {
        setError(`The ${ext} extension is not allowed for data uploads!!`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(rows);

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      data: rows,
      type: state.entity,
    };

    try {
      setLoading(true);
      store("extract/data", body)
        .then((res) => {
          const result = res.data;
          setLoading(false);
          Alert.success("Imported!!", result.message);
          console.log(result.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }

    setState(initialState);
    setRows([]);
    setColumns([]);
    setError("");
  };

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
      {loading ? <CardLoader /> : null}
      <div className="row">
        {error !== "" && (
          <div className="col-md-12 mb-3">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mt-3 mb-2">Import Dependencies</h5>
            </div>
            <div className="card-body">
              <div className="form-area">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-4">
                      <CustomSelect
                        label="Select Dependency"
                        value={state.entity}
                        onChange={(e) =>
                          setState({ ...state, entity: e.target.value })
                        }
                      >
                        <CustomSelectOptions
                          value=""
                          label="Select Entity"
                          disabled
                        />

                        {enitities.map((entity, i) => (
                          <CustomSelectOptions
                            key={i}
                            value={entity.value}
                            label={entity.label}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-8">
                      <TextInputField
                        type="file"
                        label="Upload Document"
                        value={state.uplaoded}
                        onChange={handleImports}
                      />
                    </div>

                    <div className="col-md-12 mt-3">
                      <div className="btn-group">
                        <button
                          type="submit"
                          className="btn btn-success"
                          disabled={state.entity === "" || rows.length == 0}
                        >
                          Import Dependency
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            setState(initialState);
                            setRows([]);
                            setColumns([]);
                            setError("");
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="table-area mt-5">
                <TableCard columns={columns} rows={rows} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Imports;
