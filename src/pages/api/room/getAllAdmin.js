import { getAllRooms } from "../../../lib/rooms";
import { logMessage } from "../../../lib/logger";

/**
 * Endpoint to get all rooms information with blocked dates and special price dates.
 *
 * @returns {Response} Returns all rooms information wrapped in a Response object
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/room/getAllAdmin", "Getting All Rooms");

  const rooms = await getAllRooms();

  const blockedMap = [];
  const priceMap = [];

  if (!rooms) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  rooms.forEach((room) => {
    room.unavailableDates.forEach((date) => {
      blockedMap.push({
        key: room.name + date,
        room: room.name,
        roomId: room._id,
        date: date,
      });
      //sort blockedMap by date
      blockedMap.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    });

    room.specialPriceDates.forEach((specialPriceDates) => {
      priceMap.push({
        key: room.name + specialPriceDates.date,
        room: room.name,
        roomId: room._id,
        date: specialPriceDates.date,
        price: specialPriceDates.price,
      });
      //sort priceMap by date
      priceMap.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
    });
  });

  //TODO: CLEAN RESPONSE
  return new Response(
    JSON.stringify({
      rooms: rooms,
      blockedMap: blockedMap,
      priceMap: priceMap,
    }),
    {
      status: 200,
    }
  );
};
