export const dashboardCards = [
  {
    title: "Available Balance",
    figure: 0,
    format: "currency",
    roles: ["member", "super-administrator"],
  },
  {
    title: "Current Loan",
    figure: 0,
    format: "currency",
    roles: ["member", "super-administrator"],
  },
  {
    title: "Registered Members",
    figure: 0,
    format: "number",
    roles: ["administrator", "super-administrator"],
  },
  {
    title: "Total Members Contribution",
    figure: 0,
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
    figure: 0,
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
    figure: 0,
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
