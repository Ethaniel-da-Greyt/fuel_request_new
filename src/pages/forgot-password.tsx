import { useForgotPassword } from "@/context/ForgotPassword";
import Link from "next/link";
import React, { useState } from "react";

const ForgotPassword = () => {
  const { sendEmail } = useForgotPassword();
  const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEmail(email);
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
          <p className="text-sm text-center text-gray-500">
            Enter your email and we’ll send you a reset link.
          </p>

          <form onSubmit={handleForgotPassword} className="mt-4 space-y-4">
            {/* <p>{message}</p> */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full focus:outline-0"
              required
            />

            <button type="submit" className="btn btn-primary w-full">
              Send Reset Link
            </button>
          </form>

          <div className="text-center mt-4">
            <Link href={"/login"} className="text-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
