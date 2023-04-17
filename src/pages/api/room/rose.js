import { getRoseRoom } from "../../../lib/rooms";
import { logMessage } from "../../../lib/logger";

/**
 * Endpoint to get the rose room information
 * @returns {Response} Returns the rose room information wrapped in a Response object
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/room/rose", "Getting Rose Room");

  const room = await getRoseRoom();
  if (!room) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  //TODO: CLEAN RESPONSE
  return new Response(JSON.stringify(room), {
    status: 200,
  });
};
