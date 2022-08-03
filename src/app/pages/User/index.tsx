import React, { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { userAPI } from "../../../api/user.api";
import Cover from "../../../components/Cover";
import ImageComponent from "../../../components/Image";
import Select from "../../../components/Select";
import { useAuth } from "../../../utils/context/auth";
import { OrderEnum } from "../../../utils/enums/order.enum";

const UserPage = () => {
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderEnum>(OrderEnum.Votes_Desc);
  const { name } = useParams();
  const {
    data,
    error: userError,
    isLoading: userLoading,
  } = useQuery(
    [`user-${name}`, name, order],
    () => userAPI.getOne(name!, { order: order }),
    {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 5,
    }
  );

  return (
    <Cover>
      <div className="flex flex-col items-center w-full mb-0 min-h-[400px]">
        <article className="prose mb-10">
          <h1>{data && data?.id ? data.username : "User not found"}</h1>
        </article>
        <article className="prose mb-10">
          <b>{data && data?.id ? `Total points: ${data.points}` : ""}</b>
        </article>
        <article className="prose mb-10">
          <h2>Images</h2>
        </article>
        {data && !userError && (
          <div className="flex flex-row items-center w-full justify-center">
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
        )}
      </div>
      <div className="masonry md:masonry-md lg:masonry-lg justify-around">
        {data &&
          data?.images?.map((img) => (
            <ImageComponent key={img.id} {...{ ...img, user: data }} />
          ))}
      </div>
    </Cover>
  );
};

export default UserPage;
