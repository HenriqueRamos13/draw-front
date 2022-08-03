import React, { useState } from "react";
import { useQuery } from "react-query";
import { userAPI } from "../../../api/user.api";
import CardRanking from "../../../components/CardRanking";
import Cover from "../../../components/Cover";

const Ranking = () => {
  const {
    data: usersTopRanking,
    error: usersTopRankingError,
    isLoading: usersTopRankingLoading,
  } = useQuery("top-ranking", userAPI.topRanking, {
    refetchOnWindowFocus: true,
    cacheTime: 1000 * 60 * 1,
    staleTime: 1000 * 60 * 1,
  });

  return (
    <>
      <Cover>
        <div className="w-full flex flex-col items-center">
          <article className="prose mb-16">
            <h1>Top 10 users</h1>
          </article>
          {!usersTopRankingError &&
            usersTopRanking &&
            usersTopRanking.length > 0 &&
            usersTopRanking.map((user) => <CardRanking {...user} />)}
        </div>
      </Cover>
    </>
  );
};

export default Ranking;
