import { API_URL } from "../utils/api";
import { OrderEnum } from "../utils/enums/order.enum";
import { Challenge, ChallengeStatus } from "../utils/interfaces/models";
import { ObjectToQueryString } from "../utils/objectToQueryString";

interface GetAllQuery {
  type?: ChallengeStatus;
  order?: OrderEnum;
}

interface GetOneQuery {
  order?: OrderEnum;
}

interface CreateChallengeInterface {
  title: string;
  description: string;
  adult?: true;
  hours: number;
}

export const challengeAPI = {
  create: async (challenge: CreateChallengeInterface): Promise<boolean> => {
    return await fetch(`${API_URL}/challenges`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ...challenge,
        adult: false,
      }),
    }).then((res) => {
      if (res.status >= 200 || res.status < 300) {
        return true;
      } else {
        return false;
      }
    });
  },

  getAll: async (query: GetAllQuery): Promise<Challenge[]> => {
    return await fetch(
      `${API_URL}/challenges?${
        query.order || query.type ? ObjectToQueryString(query) : ""
      }`,
      {
        method: "GET",
      }
    )
      .then(async (res) => {
        return res.json().then(async (data) => {
          if (data.error) {
            throw new Error(data.message || data.error || "Error");
          } else {
            return data.data || [];
          }
        });
      })
      .catch((err) => {
        throw new Error(err.message || "Error");
      });
  },

  getOne: async (id: string, query: GetOneQuery): Promise<Challenge> => {
    return await fetch(
      `${API_URL}/challenges/${id}?${
        query.order ? ObjectToQueryString(query) : ""
      }`,
      {
        method: "GET",
      }
    )
      .then(async (res) => {
        return res.json().then(async (data) => {
          if (data.error) {
            throw new Error(data.message || data.error || "Error");
          } else {
            return data.data;
          }
        });
      })
      .catch((err) => {
        throw new Error(err.message || "Error");
      });
  },

  uploadImage: async (id: string, file: File): Promise<boolean> => {
    const formData = new FormData();
    formData.append("image", file);

    return await fetch(`${API_URL}/challenges/${id}/image`, {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => {
      if (res.status >= 200 || res.status < 300) {
        return true;
      } else {
        return false;
      }
    });
  },

  challengeOfTheDay: async (): Promise<Challenge> => {
    return await fetch(`${API_URL}/challenges/daily/top`, {
      method: "GET",
    })
      .then(async (res) => {
        return res.json().then(async (data) => {
          if (data.error) {
            throw new Error(data.message || data.error || "Error");
          } else {
            return data.data || null;
          }
        });
      })
      .catch((err) => {
        throw new Error(err.message || "Error");
      });
  },
};
