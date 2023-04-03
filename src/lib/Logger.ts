import { format } from "date-fns";

export const logRed = (text: string): void => {
  console.log("\x1b[31m%s\x1b[0m", text);
};

export const logBlue = (text: string): void => {
  console.log("\x1b[34m%s\x1b[0m", text);
};

export const logYellow = (text: string): void => {
  console.log("\x1b[33m%s\x1b[0m", text);
};

export const logMessage = (entryPoint: string, message: string): void => {
  console.log(
    `[\x1b[1m${entryPoint}\x1b[0m] ${format(new Date(), "h:mm a")} - ${message}`
  );
};
