import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Challenge, User } from "../../utils/interfaces/models";
import ImageComponent from "../Image";

const CardRanking: React.FC<User> = ({ username, points, images, id }) => {
  const navigate = useNavigate();

  return (
    <div className="card w-96 bg-base-100 shadow-xl mb-12">
      <div className="card-body flex flex-col justify-evenly items-center">
        <h2
          className="card-title mb-4 cursor-pointer"
          onClick={() => navigate(`/user/${username}`)}
        >
          {username}
        </h2>
        <b className="mb-8">Total points: {points}</b>

        <div className="w-full prose">
          <h2>Best Image</h2>
          {images && images.length > 0 && (
            <ImageComponent
              {...{ ...images[0], user: { username, id } as User }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardRanking;
