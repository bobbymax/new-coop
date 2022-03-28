import React from "react";

const DashboardCard = ({
  title,
  subtitle = "",
  figure,
  variation = "success",
  figureVariation = "info",
}) => {
  return (
    <div className={`card bg-${variation} card-rounded`}>
      <div className="card-body">
        <h4 className="card-title card-title-dash text-white mb-3">{title}</h4>
        <div className="row">
          <div className="col-sm-12">
            <h2 className={`text-${figureVariation}`}>{figure}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
