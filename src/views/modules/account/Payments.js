import React, { useEffect, useState } from "react";
import { collection } from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";
// import { PDFDownloadLink } from "@react-pdf/renderer";

const Payments = () => {
  const [batches, setBatches] = useState([]);

  const columns = [
    { key: "batch_no", label: "Code" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "status", label: "Status" },
  ];

  const printBatchPayment = (data) => {
    console.log(data);
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

  console.log(batches);

  return (
    <>
      <div className="row">
        {/* <PDFDownloadLink document={<Doc />} fileName="FORM">
                {({loading}) => (loading ? 'Loading document ...' : 'Download')}
            </PDFDownloadLink> */}

        <div className="col-md-12">
          <TableCard
            columns={columns}
            rows={batches}
            printFile={printBatchPayment}
          />
        </div>
      </div>
    </>
  );
};

export default Payments;
