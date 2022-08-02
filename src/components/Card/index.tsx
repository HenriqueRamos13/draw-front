import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Challenge } from "../../utils/interfaces/models";

interface Props extends Challenge {
  loading?: boolean;
}

const Card: React.FC<Props | any> = ({
  title,
  description,
  id,
  adult,
  ends_in,
  votes,
  loading,
}) => {
  const navigate = useNavigate();
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);

  useEffect(() => {
    if (ends_in) {
      const timeNow = new Date();
      const timeEnd = new Date(ends_in);

      const timeDiff = timeEnd.getTime() - timeNow.getTime();
      const timeLeft = timeDiff / 1000;
      const hoursLeft = timeLeft / 3600;
      const hours = Math.floor(hoursLeft);
      setHours(hours);

      const minutesLeft = (hoursLeft - hours) * 60;
      const minutes = Math.floor(minutesLeft);
      setMinutes(minutes);
    }
  }, [ends_in]);

  return (
    <div className="card md:w-2/3 w-full bg-base-100 shadow-xl m-4">
      <div className="card-body">
        {loading ? (
          <progress className="progress progress-primary w-56"></progress>
        ) : (
          <h2 className="card-title">{title}</h2>
        )}
        {loading ? (
          <progress className="progress progress-primary w-2/4"></progress>
        ) : (
          <p>
            {(() =>
              description && description.length > 150
                ? description?.substring(0, 150) + "..."
                : description)()}
          </p>
        )}
        {loading ? (
          <progress className="progress progress-primary w-3/4"></progress>
        ) : (
          <b>
            Time remaining: {hours} hours and {minutes} minutes
          </b>
        )}
        {loading ? (
          <progress className="progress progress-primary w-56"></progress>
        ) : (
          <b>Total votes: {votes}</b>
        )}

        <div className="card-actions justify-end">
          {loading ? (
            <progress className="progress progress-primary w-56"></progress>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/challenge/${id}`)}
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
