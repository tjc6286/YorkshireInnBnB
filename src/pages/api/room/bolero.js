import { getBoleroRoom } from "../../../lib/rooms";

/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  console.log("Endpoint: /api/room/bolero - " + new Date().toISOString());

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
