import React, { useEffect } from "react";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import FeesStructureView from "./Earning/FeesStructureView";
import ExpensesView from "./Expenses/ExpensesView";
import FeeDetails from "./Earning/FeeDetails";
import { useLocation, useNavigate } from "react-router-dom";
import AdmissionFeesView from "./Earning/AdmissionFeesView";
import PendingAdmissionsView from "./Report/PendingAdmissionsView";
import PaymentsView from "./Earning/PaymentsView";

const FinanceView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = React.useState();
  const tabsList = [
    {
      code: "report",
      title: "Report",
      content: (
        <PendingAdmissionsView />
      ),
    },
    {
      code: "earning",
      title: "Earning",
      content: (
        <div className="d-flex flex-column gap-5">
          <PaymentsView />
          <AdmissionFeesView />
          <FeesStructureView />
          <FeeDetails />
        </div>
      ),
    },
    { code: "expenses", title: "Expenses", content: <ExpensesView /> },
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const activeView = queryParams.get("activeView") || tabsList[0].code;
    setSelectedTab(activeView);
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    navigate(`?activeView=${newValue}`, { replace: true });
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="Finance tabs"
        sx={{ marginBottom: 2 }}
      >
        {tabsList.map((tab) => (
          <Tab
            key={tab.code}
            value={tab.code}
            label={tab.title}
            aria-controls={`tabpanel-${tab.code}`}
            wrapped
          />
        ))}
      </Tabs>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {tabsList.find((tab) => tab.code === selectedTab)?.content}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinanceView;
