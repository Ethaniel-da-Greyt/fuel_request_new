import Layout from "@/components/Layout";
import React, { ReactNode } from "react";

const Dashboard = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Layout>{children}</Layout>
    </>
  );
};

export default Dashboard;
