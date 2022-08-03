import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { challengeAPI } from "../../../api/challenge.api";
import Card from "../../../components/Card";
import Cover from "../../../components/Cover";
import Image from "../../../components/Image";
import Select from "../../../components/Select";
import { OrderEnum } from "../../../utils/enums/order.enum";

const Dashboard = () => {
  const [order, setOrder] = useState<OrderEnum>(OrderEnum.Votes_Desc);
  const navigate = useNavigate();
  const {
    data: dailyChallenge,
    error: dailyChallengeError,
    isLoading: dailyChallengeLoading,
  } = useQuery("dailyChallenge", challengeAPI.challengeOfTheDay, {
    refetchOnWindowFocus: true,
    cacheTime: 1000 * 30,
    staleTime: 1000 * 30,
  });
  const {
    data: challenges,
    error: challengesError,
    isLoading: challengesLoading,
  } = useQuery(["challenges", order], () => challengeAPI.getAll({ order }), {
    refetchOnWindowFocus: true,
    cacheTime: 1000 * 60 * 1,
    staleTime: 1000 * 60 * 1,
  });

  return (
    <>
      <Cover>
        <div className="items-center w-full flex flex-col">
          <div className="w-full flex flex-col items-center">
            <article className="prose flex flex-col items-center mb-4">
              <h1 className="mb-0 ">Challenge of the day</h1>
            </article>
            {!dailyChallengeError && (
              <>
                <article className="prose flex flex-col items-center mb-4">
                  {!dailyChallengeLoading ? (
                    <h2>{dailyChallenge?.title}</h2>
                  ) : (
                    <progress className="progress progress-primary w-44 mb-12"></progress>
                  )}
                  {!dailyChallengeLoading ? (
                    <p className="text-center">{dailyChallenge?.description}</p>
                  ) : (
                    <progress className="progress progress-primary w-96 mb-12"></progress>
                  )}
                  {dailyChallenge && <b>Top 3 images</b>}
                </article>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 justify-items-center">
                  {dailyChallenge &&
                    dailyChallenge?.images?.map((img) => (
                      <Image key={img.id} {...img} />
                    ))}
                </div>
              </>
            )}
            {!dailyChallengeLoading && dailyChallenge ? (
              <button
                className="btn btn-outline mt-8"
                onClick={() =>
                  dailyChallenge
                    ? navigate(`challenge/${dailyChallenge.id}`)
                    : {}
                }
              >
                Access Challenge
              </button>
            ) : (
              <progress className="progress progress-primary w-48"></progress>
            )}
          </div>
        </div>
      </Cover>
      <Cover margin>
        <div className="items-center w-full flex flex-col">
          <div className="w-full flex flex-col items-center">
            <article className="prose flex flex-col items-center mb-16">
              <h1 className="mb-0">All Challenges</h1>
            </article>
            <div className="flex flex-row items-center w-full justify-center mb-24">
              <p className="prose mr-3">Sort by: </p>
              <Select
                onChange={(e: any) => setOrder(e.target.value)}
                value={order}
                className="select-sm text-xs"
              >
                <option defaultChecked value={OrderEnum.Created}>
                  First Created
                </option>
                <option value={OrderEnum.Created_Desc}>Last Created</option>
                <option value={OrderEnum.Votes}>Less Votes</option>
                <option value={OrderEnum.Votes_Desc}>More Votes</option>
              </Select>
            </div>
            {challenges && !challengesLoading && !challengesError
              ? challenges.map((challenge) => (
                  <Card key={challenge.id} {...challenge} />
                ))
              : [1, 2, 3, 4].map((_, i) => <Card key={i} loading />)}
          </div>
        </div>
      </Cover>
    </>
  );
};

export default Dashboard;
