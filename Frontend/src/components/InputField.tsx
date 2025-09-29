import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  register?: any;
}

export default function InputField({ label, name, register, ...rest }: Props) {
  return (
    <div className="relative w-full">
      <label
        htmlFor={name}
        className="absolute -top-2 left-3 bg-white px-1 text-sm focus:bg-blue-500 focus:text-blue-500 text-gray-500"
      >
        {label}
      </label>
      <input
        id={name}
        {...(register ? register(name) : {})}
        {...rest}
        className="w-full border border-gray-300 rounded px-3 py-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
