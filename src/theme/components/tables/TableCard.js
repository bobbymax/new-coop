/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";
import TableHeader from "./elements/TableHeader";
import TableBody from "./elements/TableBody";
import TableRow from "./elements/TableRow";
import CustomPagination from "./elements/CustomPagination";
import "./elements/table.css";
import { money, search } from "../../../services/helpers/functions";
import moment from "moment";

const TableCard = ({
  columns = [],
  rows = [],
  handleEdit = undefined,
  handleDelete = undefined,
  assignRole = undefined,
  manageMember = undefined,
  printFile = undefined,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [computed, setComputed] = useState([]);

  useEffect(() => {
    if (searchKey !== "") {
      setComputed(search(searchKey, rows));
    } else {
      setComputed(rows);
    }
  }, [rows, searchKey]);

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <div className="table-search mb-3">
            <div className="row">
              <div className="col-md-3">
                <select
                  className="form-control form-control-lg btn-square digits"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(e.target.value)}
                >
                  {[2, 10, 15, 25, 50, 100].map((dist, i) => (
                    <option key={i} value={dist}>
                      Show {dist} Entries
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-9">
                <div className="pull-right">
                  <input
                    className="form-control form-control-lg"
                    placeholder="Search Entries Here"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <TableHeader
                columns={columns}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                assignRole={assignRole}
                manageMember={manageMember}
                printFile={printFile}
              />
              <TableBody>
                {computed.length > 0 ? (
                  computed
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      (currentPage - 1) * itemsPerPage + itemsPerPage
                    )
                    .map((row, i) => (
                      <TableRow key={i}>
                        {columns.map((col, i) => {
                          if ("format" in col) {
                            if (col.format === "currency") {
                              return <td key={i}>{money(row[col.key])}</td>;
                            } else if (col.format === "date") {
                              return (
                                <td key={i}>
                                  {moment(row[col.key]).format("LL")}
                                </td>
                              );
                            } else {
                              return (
                                <td key={i}>
                                  {row[col.key] == 1 ? "Yes" : "No"}
                                </td>
                              );
                            }
                          } else {
                            return <td key={i}>{row[col.key]}</td>;
                          }
                        })}
                        {(handleEdit !== undefined ||
                          handleDelete !== undefined ||
                          assignRole !== undefined ||
                          manageMember !== undefined) && (
                          <td>
                            {handleEdit !== undefined && (
                              <Icon.Edit2
                                size={16}
                                onClick={() => handleEdit(row)}
                              />
                            )}{" "}
                            {handleDelete !== undefined && (
                              <Icon.Trash2
                                size={16}
                                onClick={() => handleDelete(row.id)}
                              />
                            )}
                            {assignRole !== undefined && (
                              <Icon.Bookmark
                                size={16}
                                onClick={() => assignRole(row)}
                              />
                            )}
                            {manageMember !== undefined && (
                              <Icon.Settings
                                size={16}
                                onClick={() => manageMember(row)}
                              />
                            )}
                          </td>
                        )}
                        {printFile !== undefined && (
                          <td>
                            <button className="btn btn-xs btn-success btn-rounded">
                              <Icon.Printer
                                size={14}
                                onClick={() => printFile(row)}
                              />
                            </button>
                          </td>
                        )}
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={
                        handleEdit !== undefined || manageMember !== undefined
                          ? columns.length + 1
                          : columns.length
                      }
                      className="text-danger"
                    >
                      No Data Found!!!
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </table>
          </div>
          <div className="pagination justify-content-center">
            <CustomPagination
              total={rows.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCard;
