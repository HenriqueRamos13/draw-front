import { API_URL } from "../utils/api";
import { OrderEnum } from "../utils/enums/order.enum";
import { ErrorInterface } from "../utils/interfaces/error.interface";
import { User } from "../utils/interfaces/models";
import { ObjectToQueryString } from "../utils/objectToQueryString";

interface ForgotPassDto {
  email: string;
}

interface RecoveryPassDto {
  password: string;
  recovery_token: string;
}

interface MessageResponceInterface extends ErrorInterface {
  message: string;
}

interface GetOneQuery {
  order?: OrderEnum;
}

export const userAPI = {
  getOne: async (name: string, query: GetOneQuery): Promise<User> => {
    return await fetch(
      `${API_URL}/users/name/${name}?${
        query.order ? ObjectToQueryString(query) : ""
      }`,
      {
        method: "GET",
      }
    )
      .then(async (res) => {
        const data = await res.json();
        if (data.error) {
          return { error: data.error, message: data.message };
        }
        return data.data;
      })
      .catch(() => ({
        error: "Error",
        message: "Error, please try again.",
      }));
  },

  forgotPass: async (
    data: ForgotPassDto
  ): Promise<MessageResponceInterface> => {
    return await fetch(`${API_URL}/users/forgot-pass`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.error) {
          return data;
        }
        return { message: data.message };
      })
      .catch(() => ({
        error: "Error",
        message: "Error, please try again.",
      }));
  },

  recoveryPass: async (
    data: RecoveryPassDto
  ): Promise<MessageResponceInterface> => {
    return await fetch(`${API_URL}/users/recovery-pass`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.error) {
          return data;
        }
        return { message: data.message };
      })
      .catch(() => ({
        error: "Error",
        message: "Error, please try again.",
      }));
  },

  resendRecovery: async (): Promise<MessageResponceInterface> => {
    return await fetch(`${API_URL}/users/resend-verification`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.error) {
          return data;
        }
        return { message: data.message };
      })
      .catch(() => ({
        error: "Error",
        message: "Error, please try again.",
      }));
  },

  topRanking: async (): Promise<User[]> => {
    return await fetch(`${API_URL}/users/ranking/top`, {
      method: "GET",
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.error) {
          return { error: data.error, message: data.message };
        }
        return data.data;
      })
      .catch(() => ({
        error: "Error",
        message: "Error, please try again.",
      }));
  },
};
