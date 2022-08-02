import { API_URL } from "../utils/api";
import { ErrorInterface } from "../utils/interfaces/error.interface";
import { User } from "../utils/interfaces/models";

interface VoteInterface {
  id: string;
}

interface AllVotesResponseInterface extends ErrorInterface {
  data: string[];
}

export const votesAPI = {
  allVotes: async (): Promise<AllVotesResponseInterface> => {
    return await fetch(`${API_URL}/votes`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        return await res.json();
      })
      .catch(() => ({
        error: "Error",
        message: "Error, please try again.",
      }));
  },
};
