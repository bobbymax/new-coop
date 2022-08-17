import "../service.css";
import AirTicketRequest from "./AirTicketRequest";
import ServiceCardHead from "./ServiceCardHead";
import UpdateContributionRequest from "./UpdateContributionRequest";

const ServiceCards = ({ service, category, approveServ, denyServ }) => {
  const member =
    service?.controller?.firstname + " " + service?.controller?.surname;

  const handleApprove = (servId) => {
    approveServ(servId);
  };

  const handleDenied = (servId) => {
    denyServ(servId);
  };
  return (
    <div className="service-card">
      <div className="service-card__header">
        {/* Service Head Here */}
        <ServiceCardHead
          name={service?.code}
          category={service?.label}
          member={member}
          date={service?.created_at}
        />
      </div>
      <div className="service-card__body mt-2">
        {/* Service Boday Here */}
        {category === "air-ticket-purchase" && (
          <AirTicketRequest
            fields={service?.fields}
            status={service?.status}
            onSubmit={handleApprove}
            onDeny={handleDenied}
          />
        )}
        {category === "update-contribution-fee" && (
          <UpdateContributionRequest
            fields={service?.fields}
            status={service?.status}
            member={service?.controller}
            onSubmit={handleApprove}
            onDeny={handleDenied}
          />
        )}
      </div>
    </div>
  );
};

export default ServiceCards;
