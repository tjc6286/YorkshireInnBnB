import type { AnyBulkWriteOperation } from "mongodb";
import type React from "react";

interface ButtonProps {
  onClick: (e: any) => void;
  label: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={(e) => onClick(e)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      style={{
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        backgroundColor: disabled ? "gray" : undefined,
      }}>
      {label}
    </button>
  );
};

export default Button;
