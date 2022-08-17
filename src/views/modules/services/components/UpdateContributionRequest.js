import * as Icon from "react-feather";
import { money } from "../../../../services/helpers/functions";

const UpdateContributionRequest = ({
  fields,
  status,
  member,
  onSubmit,
  onDeny,
}) => {
  return (
    <>
      <div className="details">
        <h5>PLEASE UPDATE CONTRIBUTION</h5>
        <div className="line"></div>
        <p>CURRENT AMOUNT:</p>
        <h4>{money(member?.contribution?.fee)}</h4>
        <div className="line"></div>
        <p>NEW AMOUNT:</p>
        <h2>{money(fields?.amount)}</h2>
        <div className="line"></div>
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

export default UpdateContributionRequest;
