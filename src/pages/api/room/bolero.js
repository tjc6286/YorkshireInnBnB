import { getBoleroRoom } from "../../../lib/rooms";
import { logMessage } from "../../../lib/logger";

/**
 * Endpoint to get the bolero room information
 * @returns {Response} Returns the bolero room information wrapped in a Response object
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/room/bolero", "Getting Bolero Room");

  const room = await getBoleroRoom();
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
