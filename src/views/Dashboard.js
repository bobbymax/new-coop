/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { batchRequests, collection } from "../services/requests/controllers";
import AuthDashboardCard from "./dashboards/AuthDashboardCard";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth.value.user);
  const budgetYear = useSelector((state) => state.config.value.budget_year);

  const initialState = {
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

  useEffect(() => {
    if (auth !== null) {
      try {
        const contributionData = collection("contributions");
        const membersData = collection("members");
        const fundsData = collection("funds");
        const walletsData = collection("wallets");

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
                cont.current &&
                cont.member &&
                !cont.member.roleLabels.includes("super-administrator")
            );

            const contributionSum = validContributions
              .map((cont) => cont && parseFloat(cont.fee))
              .reduce((sum, previous) => sum + previous, 0);

            const validRegisteredMemebers = members.filter(
              (mem) =>
                mem &&
                mem.status === "active" &&
                !mem.roleLabels.includes("super-administrator")
            );

            const walletsSum = wallets
              .map((wallet) => wallet && parseFloat(wallet.current))
              .reduce((sum, previous) => sum + previous, 0);

            const fundSum = funds
              .map(
                (fund) =>
                  fund &&
                  parseInt(fund.year) == parseInt(budgetYear) &&
                  parseFloat(fund.approved_amount)
              )
              .reduce((sum, previous) => sum + previous, 0);

            setState({
              ...state,
              availableBalance: parseFloat(auth.wallet && auth.wallet.current),
              currentContribution: parseFloat(
                auth.contribution && parseFloat(auth.contribution.fee)
              ),
              registeredMembers: validRegisteredMemebers.length,
              totalMembersContributions: contributionSum,
              totalAllTimeContribution: walletsSum,
              budgetAllocation: fundSum,
            });
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth]);

  return (
    <>
      <AuthDashboardCard auth={auth} cardValues={state} />
    </>
  );
};

export default Dashboard;
