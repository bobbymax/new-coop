/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { fetch } from "../../services/requests/controllers";

const useFetch = (params) => {
  const { uri, id } = params;

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (uri !== "") {
      try {
        fetch(uri, id)
          .then((res) => {
            const response = res.data;
            setData(response.data);
          })
          .catch((err) => {
            setError(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [uri]);

  return { data, error };
};

export default useFetch;
