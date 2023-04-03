import { format } from "date-fns";

/**
 * Method to log a message to the console in red.
 */
export const logRed = (text: string): void => {
  console.log("\x1b[31m%s\x1b[0m", text);
};

/**
 * Method to log a message to the console in Blue.
 */
export const logBlue = (text: string): void => {
  console.log("\x1b[34m%s\x1b[0m", text);
};

/**
 * Method to log a message to the console in yellow.
 */
export const logYellow = (text: string): void => {
  console.log("\x1b[33m%s\x1b[0m", text);
};

/**
 * Method to log a message with entrypoint and time to the console.
 * The entrypoint is in bold in the output to make it more readable.
 */
export const logMessage = (entryPoint: string, message: string): void => {
  console.log(
    `[\x1b[1m${entryPoint}\x1b[0m] ${format(
      new Date(),
      "h:mm:ss a"
    )} - ${message}`
  );
};
