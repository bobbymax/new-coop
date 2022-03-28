/* eslint-disable eqeqeq */
import moment from "moment";
import React from "react";
import { money } from "../../../services/helpers/functions";

const BasicTable = ({
  columns = [],
  rows = [],
  message = "",
  showColumn = false,
}) => {
  return (
    <table className="table table-bordered table-striped table-hover">
      {showColumn && (
        <thead>
          <tr>
            {columns.length > 0 &&
              columns.map((col, i) => <th key={i}>{col.label}</th>)}
          </tr>
        </thead>
      )}

      <tbody>
        {rows.length > 0 ? (
          rows.map((row, i) => (
            <tr key={i}>
              {columns.length > 0 &&
                columns.map((col, i) => {
                  if ("format" in col) {
                    if (col.format === "currency") {
                      return <td key={i}>{money(row[col.key])}</td>;
                    } else if (col.format === "date") {
                      return (
                        <td key={i}>{moment(row[col.key]).format("LL")}</td>
                      );
                    } else {
                      return (
                        <td key={i}>{row[col.key] == 1 ? "Yes" : "No"}</td>
                      );
                    }
                  } else {
                    return <td key={i}>{row[col.key]}</td>;
                  }
                })}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-danger">
              {message}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default BasicTable;
