import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  role: string | null;
  logout: () => void;
  login: (email: string, password: string) => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const loginAPI = `${process.env.NEXT_PUBLIC_APP_URL}/login`;
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

        if (!reslog.ok) {
          console.log("Error: ", reslog.status);
        }

        const data = await reslog.json();
        if (data.access_token) {
          if (data.role) {
            const roles = data.role;
            setRoles(roles);
            localStorage.setItem("token", data.access_token);
            setToken(data.access_token);
            console.log(data);

            switch (role) {
              case "requestor":
                return route.replace("/user/UserDashboard");
              case "admin":
                return route.replace("/admin/Display");
            }
          }
        }

        return { ...data, status: reslog?.status };
      } catch (error) {
        console.log("Error: ", error);
      }
    },
    [route, role]
  );

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

      if (!response.ok) {
        console.error("Error");
      }

      setToken(null);
      setRoles(null);
      localStorage.removeItem("token");
      localStorage.removeItem("UserRole");
      route.replace("/");
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      localStorage.removeItem("UserRole");
      localStorage.removeItem("token");
      setToken(null);
      setRoles(null);
      route.replace("/");
    }
  }, [route]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout, login, role }}>
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
