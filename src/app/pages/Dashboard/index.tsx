import React, { useState } from "react";
import { useQuery } from "react-query";
import { challengeAPI } from "../../../api/challenge.api";
import Card from "../../../components/Card";
import Cover from "../../../components/Cover";
import Image from "../../../components/Image";
import Select from "../../../components/Select";
import { OrderEnum } from "../../../utils/enums/order.enum";

const Dashboard = () => {
  const [order, setOrder] = useState<OrderEnum>(OrderEnum.Votes_Desc);
  const { data: dailyChallenge, error: dailyChallengeError } = useQuery(
    "dailyChallenge",
    challengeAPI.challengeOfTheDay,
    {
      refetchOnWindowFocus: true,
      cacheTime: 1000 * 30,
      staleTime: 1000 * 30,
    }
  );
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
                  {dailyChallenge && <h2>{dailyChallenge.title}</h2>}
                  {dailyChallenge && (
                    <p className="text-center">{dailyChallenge.description}</p>
                  )}
                  <b>Top 3 images</b>
                </article>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 justify-items-center">
                  {dailyChallenge &&
                    dailyChallenge?.images?.map((img) => (
                      <Image
                        {...img}
                        url={
                          "https://i.pinimg.com/736x/dc/72/1d/dc721d7fa5c22bb8551afdf9cc280401.jpg"
                        }
                      />
                    ))}
                </div>
              </>
            )}
            <button className="btn btn-outline mt-8">Access Challenge</button>
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
              ? challenges.map((challenge) => <Card {...challenge} />)
              : [1, 2, 3, 4].map(() => <Card loading />)}
          </div>
        </div>
      </Cover>
    </>
  );
};

export default Dashboard;
