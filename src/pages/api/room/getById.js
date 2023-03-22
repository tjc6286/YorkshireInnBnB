import { getRoomById } from "../../../lib/rooms";

/**
 *
 * @returns
 */
export const get = async (id) => {
  const room = await getRoomById(id);
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
