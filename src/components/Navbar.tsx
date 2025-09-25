import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { token, logout, role } = useAuth();
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Fuel Request</a>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <div
            //   tabIndex={0}
            //   role="button"
            //   className="btn btn-ghost btn-circle avatar"
            >
              <label className="btn btn-circle swap swap-rotate" role="button">
                {/* this hidden checkbox controls the state */}
                <input type="checkbox" />

                {/* hamburger icon */}
                <svg
                  className="swap-off fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
                </svg>

                {/* close icon */}
                <svg
                  className="swap-on fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 512 512"
                >
                  <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
                </svg>
              </label>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {token ? (
                role !== "requestor" ? (
                  <>
                    <li>
                      <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                      </a>
                    </li>
                    <li>
                      <Link href={"Display"}>Active Requests</Link>
                    </li>
                    <li>
                      <Link href={"History_Request"}>Request History</Link>
                    </li>

                    <li>
                      <button onClick={logout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button onClick={logout}>Logout</button>
                    </li>
                  </>
                )
              ) : (
                <li>
                  <Link href={"/login"}>Login</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
