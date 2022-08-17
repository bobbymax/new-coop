import moment from "moment";
import * as Icon from "react-feather";

const AirTicketRequest = ({ fields, status, onSubmit, onDeny }) => {
  // console.log(fields);
  return (
    <>
      <div className="details">
        <h5>PASSENGER(S)</h5>
        <ul>
          <li>{fields?.passengers}</li>
        </ul>
        <div className="line"></div>
        <p>
          {fields?.type?.toUpperCase() + " " + fields?.trip?.toUpperCase()}{" "}
          TICKET
        </p>
        <h6>
          {moment(fields?.from).format("ll")?.toUpperCase() +
            " - " +
            moment(fields?.to).format("ll")?.toUpperCase()}
        </h6>
        <div className="line"></div>
        <p>
          <strong>AIRLINE: {fields?.airline}</strong>
        </p>
        <p style={{ color: "#d35400" }}>
          {fields?.takeOff?.toUpperCase()} -{" "}
          {fields?.destination?.toUpperCase()}
        </p>
        <div className="line"></div>
        <p>
          <strong>{fields?.timeOfDay?.toUpperCase()} FLIGHT</strong>
        </p>
      </div>
      {status === "registered" ? (
        <div className="btn-group btn-rounded btn-block mt-3">
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={() => onSubmit(fields?.service_id)}
          >
            <Icon.Check size={14} />
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDeny(fields?.service_id)}
          >
            <Icon.X size={14} />
          </button>
        </div>
      ) : (
        <div
          className={`badge badge-pill badge-${
            status === "approved" ? "success" : "danger"
          } mt-3`}
          style={{ fontSize: 10 }}
        >
          {status?.toUpperCase()}
        </div>
      )}
    </>
  );
};

export default AirTicketRequest;
