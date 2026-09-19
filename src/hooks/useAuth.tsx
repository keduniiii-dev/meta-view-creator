import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, clearToken, setToken } from "@/lib/api";
import type { AuthLoginResponse, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, requiredRole?: User["role"]) => Promise<void>;
  loginByPasscode: (passcode: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("crm_token")) { setLoading(false); return; }
    api.get<{ user: User }>("/auth/me").then((data) => setUser(data.user)).catch(() => clearToken()).finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string, requiredRole?: User["role"]) => {
    const data = await api.post<AuthLoginResponse>("/auth/login", { username, password });
    if (requiredRole && data.user.role !== requiredRole) throw new Error("An administrator account is required to access archived leads.");
    setToken(data.token);
    setUser(data.user);
  }, []);

  const loginByPasscode = useCallback(async (passcode: string) => {
    const data = await api.post<AuthLoginResponse>("/auth/passcode", { passcode });
    setToken(data.token);
    const me = await api.get<{ user: User }>("/auth/me");
    setUser(me.user);
    return me.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout").catch(() => undefined);
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginByPasscode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
