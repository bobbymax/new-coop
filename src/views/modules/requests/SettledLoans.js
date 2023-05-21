import React, { useEffect, useState } from "react";
import { collection } from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";

const SettledLoans = () => {
  const [loans, setLoans] = useState([]);

  const columns = [
    { key: "code", label: "Reference" },
    { key: "budget_head_name", label: "Category" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status" },
  ];

  useEffect(() => {
    collection("loans")
      .then((res) => {
        const response = res.data.data;

        setLoans(response?.filter((loan) => loan.status === "approved"));
      })
      .catch((err) => console.log(err.message));
  }, []);

  //   console.log(loans);

  return (
    <>
      <div className="row">
        <div className="col-md-12 mb-4">
          <h4>Approved Loans</h4>
        </div>
        <div className="col-md-12">
          <TableCard columns={columns} rows={loans} />
        </div>
      </div>
    </>
  );
};

export default SettledLoans;
