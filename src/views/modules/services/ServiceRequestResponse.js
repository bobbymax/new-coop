/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Alert from "../../../services/helpers/classes/Alert";
import { alter, collection } from "../../../services/requests/controllers";
import ServiceCards from "./components/ServiceCards";

const ServiceRequestResponse = () => {
  const [services, setServices] = useState([]);

  const handleApprove = (Id) => {
    const data = {
      action: "approved",
    };

    try {
      alter("services", Id, data)
        .then((res) => {
          const result = res.data;
          setServices(
            services.map((service) => {
              if (service.id == result?.data?.id) {
                return result?.data;
              }

              return service;
            })
          );
          Alert.success("Completed!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
          Alert.error("Oops!!", "Something went wrong");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDenial = (Id) => {
    const data = {
      action: "denied",
    };

    try {
      alter("services", Id, data)
        .then((res) => {
          const result = res.data;
          setServices(
            services.map((service) => {
              if (service.id == result?.data?.id) {
                return result?.data;
              }

              return service;
            })
          );
          Alert.success("Completed!", result.message);
        })
        .catch((err) => {
          console.log(err.message);
          Alert.error("Oops!!", "Something went wrong");
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      collection("services")
        .then((res) => {
          const result = res.data.data;
          setServices(result);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  // console.log(services);

  return (
    <>
      <div className="row">
        {services?.length > 0 &&
          services.map((service) => (
            <div className="col-md-4" key={service.id}>
              {/* params: service, member */}
              <ServiceCards
                service={service}
                category={service?.label}
                approveServ={handleApprove}
                denyServ={handleDenial}
              />
            </div>
          ))}
      </div>
    </>
  );
};

export default ServiceRequestResponse;
