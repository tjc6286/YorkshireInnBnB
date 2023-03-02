import isDateInArray from "../helpers/isDateInArray";
import type { RoomUnavailableDates } from "../types/room";
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

function isInArray(array, value) {
  return !!array.find((item) => {
    return item.getTime() == value.getTime();
  });
}

/**
 *
 */
export const getRoomsAvailabilityByDateRange = async (
  dateArray: Array<string>,
) => {
  let formattedDates: Array<Date> = [];
  dateArray.forEach((date) => {
    formattedDates.push(new Date(date));
  });

  const rooms = await (await RoomsCollection())
    .find({})
    .project({ unavailableDates: 1, temporaryHoldDates: 1, name: 1 })
    .toArray();

  let availableRooms: Array<string> = [];

  rooms.forEach((room: RoomUnavailableDates) => {
    let dateFound = false;
    formattedDates.forEach((date: Date) => {
      if (
        isDateInArray(room.temporaryHoldDates, date) ||
        isDateInArray(room.unavailableDates, date)
      ) {
        console.log(`Found date for ${room.name}`);
        dateFound = true;
      }
    });

    if (dateFound) {
      return;
    } else {
      availableRooms.push(room.name);
    }
  });

  return availableRooms;
};
