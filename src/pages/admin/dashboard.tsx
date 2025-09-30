import Layout from "@/components/Layout";
import React, { ReactNode } from "react";

const Dashboard = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Layout>
        <div className="mb-2">{children}</div>
      </Layout>
    </>
  );
};

export default Dashboard;
