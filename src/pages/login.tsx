import React, { useCallback, useState } from "react";
import { Login as LoginType } from "../types/login";
import { ErrorMsg } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

const Login = () => {
  const { login } = useAuth();
  const [logUser, setLogUser] = useState<LoginType>({
    email: "",
    password: "",
  });

  const [errmsg, setErrmsg] = useState<ErrorMsg>({
    message: "",
    error: "",
  });

  const log = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const logg = await login(logUser.email, logUser.password);
        // console.log(logg);

        if (logg?.error) {
          setErrmsg({
            error: logg?.error,
            message: logg?.message,
          });

          console.log(errmsg.error);
        }
      } catch (error) {
        setErrmsg({
          message: "Something went wrong",
          error: String(error),
        });
        console.log("Error: ", error);
      }
    },
    [logUser, login, errmsg]
  );

  return (
    <div className="flex justify-center items-end h-150">
      <div className="flex justify-center items-end">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-center text-2xl">
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
                onClick={() => setErrmsg(() => ({ message: "" }))}
              >
                ✕
              </button>
            </div>
          )}
          <form onSubmit={log}>
            <>
              <label className="label">Email</label>
              <input
                type="email"
                className="input mb-4 focus:outline-0"
                placeholder="Email"
                required
                value={logUser.email}
                onChange={(e) =>
                  setLogUser({ ...logUser, email: e.target.value })
                }
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input mb-2 focus:outline-0"
                placeholder="Password"
                required
                value={logUser.password}
                onChange={(e) =>
                  setLogUser({ ...logUser, password: e.target.value })
                }
              />
            </>
            <Link
              href={"forgot-password"}
              className="text-primary flex justify-end font-semibold"
            >
              Forgot Password
            </Link>
            <div className="mt-4">
              <button className="btn btn-primary w-full" type="submit">
                Login
              </button>
            </div>
            <p>
              Dont have an account?{" "}
              <Link href={"/register"}>Register Here</Link>
            </p>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default Login;
