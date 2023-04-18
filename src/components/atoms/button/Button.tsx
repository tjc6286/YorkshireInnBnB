import type React from "react";

interface ButtonProps {
  onClick: (e: any) => void;
  label: string;
  disabled?: boolean;
}

/**
 * The Button component is used to render a button that can be used to perform an action
 * @param onClick The function to be called when the button is clicked
 * @param label The text to be displayed on the button
 * @param disabled Whether the button should be disabled or not. True if the button should be disabled. False if the button should be enabled.
 * @returns The Button component
 */
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
      }}
    >
      {label}
    </button>
  );
};

export default Button;
