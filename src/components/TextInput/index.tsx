import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
};

const TextInput: React.FC<Props> = (props) => {
  return (
    <input
      type={props.type || "text"}
      placeholder={props.placeholder || ""}
      className="input input-bordered w-full max-w-xs"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  );
};

export default TextInput;
