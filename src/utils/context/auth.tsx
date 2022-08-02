import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI, Menu } from "../../api/auth.api";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import { User } from "../interfaces/models";

export interface AuthContextInterface {
  checkingSession: boolean | null;
  expiresAt: number | null;
  isAuthenticated: boolean | null;
  user: User | null;
  menus: Menu[];
  likes: string[];
  setLikes: (value: string[]) => void;
  setMenus: (value: Menu[]) => void;
  setUser: (value: any) => void;
  setCheckingSession: (value: boolean) => void;
  setExpiresAt: (value: number) => void;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
  notification: (content: string, options: ToastOptions) => React.ReactText;
}

export const authContextDefaults: AuthContextInterface = {
  checkingSession: true,
  expiresAt: null,
  isAuthenticated: false,
  user: null,
  menus: [],
  likes: [],
  setLikes: () => {},
  setMenus: () => {},
  setUser: () => {},
  setCheckingSession: () => {},
  setExpiresAt: () => {},
  setIsAuthenticated: () => {},
  login: () => {},
  logout: () => {},
  notification: () => "",
};

export const AuthContext =
  createContext<AuthContextInterface>(authContextDefaults);

export const AuthProvider: React.FC = ({ children }) => {
  const [checkingSession, setCheckingSession] = useState<boolean | null>(true);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  const [user, setUser] = useState<User | null>(null);
  const [likes, setLikes] = useState<string[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const notification = (
    content: string,
    options: ToastOptions
  ): React.ReactText => toast(content, options);

  const handleAuthentication = async (): Promise<void> => {
    const { expire, menus, error, message, statusCode } =
      await authAPI.verifyJwt();

    try {
      if (user && expire) {
        window.localStorage.setItem("@user", JSON.stringify(user));
        window.localStorage.setItem("@expire", expire.toString());

        setUser(user);
        setExpiresAt(expire);
        setCheckingSession(false);
        setMenus(Object.assign([], menus));
        setIsAuthenticated(true);
        navigate("/app", { replace: true });
        return;
      }

      if (error || !expire) {
        setCheckingSession(false);
        setIsAuthenticated(false);
        navigate("/", { replace: true });
        return;
      }

      const userCached = window.localStorage.getItem("@user");
      const expireCached = Number(window.localStorage.getItem("@expire"));

      if (expireCached && new Date(expireCached) < new Date()) {
        setCheckingSession(false);
        setIsAuthenticated(false);
        navigate("/", { replace: true });
        return;
      }

      if (userCached && expireCached) {
        setUser(JSON.parse(userCached));
        setExpiresAt(expireCached);
        setCheckingSession(false);
        setIsAuthenticated(true);
        setMenus(Object.assign([], menus));
        navigate("/app", { replace: true });
      }
    } catch (error) {
      setCheckingSession(false);
      setIsAuthenticated(false);
      navigate("/", { replace: true });
      return;
    }

    // setCheckingSession(false);
    // setIsAuthenticated(true);
    // setMenus(Object.assign([], menus));
    // navigate("/app", { replace: true });
  };

  const login = async (email: string, password: string) => {
    if (email.trim() === "" || password.trim() === "") {
      return notification("Preencha todos os campos", { type: "warning" });
    }

    const { user, expire, menus, error, message, statusCode } =
      await authAPI.login({
        email,
        password,
      });

    if (error) {
      return notification(message ?? error, { type: "warning" });
    }

    try {
      window.localStorage.setItem("@user", JSON.stringify(user));
      window.localStorage.setItem("@expire", JSON.stringify(expire));

      setUser(user);
      setExpiresAt(expire || null);
      setCheckingSession(false);
      setMenus(Object.assign([], menus));
      setIsAuthenticated(true);
      navigate("/app", { replace: true });

      return;
    } catch (error) {
      logout();
      return notification(
        "Erro ao salvar dados localmente. Faça o login novamente",
        { type: "warning" }
      );
    }
  };

  useEffect(() => {
    if (user) {
      try {
        window.localStorage.setItem("@user", JSON.stringify(user));
      } catch (error) {
        window.localStorage.setItem("@user", JSON.stringify(user));
      }
    }
  }, [user]);

  const retryLogout = async (plus: number) => {
    setTimeout(() => {
      logout(1000 + plus);
    }, 2000 + plus);
  };

  const logout = async (plus: number = 0) => {
    try {
      const { logout, error } = await authAPI.logout();

      window.localStorage.removeItem("@user");
      window.localStorage.removeItem("@expire");

      if (!logout || error) {
        retryLogout(plus + 1000);
        return;
      }

      setExpiresAt(null);
      setIsAuthenticated(false);
      navigate("/", { replace: true });

      return;
    } catch (error) {
      return { error: "Erro ao fazer logout" };
    }
  };

  useEffect(() => {
    try {
      if (location.search.includes("verified")) {
        logout();
        setCheckingSession(false);
      } else if (
        location.search.includes("recovery_token") &&
        location.search.includes("recoveryStep")
      ) {
        setCheckingSession(false);
        navigate("/" + location.search, { replace: true });
      } else {
        handleAuthentication();
      }
    } catch (error) {
      setIsAuthenticated(false);
      setCheckingSession(false);
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={
        {
          checkingSession,
          expiresAt,
          isAuthenticated,
          setExpiresAt,
          setIsAuthenticated,
          setCheckingSession,
          login,
          logout,
          likes,
          setLikes,
          user,
          setUser,
          notification,
          menus,
          setMenus,
        } as AuthContextInterface
      }
    >
      <ToastContainer />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
