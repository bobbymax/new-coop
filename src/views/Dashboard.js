/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Alert from "../services/helpers/classes/Alert";
import { money } from "../services/helpers/functions";
import { batchRequests, collection } from "../services/requests/controllers";
import AuthDashboardCard from "./dashboards/AuthDashboardCard";
import "./modules/requests/loan.css";
import "../App.css";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const budgetYear = useSelector((state) => state.config.value.budget_year);

  const initialState = {
    eligibility: 0,
    availableBalance: 0,
    currentContribution: 0,
    currentLoan: 0,
    registeredMembers: 0,
    totalMembersContributions: 0,
    totalAllTimeContribution: 0,
    budgetAllocation: 0,
    totalOutstanding: 0,
  };

  const [state, setState] = useState(initialState);

  const onBoardMembers = () => {
    try {
      collection("onboard/members")
        .then((res) => {
          const result = res.data;
          console.log(result.data);
          Alert.success("Mail Sent!!", result.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth !== null) {
      try {
        const contributionData = collection("contributions");
        const membersData = collection("members");
        const fundsData = collection("funds");
        const walletsData = collection("wallets");

        const runningLoan = parseFloat(auth?.running_loan_amount);
        const wallet = parseFloat(auth?.wallet?.current);

        let getEligibilityFigure = wallet * 2 - runningLoan;

        const eligibility = getEligibilityFigure > 0 ? getEligibilityFigure : 0;

        // if running_loan_amount > 0 => multiply current by 2 => subtract running_loan_amount from elibility => if < 0 set not eligible else set eligibility to result

        batchRequests([
          contributionData,
          membersData,
          fundsData,
          walletsData,
        ]).then(
          axios.spread((...res) => {
            const contributions = res[0].data.data;
            const members = res[1].data.data;
            const funds = res[2].data.data;
            const wallets = res[3].data.data;

            const validContributions = contributions.filter(
              (cont) =>
                cont?.current &&
                !cont?.member?.roleLabels?.includes("super-administrator")
            );

            const contributionSum = validContributions
              .map((cont) => cont && parseFloat(cont?.fee))
              .reduce((sum, previous) => sum + previous, 0);

            const validRegisteredMemebers = members.filter(
              (mem) =>
                mem?.status === "active" &&
                !mem?.roleLabels?.includes("super-administrator")
            );

            const walletsSum = wallets
              .map((wallet) => parseFloat(wallet?.current))
              .reduce((sum, previous) => sum + previous, 0);

            const fundSum = funds
              .map(
                (fund) =>
                  parseInt(fund?.year) == parseInt(budgetYear) &&
                  parseFloat(fund?.approved_amount)
              )
              .reduce((sum, previous) => sum + previous, 0);

            setState({
              ...state,
              eligibility: parseFloat(eligibility),
              availableBalance: parseFloat(auth?.wallet?.current),
              currentContribution: parseFloat(auth?.contribution?.fee),
              currentLoan: parseFloat(auth?.running_loan_amount),
              registeredMembers: validRegisteredMemebers.length,
              totalMembersContributions: contributionSum,
              totalAllTimeContribution: walletsSum,
              totalOutstanding: parseFloat(auth?.total_outstanding),
              budgetAllocation: fundSum,
            });
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth]);

  console.log(auth);

  return (
    <>
      <div className="row mb-5">
        <div className="col-md-12 mb-3">
          <h3 className="welcome-text">
            Welcome,{" "}
            <span className="header-text bg-success">
              {auth?.firstname + " " + auth?.surname}
            </span>
          </h3>
        </div>
        <div className="col-md-4">
          <div className="loan-card bg-success">
            <div className="card-body">
              <h4 className="text-white">{`Loan Eligibility`.toUpperCase()}</h4>
              <h2 className="text-warning">{money(state.eligibility)}</h2>
            </div>
          </div>
        </div>
        {auth.roleLabels.includes("super-administrator") && (
          <div className="col-md-8">
            <button
              type="button"
              className="btn btn-success btn-block btn-sm btn-rounded"
              onClick={() => onBoardMembers()}
            >
              Onboard Members
            </button>
          </div>
        )}
      </div>
      <AuthDashboardCard auth={auth} cardValues={state} />
      <div className="row">
        <div className="col-md-12 mt-4">
          <h2 className="how-to">How-To Training Videos</h2>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-4 mb-2">
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/vfsMBWp9I-Y"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div className="col-md-4 mb-2">
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/CiDALaJHnLc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <div className="col-md-4 mb-2">
          <iframe
            width="100%"
            height="200"
            src="https://www.youtube.com/embed/c5MXM4jsvFY"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
