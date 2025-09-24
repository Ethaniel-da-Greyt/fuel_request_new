import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="h-full">{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
