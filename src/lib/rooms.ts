import { ObjectId } from "mongodb";
import isDateInArray from "../helpers/isDateInArray";
import type { RoomAvailability } from "../types/room";
import { RoomsCollection } from "./mongodb";

/**
 * Method to get all rooms from the Rooms collection
 * @returns Array of room objects
 */
export const getAllRooms = async () => {
  const rooms = await (await RoomsCollection()).find({}).toArray();
  return rooms;
};

/**
 * Method to get the Bolero room from the Rooms collection
 *
 * @returns Array containing the Bolero room object
 */
export const getBoleroRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "Bolero" })
    .toArray();
  return rooms;
};

/**
 * Method to get The Rose Suit room from the Rooms collection
 *
 * @returns Array containing The Rose Suit room object
 */
export const getRoseRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "The Rose Suite" })
    .toArray();
  return rooms;
};

/**
 * Method to get The Lodge Suit room from the Rooms collection
 *
 * @returns Array containing The Lodge Suit room object
 */
export const getLodgeRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "Lodge Suite" })
    .toArray();
  return rooms;
};

/**
 * Method to get The Blue room from the Rooms collection
 *
 * @returns Array containing The Blue room object
 */
export const getBlueRoom = async () => {
  const rooms = await (await RoomsCollection())
    .find({ name: "Blue Room" })
    .toArray();
  return rooms;
};

/**
 * Method to get a room by its ID from the Rooms collection.
 *
 * @param roomId ID of the room to get from the Rooms collection
 * @returns Room object
 */
export const getRoomById = async (roomId: string) => {
  const room = await (await RoomsCollection())
    .find({ _id: new ObjectId(roomId) })
    .toArray();
  return room;
};

/**
 * Method to get an array of rooms based on their availability based on a dates passed in.
 * @param dateArray Array of dates to check for availability
 * @returns Array of room objects
 */
export const getRoomsAvailabilityByDateRange = async (
  dateArray: Array<string>
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
 * Method to add an array of dates to a room's temporaryHoldDates array.
 * @param roomId ID of the room to add the dates to
 * @param dateArray Array of dates to add to the room's temporaryHoldDates array
 * @returns Boolean indicating success or failure
 */
export const addHoldDates = async (
  roomId: string | Array<string>,
  dateArray: Array<string>
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
        }
      );
    } else {
      await roomsCollection.updateOne(
        { _id: roomId[0] },
        {
          $push: { temporaryHoldDates: { $each: dateArray } },
        }
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  } finally {
  }

  return true;
};
