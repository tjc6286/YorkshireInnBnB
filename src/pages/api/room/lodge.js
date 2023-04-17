import { getLodgeRoom } from "../../../lib/rooms";
import { logMessage } from "../../../lib/logger";

/**
 * Endpoint to get the lodge room information
 * @returns {Response} Returns the lodge room information wrapped in a Response object
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/room/lodge", "Getting Lodge Room");

  const room = await getLodgeRoom();
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
