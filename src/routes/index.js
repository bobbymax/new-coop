import { lazy } from "react";

const Dashboard = lazy(() => import("../views/Dashboard"));
const Settings = lazy(() => import("../views/modules/administration/Settings"));
const Configuration = lazy(() =>
  import("../views/modules/administration/Configuration")
);
const Roles = lazy(() => import("../views/modules/administration/Roles"));
const Login = lazy(() => import("../views/auth/Login"));
const Members = lazy(() =>
  import("../views/modules/administration/registry/Members")
);
const ManageMember = lazy(() =>
  import("../views/modules/administration/registry/ManageMember")
);
const Budgets = lazy(() => import("../views/modules/budget/Budgets"));
const BudgetHeads = lazy(() => import("../views/modules/budget/BudgetHeads"));
const Funds = lazy(() => import("../views/modules/budget/Funds"));
const AccountCodes = lazy(() =>
  import("../views/modules/account/AccountCodes")
);
const ChartOfAccount = lazy(() =>
  import("../views/modules/account/ChartOfAccount")
);
const Deductions = lazy(() =>
  import("../views/modules/contributions/Deductions")
);
const CreditMembers = lazy(() =>
  import("../views/modules/contributions/CreditMembers")
);
const Loans = lazy(() => import("../views/modules/requests/Loans"));
const LoanRequest = lazy(() => import("../views/modules/requests/LoanRequest"));
const GrantLoans = lazy(() => import("../views/modules/requests/GrantLoans"));
const LoanApprovals = lazy(() =>
  import("../views/modules/requests/LoanApprovals")
);
const Expenditures = lazy(() =>
  import("../views/modules/account/Expenditures")
);

const Batch = lazy(() => import("../views/modules/account/Batch"));
const Payments = lazy(() => import("../views/modules/account/Payments"));
const Secretariate = lazy(() =>
  import("../views/modules/requests/Secretariate")
);
const Decision = lazy(() => import("../views/modules/requests/Decision"));
const Imports = lazy(() => import("../views/modules/console/Imports"));
const Profile = lazy(() => import("../views/modules/members/Profile"));
const ServiceRequest = lazy(() =>
  import("../views/modules/services/ServiceRequest")
);
const PasswordReset = lazy(() => import("../views/auth/PasswordReset"));
const ApplyLoan = lazy(() => import("../views/modules/loans/ApplyLoan"));
const Journals = lazy(() => import("../views/modules/records/Journals"));
const SettledLoans = lazy(() =>
  import("../views/modules/requests/SettledLoans")
);
const PaymentExport = lazy(() =>
  import("../views/modules/exports/PaymentExport")
);

export const pages = {
  guests: [
    {
      name: "Login",
      component: <Login />,
      path: "/login",
    },
  ],
  resets: [
    {
      name: "Reset Password",
      component: <PasswordReset />,
      path: "/reset-password",
    },
  ],
  protected: [
    {
      name: "Dashboard",
      component: <Dashboard />,
      path: "/",
    },
    {
      name: "Settings",
      component: <Settings />,
      path: "/settings",
    },
    {
      name: "Configuration",
      component: <Configuration />,
      path: "/configuration",
    },
    {
      name: "Roles",
      component: <Roles />,
      path: "/roles",
    },
    {
      name: "Members",
      component: <Members />,
      path: "/members",
    },
    {
      name: "Manage Member",
      component: <ManageMember />,
      path: "/members/:id/manage",
    },
    {
      name: "Budget Heads",
      component: <Budgets />,
      path: "/budget-heads",
    },
    {
      name: "Sub Budget Heads",
      component: <BudgetHeads />,
      path: "/sub-budget-heads",
    },
    {
      name: "Fund Sub Budget Head",
      component: <Funds />,
      path: "/funds",
    },
    {
      name: "Account Codes",
      component: <AccountCodes />,
      path: "/account-codes",
    },
    {
      name: "Chart of Accounts",
      component: <ChartOfAccount />,
      path: "/chart-of-accounts",
    },
    {
      name: "Journals",
      component: <Journals />,
      path: "/journals",
    },
    {
      name: "Deductions",
      component: <Deductions />,
      path: "/contribution/deductions",
    },
    {
      name: "Credit Member Accounts",
      component: <CreditMembers />,
      path: "/credit/accounts",
    },
    {
      name: "Loans",
      component: <Loans />,
      path: "/loans",
    },
    {
      name: "Calculate Loan",
      component: <LoanRequest />,
      path: "/loans/:id/calculate",
    },
    {
      name: "Approved Loans",
      component: <SettledLoans />,
      path: "/approved/loans",
    },
    {
      name: "Grant Loans",
      component: <GrantLoans />,
      path: "/grant-loans",
    },
    {
      name: "Payments Export",
      component: <PaymentExport />,
      path: "/export/payment/mandate",
    },
    {
      name: "Approve Loans",
      component: <LoanApprovals />,
      path: "/approve/loans",
    },
    {
      name: "Loan Decision",
      component: <Secretariate />,
      path: "/loan/decision",
    },
    {
      name: "Decision",
      component: <Decision />,
      path: "/loan/:id/decision",
    },
    {
      name: "Expenditures",
      component: <Expenditures />,
      path: "/expenditures",
    },
    {
      name: "Batch Payments",
      component: <Batch />,
      path: "/batch/payments",
    },
    {
      name: "Payments",
      component: <Payments />,
      path: "/payments",
    },
    {
      name: "Imports",
      component: <Imports />,
      path: "/imports",
    },
    {
      name: "Member Profile",
      component: <Profile />,
      path: "/member/profile",
    },
    {
      name: "Member Profile",
      component: <ServiceRequest />,
      path: "/service/requests",
    },
    {
      name: "Apply Loans",
      component: <ApplyLoan />,
      path: "/apply/loans",
    },
  ],
};
