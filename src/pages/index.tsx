import Layout from "@/components/Layout";
import React from "react";

const Index = () => {
  return (
    <>
      <Layout>
        <div className="flex justify-center items-center h-150">
          <div className="p-5 shadow-lg rounded hover:bg-amber-950 cursor-pointer transition-colors">
            <h3 className="text-4xl text-orange-400">Guest Dashboard</h3>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
