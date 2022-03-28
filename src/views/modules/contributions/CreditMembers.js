import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSiteConfig } from "../../../features/config/configSlice";
import { collection, store } from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";
import Alert from "../../../services/helpers/classes/Alert";

const CreditMembers = () => {
  const dispatch = useDispatch();
  const [contributions, setContributions] = useState([]);
  const paymentStatus = useSelector(
    (state) => state.config.value.credit_member_accounts
  );

  const columns = [
    { key: "membership_no", label: "Membership Number" },
    { key: "name", label: "Name" },
    { key: "fee", label: "Contribution", format: "currency" },
  ];

  const handlePost = () => {
    const data = {
      payments: formatData(contributions),
      total: getTotalContributions(contributions),
    };
    try {
      store("credit/members/account", data)
        .then((res) => {
          const result = res.data;
          console.log(result);
          dispatch(updateSiteConfig(result));
          Alert.success("Payment Posted!", result.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const formatData = (dataArr) => {
    const newFormat = [];

    dataArr.length > 0 &&
      dataArr.map((cont) =>
        newFormat.push({
          user_id: parseInt(cont.user_id),
          fee: parseFloat(cont.fee),
        })
      );

    return newFormat;
  };

  const getTotalContributions = (contArr) => {
    const newData = formatData(contArr);

    return newData
      .map((data) => parseFloat(data.fee))
      .reduce((sum, prev) => sum + prev, 0);
  };

  useEffect(() => {
    try {
      collection("contributions")
        .then((res) => {
          const data = res.data.data;
          setContributions(
            data.filter(
              (contribution) =>
                contribution.current && !contribution.isAdministrator
            )
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(getTotalContributions(contributions));

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <button
            type="button"
            className="btn btn-success btn-rounded mb-4"
            disabled={paymentStatus && paymentStatus !== "active"}
            onClick={() => handlePost()}
          >
            Post Payments
          </button>
        </div>
        <div className="col-md-12">
          <TableCard columns={columns} rows={contributions} />
        </div>
      </div>
    </>
  );
};

export default CreditMembers;
