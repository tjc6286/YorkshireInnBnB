import { getBlueRoom } from "../../../lib/rooms";

/**
 *
 * @returns
 */
export const get = async () => {
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
