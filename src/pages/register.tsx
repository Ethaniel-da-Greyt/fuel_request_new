import { useAuth } from "@/context/AuthContext";
import { ErrorMsg } from "@/types/ApiResponse";
import { Signup } from "@/types/signup";
import Link from "next/link";
import React, { useState } from "react";

const Register = () => {
  const { register } = useAuth();
  const [signup, setSignUp] = useState<Signup>({
    email: "",
    password: "",
    name: "",
    password_confirmation: "",
  });
  const [errmsg, setErrmsg] = useState<ErrorMsg>({
    message: "",
    error: "",
  });

  const reg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const regstr = await register(
      signup.name,
      signup.email,
      signup.password,
      signup.password_confirmation
    );

    if (regstr?.error) {
      setErrmsg({
        message: regstr?.message,
        error: regstr?.error,
      });
    }
  };
  return (
    <div className="flex justify-center items-end h-170">
      <div className="">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend text-center text-2xl">
            Register
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
          <form onSubmit={reg}>
            <>
              <label className="label">Name</label>
              <input
                type="text"
                className="input mb-4 focus:outline-0"
                placeholder="Email"
                required
                value={signup.name}
                onChange={(e) => setSignUp({ ...signup, name: e.target.value })}
              />
              <label className="label">Email</label>
              <input
                type="email"
                className="input mb-4 focus:outline-0"
                placeholder="Email"
                required
                value={signup.email}
                onChange={(e) =>
                  setSignUp({ ...signup, email: e.target.value })
                }
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input mb-2 focus:outline-0"
                placeholder="Password"
                required
                value={signup.password}
                onChange={(e) =>
                  setSignUp({ ...signup, password: e.target.value })
                }
              />
              <label className="label">Confirm Password</label>
              <input
                type="password"
                className="input mb-2 focus:outline-0"
                placeholder="Password"
                required
                value={signup.password_confirmation}
                onChange={(e) =>
                  setSignUp({
                    ...signup,
                    password_confirmation: e.target.value,
                  })
                }
              />
            </>
            <div className="mt-2">
              <button className="btn btn-primary w-full" type="submit">
                Register
              </button>
            </div>
            <p>
              Already have an account? <Link href={"/login"}>Login Here</Link>
            </p>
          </form>
        </fieldset>
      </div>
    </div>
  );
};

export default Register;
