import { API_URL } from "../utils/api";
import { ErrorInterface } from "../utils/interfaces/error.interface";
import { User } from "../utils/interfaces/models";

export interface Menu {
  name: string;
  href: string;
  icon: string;
  current: boolean;
}

interface LoginInterface {
  email: string;
  password: string;
}

interface LoginResponseInterface extends ErrorInterface {
  user: User;
  expire: number;
  menus: Menu[];
}

interface VerifyJwtResponseInterface extends ErrorInterface {
  expire: number;
  menus: Menu[];
}

interface LogoutResponseInterface extends ErrorInterface {
  logout: boolean;
}

export const authAPI = {
  login: async (data: LoginInterface): Promise<LoginResponseInterface> => {
    return await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        return await res.json();
      })
      .catch(() => ({
        error: "Error",
        message: "Ocorreu um erro, por favor reinicie a página",
      }));
  },

  verifyJwt: async (): Promise<VerifyJwtResponseInterface> => {
    return await fetch(`${API_URL}/auth/jwt`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        return await res.json();
      })
      .catch(() => ({
        error: "Error",
        message: "Ocorreu um erro, por favor reinicie a página",
      }));
  },

  logout: async (): Promise<LogoutResponseInterface> => {
    return await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        return await res.json();
      })
      .catch(() => ({
        error: "Error",
        message: "Ocorreu um erro, por favor reinicie a página",
      }));
  },
};
