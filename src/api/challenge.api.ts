import { API_URL } from "../utils/api";
import { OrderEnum } from "../utils/enums/order.enum";
import { Challenge, ChallengeStatus } from "../utils/interfaces/models";
import { ObjectToQueryString } from "../utils/objectToQueryString";

interface GetAllQuery {
  type?: ChallengeStatus;
  order?: OrderEnum;
}

export const challengeAPI = {
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
