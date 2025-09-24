import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
type AuthContextType = {
  //Nag create ta ug Type pra sa AuthContext
  token: string | null; // Dri nag declare ta sa token ug string or null(wala)
  setToken: (token: string | null) => void; //gi include pud ang setToken nga function nga ang sulod sa parameter is only token nga string
  logout: () => void; //last kay nag include ghapon sa logout function
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LogoutLink = `${process.env.NEXT_PUBLIC_APP_URL}/logout`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const route = useRouter();
  const [token, setTokenState] = useState<string | null>(null);

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

  const logout = async () => {
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
      route.replace("/");
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setToken(null);
      route.replace("/");
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
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
