import Layout from "@/components/Layout";
import React from "react";

const Index = () => {
  return (
    <>
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="bg-gray-900 p-8 rounded-xl shadow-2xl transition duration-300 transform hover:scale-105 hover:shadow-orange-500/30">
            <h3 className="text-5xl font-bold text-orange-400 text-center mb-2">
              Guest Dashboard
            </h3>
            <p className="text-gray-400 text-center text-lg">
              Welcome! Explore the features available to you.
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
