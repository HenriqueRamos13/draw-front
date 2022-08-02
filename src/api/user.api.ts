import { API_URL } from "../utils/api";
import { ErrorInterface } from "../utils/interfaces/error.interface";
import { User } from "../utils/interfaces/models";

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

export const userAPI = {
  forgotPass: async (
    data: ForgotPassDto
  ): Promise<MessageResponceInterface> => {
    return await fetch(`${API_URL}/user/forgot-pass`, {
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
    return await fetch(`${API_URL}/user/recovery-pass`, {
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
    return await fetch(`${API_URL}/user/resend-verification`, {
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
};
