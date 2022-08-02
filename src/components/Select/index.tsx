import React from "react";
import { classNames } from "../../utils/functions/ClassNames";

type Props = {
  children: React.ReactNode;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const Select: React.FC<Props> = ({ children, className, onChange, value }) => {
  return (
    <select
      {...(value && { value })}
      onChange={onChange}
      className={classNames(
        "select select-bordered w-full max-w-xs",
        className ?? ""
      )}
    >
      {children}
    </select>
  );
};

export default Select;
