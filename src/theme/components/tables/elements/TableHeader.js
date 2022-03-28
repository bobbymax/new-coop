import React from "react";

const TableHeader = ({
  columns,
  handleEdit,
  handleDelete,
  assignRole,
  manageMember,
  printFile,
}) => {
  return (
    <thead>
      <tr>
        {columns.length > 0 &&
          columns.map((col, i) => <th key={i}>{col.label}</th>)}
        {(handleEdit !== undefined ||
          handleDelete !== undefined ||
          assignRole !== undefined ||
          manageMember !== undefined) && (
          <th>{manageMember !== undefined ? "Manage" : "Action"}</th>
        )}
        {printFile !== undefined && <th>Print</th>}
      </tr>
    </thead>
  );
};

export default TableHeader;
