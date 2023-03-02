import { RoomsCollection } from "./mongodb";

/**
 *
 * @returns
 */
export const getAllRooms = async () => {
  const rooms = await (await RoomsCollection()).find({}).toArray();
  return rooms;
};

/**
 *
 * @returns
 */
export const getBoleroRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "Bolero" })
    .toArray();
  return rooms;
};

/**
 *
 * @returns
 */
export const getRoseRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "The Rose Suite" })
    .toArray();
  return rooms;
};

/**
 *
 * @returns
 */
export const getLodgeRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "Lodge Suite" })
    .toArray();
  return rooms;
};

/**
 *
 * @returns
 */
export const getBlueRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "Blue Room" })
    .toArray();
  return rooms;
};

/**
 *
 */
export const getRoomsAvailabilityByDateRange = async (dateArray) => {
  const rooms = await (
    await RoomsCollection()
  )
    .find(
      {},
      {
        unavailableDates: 1,
        temporaryHoldDates: 1,
      }
    )
    .toArray();

  //Iterating through all rooms to look at unavailable dates
  const availableRooms = rooms.filter((room) => {
    // Iterating through all passed in dates and comparing to to unavailable Dates,
    // if it matches found will equal true.
    const matchUnavailableDates = dateArray.some((date) => {
      return room.unavailableDates.find(
        (uDate) => uDate.getTime() === new Date(date).getTime()
      );
    });

    const matchTemporaryHoldDates = dateArray.some((date) => {
      return room.temporaryHoldDates.find(
        (uDate) => uDate.getTime() === new Date(date).getTime()
      );
    });

    // if room unavailable or temporary hold dates not inside the dateArray the room is valid
    return !matchUnavailableDates && !matchTemporaryHoldDates;
  });

  return availableRooms;
};
