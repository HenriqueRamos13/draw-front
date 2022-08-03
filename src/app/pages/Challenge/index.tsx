import React, { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { challengeAPI } from "../../../api/challenge.api";
import Card from "../../../components/Card";
import Cover from "../../../components/Cover";
import Image from "../../../components/Image";
import Select from "../../../components/Select";
import { useAuth } from "../../../utils/context/auth";
import { OrderEnum } from "../../../utils/enums/order.enum";

const Challenge = () => {
  const { notification, isAuthenticated, user } = useAuth();
  const [order, setOrder] = useState<OrderEnum>(OrderEnum.Votes_Desc);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    data: challenge,
    error: challengeError,
    isLoading: challengeLoading,
  } = useQuery(
    [`challenge-${id}`, id, order],
    () => challengeAPI.getOne(id!, { order }),
    {
      refetchOnWindowFocus: true,
      cacheTime: 1000 * 60 * 1,
      staleTime: 1000 * 60 * 1,
    }
  );

  const upload = async (e: any) => {
    if (!isAuthenticated) {
      notification("You must be logged in to upload images", {
        type: "warning",
      });
      return;
    }

    const file = e.target.files[0];

    if (file.size > 10000000) {
      notification("Image must be less than 10MB", { type: "warning" });
      return;
    }

    setLoading(true);

    const uploaded = await challengeAPI.uploadImage(id!, file);

    setLoading(false);
    if (!uploaded) {
      notification("Something went wrong", { type: "warning" });
      return;
    }

    notification("Uploaded successfully!", { type: "success" });

    setTimeout(() => {
      setOrder(OrderEnum.Created);
    }, 5000);
  };

  return (
    <>
      <Cover>
        <div className="items-center w-full flex flex-col">
          <div className="w-full flex flex-col items-center">
            <article className="prose flex flex-col items-center mb-4">
              {!challengeLoading ? (
                <h1 className="mb-0 ">{challenge?.title}</h1>
              ) : (
                <progress className="progress progress-primary w-44 mb-12"></progress>
              )}
              {!challengeLoading ? (
                <p className="text-center mb-0">
                  Description: {challenge?.description}
                </p>
              ) : (
                <progress className="progress progress-primary w-96 mb-12"></progress>
              )}
              {!challengeLoading ? (
                <p className="text-center mb-0">
                  Total votes: {challenge?.votes} votes
                </p>
              ) : (
                <progress className="progress progress-primary w-16 mb-12"></progress>
              )}
              {!challengeLoading ? (
                <p className="text-center mb-0">
                  Total images: {challenge?.images?.length} images
                </p>
              ) : (
                <progress className="progress progress-primary w-16 mb-12"></progress>
              )}
              {challenge &&
                isAuthenticated &&
                !challenge.images?.find((img) => img.user_id === user?.id) && (
                  <div className="prose w-full flex flex-col items-center">
                    <h3 className="my-4">Wanna participate? Send a image</h3>
                    {loading ? (
                      <div className="w-full flex flex-col items-center">
                        <h4>Uploading...</h4>
                        <progress className="progress progress-primary w-96 mb-12"></progress>
                      </div>
                    ) : (
                      <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm items-center text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer h-[20px] bg-none rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                disabled={!isAuthenticated}
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={(e) => upload(e)}
                                accept="image/png, image/jpeg, image/jpg, image/webp"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG, WEBP up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </article>
          </div>
        </div>
      </Cover>
      <Cover margin>
        <div className="flex flex-col items-center w-full mb-12">
          <article className="prose mb-10">
            <h1>Images</h1>
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
        </div>
        <div className="masonry md:masonry-md lg:masonry-lg justify-around">
          {challenge &&
            challenge?.images?.map((img) => <Image key={img.id} {...img} />)}
        </div>
      </Cover>
    </>
  );
};

export default Challenge;
