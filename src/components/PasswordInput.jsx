import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  value,
  onChange,
  placeholder,
  name = "password",
  autocomplete = "off",
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="new-password" 
        className="w-full p-3 pr-10 border border-gray-300 rounded"
      />

      <span
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
        onClick={() => setShow((prev) => !prev)}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </span>
    </div>
  );
};

export default PasswordInput;
