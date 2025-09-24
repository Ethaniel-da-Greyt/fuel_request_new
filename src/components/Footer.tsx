import React from "react";

const Footer = () => {
  return (
    <div className="flex justify-end items-end">
      <footer className="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            <span className="font-semibold"> Fuel Request</span>
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
