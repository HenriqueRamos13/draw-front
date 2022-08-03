import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutlined } from "@heroicons/react/outline";
import { useEffect } from "react";
import { API_URL } from "../../utils/api";
import { useAuth } from "../../utils/context/auth";
import { Image } from "../../utils/interfaces/models";

const ImageComponent: React.FC<Image> = ({
  url,
  id,
  votes,
  user,
  total_votes,
}) => {
  const { isAuthenticated, likes, setLikes } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const liked = likes.find((item) => item === id);
    setLiked(!!liked);
  }, [likes]);

  const like = (id: string) => {
    if (!isAuthenticated) {
      return;
    }
    setLiked(true);
    fetch(`${API_URL}/votes`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        vote: true,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setLiked(true);
        setLikes(Object.assign([...likes], [...likes, id]));
      });
  };

  return (
    <div className="card card-compact w-full h-fit  bg-base-100 shadow-xl break-inside mb-6">
      <figure>
        <img
          src={url}
          alt="art"
          className="w-full h-full object-fill rounded-lg max-h-[500px]"
        />
      </figure>
      <div className="card-body">
        <div className=" w-full rounded-lg h-[50px] flex flex-row justify-between p-5 items-center prose">
          <b
            className="link"
            onClick={() => navigate(`/user/${user?.username}`)}
          >
            {user?.username}
          </b>
          <button
            onClick={() => (isAuthenticated ? like(id) : {})}
            className="flex flex-row"
          >
            <b className="mr-2">
              {liked ? total_votes + 1 : total_votes} Votes
            </b>
            {liked ? (
              <HeartIcon color="#F00" width={26} height={26} />
            ) : (
              <HeartIconOutlined color="#F00" width={26} height={26} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageComponent;
