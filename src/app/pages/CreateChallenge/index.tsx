import React, { useState } from "react";
import { challengeAPI } from "../../../api/challenge.api";
import Cover from "../../../components/Cover";
import { useAuth } from "../../../utils/context/auth";

const CreateChallenge = () => {
  const { isAuthenticated, notification } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState("");
  const [loading, setLoading] = useState(false);

  const createChallenge = async () => {
    if (!isAuthenticated) {
      return notification("You must be logged in to create a challenge", {
        type: "warning",
      });
    }

    if (!title || !description || !hours) {
      return notification("All fields are required", { type: "warning" });
    }

    const body = {
      title,
      description,
      hours: Number(hours),
    };

    setLoading(true);

    const created = await challengeAPI.create(body);

    setLoading(false);
    if (!created) {
      return notification("Something went wrong. Try again.", {
        type: "warning",
      });
    }

    setTitle("");
    setDescription("");
    setHours("");
    return notification("Challenge created successfully", { type: "success" });
  };

  return (
    <>
      <Cover>
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left md:ml-16">
            <h1 className="text-5xl font-bold">Create a challenge now!</h1>
            <p className="py-6">
              Here you can create a challenge for you to participate with other
              people. If you want to see how people would draw something, or
              just give ideas to other artists, create a challenge and see the
              submitted drawings!
            </p>
          </div>
          <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="title"
                  className="input input-bordered"
                  maxLength={255}
                  minLength={1}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Description..."
                  maxLength={5000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Challenge duration</span>
                </label>
                <input
                  type="number"
                  placeholder="value in hours (e.g: 4 = 4h)"
                  className="input input-bordered"
                  min={1}
                  max={72}
                  value={hours}
                  onChange={(e) =>
                    setHours(
                      Number(e.target.value) > 72
                        ? "72"
                        : Number(e.target.value) < 1
                        ? "1"
                        : e.target.value
                    )
                  }
                />
              </div>
              <div className="form-control mt-6">
                <button
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={createChallenge}
                >
                  {loading ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Cover>
    </>
  );
};

export default CreateChallenge;
