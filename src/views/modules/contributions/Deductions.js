/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { collection } from "../../../services/requests/controllers";

const Deductions = () => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    try {
      // collection();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return <div>Deductions</div>;
};

export default Deductions;
