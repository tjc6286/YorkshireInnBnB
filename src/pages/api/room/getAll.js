import { getAllRooms } from "../../../lib/rooms";

/**
 *
 * @returns
 */
export const get = async () => {
  console.log("Log - GET ALL ROOMS");
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
