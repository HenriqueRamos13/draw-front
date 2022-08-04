import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI, Menu } from "../../api/auth.api";
import { ToastContainer, toast, ToastOptions } from "react-toastify";
import { User } from "../interfaces/models";
import { userAPI } from "../../api/user.api";
import { votesAPI } from "../../api/votes.api";

export interface AuthContextInterface {
  checkingSession: boolean | null;
  expiresAt: number | null;
  isAuthenticated: boolean | null;
  user: User | null;
  likes: string[];
  setLikes: (value: string[]) => void;
  setUser: (value: any) => void;
  setCheckingSession: (value: boolean) => void;
  setExpiresAt: (value: number) => void;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => void;
  register: (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => void;
  logout: () => void;
  notification: (content: string, options: ToastOptions) => React.ReactText;
}

export const authContextDefaults: AuthContextInterface = {
  checkingSession: true,
  expiresAt: null,
  isAuthenticated: false,
  user: null,
  likes: [],
  setLikes: () => {},
  setUser: () => {},
  setCheckingSession: () => {},
  setExpiresAt: () => {},
  setIsAuthenticated: () => {},
  login: () => {},
  register: () => {},
  logout: () => {},
  notification: () => "",
};

export const AuthContext =
  createContext<AuthContextInterface>(authContextDefaults);

export const AuthProvider: React.FC = ({ children }) => {
  const [checkingSession, setCheckingSession] = useState<boolean | null>(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);
  const [user, setUser] = useState<User | null>(null);
  const [likes, setLikes] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  const notification = (
    content: string,
    options: ToastOptions
  ): React.ReactText => toast(content, options);

  const getVotes = async () => {
    const { data, error, message } = await votesAPI.allVotes();

    if (error && message) {
      return notification(message, { type: "error" });
    }

    setLikes(Object.assign([], data));

    return;
  };

  const handleAuthentication = async (): Promise<void> => {
    const { expired, user, expiresIn, error, message } =
      await authAPI.verifyJwt();

    try {
      if (user && !expired) {
        window.localStorage.setItem("@user", JSON.stringify(user));
        window.localStorage.setItem("@expire", expiresIn.toString());

        setUser(user);
        setExpiresAt(expiresIn);
        setCheckingSession(false);
        setIsAuthenticated(true);
        getVotes();
        // navigate("/app", { replace: true });
        return;
      }

      if (error || expired) {
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
        getVotes();
        // navigate("/app", { replace: true });
      }
    } catch (error) {
      setCheckingSession(false);
      setIsAuthenticated(false);
      navigate("/", { replace: true });
      return;
    }

    // setCheckingSession(false);
    // setIsAuthenticated(true);

    // navigate("/app", { replace: true });
  };

  const login = async (email: string, password: string) => {
    if (email.trim() === "" || password.trim() === "") {
      return notification("Fill in all fields.", { type: "warning" });
    }

    setCheckingSession(true);

    const { user, expire, error, message, statusCode } = await authAPI.login({
      email,
      password,
    });

    if (error) {
      setCheckingSession(false);
      return notification(message ?? error, { type: "warning" });
    }

    try {
      window.localStorage.setItem("@user", JSON.stringify(user));
      window.localStorage.setItem("@expire", JSON.stringify(expire));

      setUser(user);
      setExpiresAt(expire || null);
      setCheckingSession(false);
      setIsAuthenticated(true);
      getVotes();
      // navigate("/", { replace: true });

      return;
    } catch (error) {
      setCheckingSession(false);
      logout();
      return notification("Fail to login. Try again.", { type: "warning" });
    }
  };

  const register = async (
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      username.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      return notification("Fill in all fields.", { type: "warning" });
    }

    if (password !== confirmPassword) {
      return notification("The passwords dont match.", { type: "warning" });
    }

    if (password.length < 8 || password.length > 80) {
      return notification("Password must be between 8 and 80 characters.", {
        type: "warning",
      });
    }

    if (email.length > 170) {
      return notification("Email must be less than 170 characters.", {
        type: "warning",
      });
    }

    if (username.length < 4 || username.length > 16) {
      return notification("Username must be between 4 and 16 characters.", {
        type: "warning",
      });
    }

    setCheckingSession(true);

    const { user, expire, error, message } = await authAPI.register({
      email,
      password,
      username,
    });

    if (error) {
      setCheckingSession(false);
      return notification(message ?? error, { type: "error" });
    }

    try {
      window.localStorage.setItem("@user", JSON.stringify(user));
      window.localStorage.setItem("@expire", JSON.stringify(expire));

      setUser(user);
      setExpiresAt(expire || null);
      setCheckingSession(false);
      setIsAuthenticated(true);
      setLikes([]);
      // navigate("/app", { replace: true });

      return notification("Account created!", { type: "success" });
    } catch (error) {
      setCheckingSession(false);
      logout();
      return notification(
        "Error while registering. Try again later or contact the administrator.",
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
      setLikes(Object.assign([], []));
      navigate("/", { replace: true });

      return;
    } catch (error) {
      return { error: "Log out error" };
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
          register,
          setLikes,
          user,
          setUser,
          notification,
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
