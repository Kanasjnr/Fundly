import { Box } from "@chakra-ui/react";
import React from "react";
import Dashboard from "../components/Dashboard";
import SidebarWithHeader from "../components/SidebarWithHeader";

const DashboardPage = () => {
  return (
    <Box>
      <SidebarWithHeader>
      <Dashboard />
      </SidebarWithHeader>
      
    </Box>
  );
};

export default DashboardPage;
