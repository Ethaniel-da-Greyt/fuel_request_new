import { error } from "console";
import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import toast from "react-hot-toast";

interface RegResponse {
  error?: string;
  message?: string;
}

interface LoginRes {
  status?: number;
  error?: string;
  message?: string;
}

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  role: string | null;
  logout: () => void;
  login: (email: string, password: string) => Promise<LoginRes | undefined>;
  register: (
    email: string,
    password: string,
    name: string,
    password_confirmation: string
  ) => Promise<RegResponse | undefined>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loginAPI = `${process.env.NEXT_PUBLIC_APP_URL}/login`;
const SignupAPI = `${process.env.NEXT_PUBLIC_APP_URL}/signup`;
const LogoutLink = `${process.env.NEXT_PUBLIC_APP_URL}/logout`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const route = useRouter();
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRoles] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setTokenState(storedToken);
    }
  }, []);

  const setToken = (token: string | null) => {
    if (!token) {
      localStorage.removeItem("token");
    }
    setTokenState(token);
  };

  //login
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const reslog = await fetch(loginAPI, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await reslog.json();
        if (!reslog.ok) {
          return {
            error: data?.error || "Login Failed",
            message: data?.message,
            status: data?.status || 400,
          };
        }
        toast.success("Login Successfully");
        if (data.access_token) {
          if (data.role) {
            setRoles(data.role);
            localStorage.setItem("role", data.role);
            localStorage.setItem("id", data.userId);
            localStorage.setItem("token", data.access_token);
            setToken(data.access_token);
            console.log(data);

            switch (data.role) {
              case "requestor":
                route.replace("/user/UserDashboard");
                break;
              case "admin":
                route.replace("/admin/Display");
                break;
              default:
                localStorage.removeItem("id");
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                route.replace("/");
                break;
            }
          }
        }

        return {
          ...data,
          error: data?.error,
          message: data?.message,
          status: data?.status || 400,
        };
      } catch (error) {
        console.log("Error: ", error);
      }
    },
    [route]
  );

  //register
  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    try {
      const res = await fetch(SignupAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      const response = await res.json();
      if (!res.ok) {
        toast.error("Failed to register");

        return { error: response?.error, message: response?.message };
      }

      toast.success("Registered Successfully");

      return {
        ...response,
        error: response?.error,
        message: response?.message,
      };
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const logout = useCallback(async () => {
    try {
      const getToken = localStorage.getItem("token");
      const res = await fetch(LogoutLink, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${getToken}`,
        },
      });

      const response = await res.json();

      if (!response) {
        console.error("Error");
      }

      setToken(null);
      setRoles(null);
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      localStorage.removeItem("UserRole");
      route.replace("/");
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setToken(null);
      setRoles(null);
      localStorage.removeItem("id");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      route.replace("/");
    }
  }, [route]);

  return (
    <AuthContext.Provider
      value={{ token, setToken, logout, login, role, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;
