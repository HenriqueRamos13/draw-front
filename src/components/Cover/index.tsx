import React from "react";
import { classNames } from "../../utils/functions/ClassNames";

type Props = {
  children: React.ReactNode;
  margin?: boolean;
};

const Cover: React.FC<Props> = ({ children, margin }) => {
  return (
    <div
      className={classNames(
        "bg-white dark:bg-gray-900 rounded-lg shadow px-5 py-6 sm:px-6 pb-12",
        margin ? "mt-24" : ""
      )}
    >
      {children}
    </div>
  );
};

export default Cover;
