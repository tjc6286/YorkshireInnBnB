import { getBlueRoom } from "../../../lib/rooms";
import { logMessage } from "../../../lib/logger";

/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/room/blue", "Getting Blue Room");

  const room = await getBlueRoom();
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
