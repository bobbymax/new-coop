/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { store } from "../../services/requests/controllers";

const useStore = (params) => {
  const { uri, data } = params;

  const [response, setResponse] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (uri !== "") {
      try {
        store(uri, data)
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
    }
  }, [uri]);

  return { response, message, error };
};

export default useStore;
