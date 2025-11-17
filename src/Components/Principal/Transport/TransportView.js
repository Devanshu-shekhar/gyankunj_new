import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import MergedRoutesAndStudentMappingView from "./Routes/MergedRoutesAndStudentMappingView";
import VehiclesView from "./Vehicles/VehiclesView";
import MappingsView from "./Mappings/MappingsView";

const TransportView = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={activeTab} onChange={handleChange} variant="scrollable">
          <Tab label="Routes & Student Mapping" />
          <Tab label="Vehicles" />
          <Tab label="Mapping" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Box hidden={activeTab !== 0}>
        <MergedRoutesAndStudentMappingView />
      </Box>

      <Box hidden={activeTab !== 1}>
        <VehiclesView />
      </Box>

      <Box hidden={activeTab !== 2}>
        <MappingsView />
      </Box>
    </>
  );
};

export default TransportView;

// import React from "react";
// import RoutesView from "./Routes/RoutesView";
// import VehiclesView from "./Vehicles/VehiclesView";
// import { Grid } from "@mui/material";
// import MappingsView from "./Mappings/MappingsView";
// import StudentMappingView from "./Mappings/StudentMappingView";

// const TransportView = () => {
//   return (
//     <>
//       <Grid container spacing={4}>
//         <Grid item xs={12}>
//           <RoutesView />
//         </Grid>
//         <Grid item xs={12}>
//           <VehiclesView />
//         </Grid>
//         <Grid item xs={12}>
//           <MappingsView />
//         </Grid>
//         <Grid item xs={12}>
//           <StudentMappingView />
//         </Grid>
//       </Grid>
//     </>
//   );
// };

// export default TransportView;
