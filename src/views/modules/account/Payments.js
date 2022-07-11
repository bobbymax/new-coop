import React, { useEffect, useState } from "react";
import { collection } from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";
import Mandate from "../exports/Mandate";

const Payments = () => {
  const [batches, setBatches] = useState([]);
  const [showMandate, setShowMandate] = useState(false);
  const [data, setData] = useState({});

  const columns = [
    { key: "batch_no", label: "Code" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "status", label: "Status" },
  ];

  const printBatchPayment = (data) => {
    console.log(data);
    setShowMandate(true);
    setData(data);
  };

  useEffect(() => {
    try {
      collection("bundles")
        .then((res) => {
          setBatches(res.data.data);
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
          {!showMandate ? (
            <TableCard
              columns={columns}
              rows={batches}
              printFile={printBatchPayment}
            />
          ) : (
            <>
              <Mandate
                batch={data}
                onClose={() => {
                  setShowMandate(false);
                  setData({});
                }}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Payments;
