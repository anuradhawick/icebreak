import type { FunctionComponent } from "react";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: FunctionComponent<ButtonProps> = ({
  label,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded shadow-lg transition duration-300 
                 focus:outline-none focus:ring-2 focus:ring-cyan-300 
                 hover:shadow-cyan-400/60 hover:shadow-[0_0_16px_4px_rgba(34,211,238,0.6)]
                 bg-cyan-400 text-cyan-900 font-semibold
                 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      {label}
    </button>
  );
};

export default Button;
