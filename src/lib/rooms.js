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
