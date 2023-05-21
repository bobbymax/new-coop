/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { alter } from "../../services/requests/controllers";

const useUpdate = (params) => {
  const { uri, id, data } = params;

  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      alter(uri, id, data)
        .then((res) => {
          const result = res.data;
          setResponse(result.data);
          setMessage(result.message);
        })
        .catch((err) => {
          setError(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, [uri]);

  return { response, message, error };
};

export default useUpdate;
