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
