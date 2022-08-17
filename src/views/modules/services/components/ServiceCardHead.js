import React from "react";

const ServiceCardHead = ({ name, category, member, date }) => {
  const categorySet = () => {
    let cat;
    switch (category) {
      case "air-ticket-purchase":
        cat = "airplane";
        break;

      default:
        cat = "contribution";
        break;
    }

    return cat;
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <p>{name?.toUpperCase()}</p>
        <h4>{member?.toUpperCase()}</h4>
        <p className="requested__date">{date?.toUpperCase()}</p>
      </div>
      <div className="col-md-4">
        <div className="service-category__img" id={categorySet()}></div>
      </div>
    </div>
  );
};

export default ServiceCardHead;
