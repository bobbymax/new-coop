/* eslint-disable no-unused-vars */
import React from "react";
import "../modules/requests/loan.css";
import { money } from "../../services/helpers/functions";
import "./dashboard.css";

const AuthDashboardCard = ({ auth, cardValues }) => {
  const {
    availableBalance,
    currentContribution,
    currentLoan,
    registeredMembers,
    totalMembersContributions,
    totalAllTimeContribution,
    budgetAllocation,
    totalOutstanding,
  } = cardValues;

  const cards = [
    {
      title: "Available Balance",
      figure: availableBalance,
      format: "currency",
      roles: ["member", "super-administrator"],
    },
    {
      title: "Current Contribution",
      figure: currentContribution,
      format: "currency",
      roles: ["member", "super-administrator"],
    },
    {
      title: "Current Loan",
      figure: currentLoan,
      format: "currency",
      roles: ["member", "super-administrator"],
    },
    {
      title: "Registered Members",
      figure: registeredMembers,
      format: "number",
      roles: ["administrator", "super-administrator"],
    },
    {
      title: "Total Members Contribution",
      figure: totalMembersContributions,
      format: "currency",
      roles: [
        "administrator",
        "super-administrator",
        "general-secretary",
        "president",
        "treasury-officer",
      ],
    },
    {
      title: "Total All Time Contributions",
      figure: totalAllTimeContribution,
      format: "currency",
      roles: [
        "administrator",
        "super-administrator",
        "general-secretary",
        "president",
        "treasury-officer",
      ],
    },
    {
      title: "Budget Allocation",
      figure: budgetAllocation,
      format: "currency",
      roles: [
        "general-secretary",
        "president",
        "account-officer",
        "treasury-officer",
        "super-administrator",
      ],
    },
    {
      title: "Total Outstanding",
      figure: totalOutstanding,
      format: "currency",
      roles: [
        "general-secretary",
        "president",
        "account-officer",
        "treasury-officer",
        "super-administrator",
      ],
    },
  ];
  return (
    <div className="row flex">
      {cards.map(
        (card, i) =>
          auth &&
          card.roles.some((role) => auth && auth.roleLabels.includes(role)) && (
            <div key={i} className="col-md-4 mb-4">
              <div className="loan-card">
                <div className="card-body">
                  <h4 className="card-title text-muted mb-3">{card.title}</h4>
                  <div className="row">
                    <div className="col-sm-12">
                      <h4 className="text-success">
                        {card.format === "currency"
                          ? money(card.figure)
                          : card.figure}
                      </h4>
                      {card.format === "currency" && (
                        <span className="updated bg-success">
                          as at October, 2022
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default AuthDashboardCard;
