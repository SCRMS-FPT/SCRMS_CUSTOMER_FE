import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children, className = "" }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-grow ${className}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
