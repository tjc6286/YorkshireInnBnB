import { ObjectId } from "mongodb";
import isDateInArray from "../helpers/isDateInArray";
import type { RoomAvailability } from "../types/room";
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
 * @returns
 */
export const getRoomById = async (roomId: string) => {
  const room = await (await RoomsCollection())
    .find({ _id: new ObjectId(roomId) })
    .toArray();
  return room;
};

/**
 *
 * @param dateArray
 * @returns
 */
export const getRoomsAvailabilityByDateRange = async (
  dateArray: Array<string>,
) => {
  let formattedDates: Array<Date> = [];
  dateArray.forEach((date) => {
    formattedDates.push(new Date(date));
  });

  const rooms = await (await RoomsCollection()).find({}).toArray();

  rooms.forEach((room: RoomAvailability) => {
    let dateFound = false;
    formattedDates.forEach((date: Date) => {
      if (
        isDateInArray(room.temporaryHoldDates, date) ||
        isDateInArray(room.unavailableDates, date)
      ) {
        dateFound = true;
      }
    });

    if (dateFound) {
      room.isAvailable = false;
      return;
    } else {
      room.isAvailable = true;
    }
  });

  return rooms;
};

/**
 *
 * @param roomId Id for the room to be updated with temporary hold dates
 * @param dateArray
 * @returns
 */
export const addHoldDates = async (
  roomId: string | Array<string>,
  dateArray: Array<string>,
) => {
  const roomsCollection = await RoomsCollection();

  try {
    if (roomId instanceof Array) {
      //write an updateMany query to update all the rooms
      const objs = roomId.map((id) => new ObjectId(id));
      console.log(objs, "about to update");
      await roomsCollection.updateMany(
        { _id: { $in: objs } },
        {
          $push: { temporaryHoldDates: { $each: dateArray } },
        },
      );
    } else {
      await roomsCollection.updateOne(
        { _id: roomId[0] },
        {
          $push: { temporaryHoldDates: { $each: dateArray } },
        },
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  } finally {
  }

  return true;
};
