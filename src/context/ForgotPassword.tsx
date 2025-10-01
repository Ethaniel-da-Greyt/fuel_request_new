import { createContext, ReactNode, useContext } from "react";
import toast from "react-hot-toast";

interface APIRes {
  success: boolean;
  message?: string | null;
  error?: string | null;
}

type ForgotPasswordType = {
  sendEmail: (email: string) => Promise<APIRes>;
};

const ForgotPasswordContext = createContext<ForgotPasswordType | undefined>(
  undefined
);

export const ForgotPasswordProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const sendEmail = async (email: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const response = await res.json();

      if (!res.ok) {
        toast.error(`Error: ${response?.error}, Something went wrong`);
        return {
          success: false,
          error: response?.error,
          message: response?.message,
        };
      }

      toast.success("Email Sent, Check your Email");
      return {
        success: true,
        message: response?.message,
        error: response?.error,
      };
    } catch (error) {
      return {
        success: false,
        message: "Network Error",
        error: (error as Error).message,
      };
    }
  };

  return (
    <ForgotPasswordContext.Provider value={{ sendEmail }}>
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPassword = () => {
  const context = useContext(ForgotPasswordContext);
  if (!context) {
    throw new Error(
      "useForgotPassword must be used within ForgotPasswordProvider"
    );
  }

  return context;
};

export default ForgotPasswordContext;
