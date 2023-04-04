import { getAllRooms } from "../../../lib/rooms";
import { logMessage } from "../../../lib/logger";
/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/room/getAll", "Getting All Rooms");

  const rooms = await getAllRooms();
  if (!rooms) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  //TODO: CLEAN RESPONSE
  return new Response(JSON.stringify(rooms), {
    status: 200,
  });
};
