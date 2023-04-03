import { getAllRooms } from "../../../lib/rooms";

/**
 *
 * @returns
 */
export const get = async () => {
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
