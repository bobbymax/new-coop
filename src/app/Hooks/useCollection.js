/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import { useEffect, useState } from "react";
import { collection } from "../../services/requests/controllers";

const useCollection = (params) => {
  const { url } = params;

  const [error, setError] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    if (url !== "") {
      try {
        collection(url)
          .then((res) => {
            const response = res.data;

            if (response.status != 204) {
              setCollections(response.data);
            } else {
              setError(response.message);
            }
          })
          .catch((err) => {
            setError(err.message);
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [url]);

  return { collections, error };
};

export default useCollection;
