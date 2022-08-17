import { useEffect, useState } from "react";
import { collection } from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";

const Ledgers = () => {
  const columns = [
    { key: "chartOfAccountCode", label: "Code" },
    { key: "purpose", label: "Purpose" },
    { key: "description", label: "Benefactor" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "payment_type", label: "Type" },
    { key: "paid", label: "Status" },
    { key: "created_at", label: "Entry Date" },
  ];

  const [entries, setEntries] = useState([]);

  const handleEntryManagement = (data) => {
    console.log(data);
  };

  useEffect(() => {
    try {
      collection("entries")
        .then((res) => {
          setEntries(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h3 className="mb-4">Commitments</h3>
        </div>
      </div>
      <TableCard
        columns={columns}
        rows={entries}
        manageMember={handleEntryManagement}
      />
    </>
  );
};

export default Ledgers;
