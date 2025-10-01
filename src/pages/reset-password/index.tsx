"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const emailFromQuery = searchParams.get("email");

  const [email, setEmail] = useState(emailFromQuery || "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setMessage("Invalid or missing reset token.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            token,
            email,
            password,
            password_confirmation: passwordConfirmation,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successful. Redirecting...");
        setMessage("Password reset successful. Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.message || "Reset failed.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleResetPassword}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-20 shadow-lg p-5 rounded"
    >
      <h2 className="text-xl font-semibold text-center">Reset Password</h2>
      {message && <p className="text-error text-sm text-center">{message}</p>}
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="input w-full focus:outline-0"
      />
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="input w-full focus:outline-0"
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        required
        className="input w-full focus:outline-0"
      />
      <button type="submit" className="btn btn-primary">
        Reset Password
      </button>
    </form>
  );
}
