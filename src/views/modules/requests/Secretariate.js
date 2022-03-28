/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "../../../services/helpers/classes/Alert";
import { collection } from "../../../services/requests/controllers";
import TableCard from "../../../theme/components/tables/TableCard";

const Secretariate = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  const columns = [
    { key: "code", label: "Reference" },
    { key: "amount", label: "Amount", format: "currency" },
    { key: "name", label: "Beneficiary" },
    { key: "budget_head_name", label: "Category" },
  ];

  const handleLoan = (data) => {
    // console.log(data);

    if (data.stage === "secretariate") {
      navigate(`/loan/${data.code}/decision`, {
        state: {
          loan: data,
          budget: data.budget_head,
        },
      });
    } else {
      setError("A decision has already been made on this loan!!!");
    }
  };

  useEffect(() => {
    if (error !== "") {
      const intervalI = setInterval(() => {
        setError("");
      }, 2000);

      return () => clearInterval(intervalI);
    }
  }, [error]);

  useEffect(() => {
    if (location.state && location.state.loan && location.state.status) {
      const loan = location.state.loan;
      const status = location.state.status;

      setLoans(
        loans.map((ln) => {
          if (ln.id == loan.id) {
            return loan;
          }

          return ln;
        })
      );

      Alert.success("Registered!!", status);
    }
  }, []);

  useEffect(() => {
    try {
      collection("loans")
        .then((res) => {
          const data = res.data.data;

          setLoans(
            data.filter(
              (loan) =>
                loan.status === "registered" &&
                auth.roleLabels.includes(loan.stage)
            )
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="row">
        {error !== "" && (
          <div className="col-md-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}
        <div className="col-md-12">
          <TableCard columns={columns} rows={loans} handleEdit={handleLoan} />
        </div>
      </div>
    </>
  );
};

export default Secretariate;
