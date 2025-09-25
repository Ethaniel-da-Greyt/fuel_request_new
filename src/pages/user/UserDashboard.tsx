import Layout from "@/components/Layout";
import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";

const UserDashboard = () => {
  const { logout, token, role } = useAuth();

  return (
    <Layout>
      <div>
        <button onClick={logout}>Logout</button>
        <div className="">
          <h1>hello </h1>
          <div className="">
            <button
              className="btn btn-primary rounded-2xl"
              onClick={() => {
                const addModal = document.getElementById(
                  "addModal"
                ) as HTMLDialogElement;
                addModal?.showModal();
              }}
            >
              Make Request
            </button>
            <dialog id="addModal" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                  Press ESC key or click on ✕ button to close
                </p>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
