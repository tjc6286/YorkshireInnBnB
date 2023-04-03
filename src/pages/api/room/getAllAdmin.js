import { getAllRooms } from "../../../lib/rooms";

/**
 *
 * @returns
 */
export const get = async () => {
  const rooms = await getAllRooms();
  // Create a map of blocked rooms
  const blockedMap = [];

  // Create a map of blocked rooms
  const priceMap = [];
  rooms.forEach((room) => {
    room.unavailableDates.forEach((date) => {
      blockedMap.push({
        key: room.name + date,
        room: room.name,
        date: date,
      });
    });

    room.specialPriceDates.forEach((specialPriceDates) => {
      priceMap.push({
        key: room.name + specialPriceDates.date,
        room: room.name,
        date: specialPriceDates.date,
        price: specialPriceDates.price,
      });
    });
  });

  if (!rooms) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

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
