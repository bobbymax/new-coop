import { useEffect, useState } from "react";
import axios from "axios";
import { batchRequests } from "../../services/requests/controllers";

const useBatchCollection = (params) => {
  const { uris } = params;

  const [dataCollections, setDataCollections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      batchRequests(uris)
        .then(
          axios.spread((...res) => {
            setDataCollections(res);
          })
        )
        .catch((err) => {
          setError(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, [uris]);

  return { dataCollections, error };
};

export default useBatchCollection;
