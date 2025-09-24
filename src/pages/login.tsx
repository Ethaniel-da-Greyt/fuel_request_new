import React, { useCallback, useState } from "react";
import { Login as LoginType } from "../types/login";
import { useRouter } from "next/router";
import { ApiResponse, LaravelResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { setToken } = useAuth();
  const [login, setLogin] = useState<LoginType>({ email: "", password: "" });
  const [errmsg, setErrmsg] = useState<ApiResponse>({
    status: 0,
    message: "",
    error: "",
  });

  const [laravelres, setLaravelRes] = useState<LaravelResponse>({
    status: 0,
    error: "",
  });

  const route = useRouter();

  const log = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: login.email, password: login.password }),
      });

      if (!res.ok) {
        console.log("Error API");
      }

      const data = await res.json();

      if (data.access_token) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        route.push("/admin/Display");
      } else {
        setErrmsg({
          status: data?.status,
          message: data?.message,
          error: data?.error,
        });

        setLaravelRes({
          status: data?.status,
          error: data?.error,
        });

        console.log("Error", laravelres);
      }

      if (errmsg.error) {
        alert(errmsg.error);
      }

      console.log("data", data);
    },
    [login, route, errmsg, laravelres, setToken]
  );

  return (
    <div className="flex justify-center items-end h-150 ">
      <div className="">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend mb-3 text-center text-2xl">
            Login
          </legend>
          {errmsg.message && (
            <div role="alert" className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Warning: {errmsg.message}</span>
              <button
                className="btn-ghost btn-sm"
                onClick={() => setErrmsg((prev) => ({ ...prev, message: "" }))}
              >
                ✕
              </button>
            </div>
          )}
          <form onSubmit={log}>
            <label className="label">Email</label>
            <input
              type="email"
              className="input mb-4 focus:outline-0"
              placeholder="Email"
              value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })}
            />

            <label className="label">Password</label>
            <input
              type="password"
              className="input mb-2 focus:outline-0"
              placeholder="Password"
              value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })}
            />

            <div className="mt-4">
              <button className="btn btn-primary w-full " type="submit">
                Login
              </button>
            </div>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default Login;
