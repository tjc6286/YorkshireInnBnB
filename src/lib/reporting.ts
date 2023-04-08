import { logMessage } from "./logger";
import { ReservationsCollection, disconnectDB } from "./mongodb";

export const countReservationsPerRoom = async () => {
  //SERVER LOGGING
  logMessage("Method: countReservationsPerRoom", "Counting Reservations");

  try {
    const reservationCollection = await ReservationsCollection();

    const pipeline = [
      {
        $group: {
          _id: "$roomId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "Room",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room",
      },
      {
        $project: {
          _id: 0,
          roomId: "$_id",
          roomName: "$room.name",
          count: 1,
        },
      },
    ];

    const reservationsPerRoom = await reservationCollection
      .aggregate(pipeline)
      .toArray();

    return reservationsPerRoom;
  } catch (error) {
    console.error("Error counting reservations per room:", error);
    return null;
  } finally {
    disconnectDB();
  }
};

export const sumSubtotalPerRoom = async () => {
  //SERVER LOGGING
  logMessage("Method: sumSubtotalPerRoom", "Summing Subtotals");

  try {
    const reservationCollection = await ReservationsCollection();

    const pipeline = [
      {
        $group: {
          _id: "$roomId",
          subtotalSum: { $sum: "$subtotal" },
        },
      },
      {
        $lookup: {
          from: "Room",
          localField: "_id",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $unwind: "$room",
      },
      {
        $project: {
          _id: 0,
          roomId: "$_id",
          roomName: "$room.name",
          subtotalSum: 1,
        },
      },
    ];

    const subtotalPerRoom = await reservationCollection
      .aggregate(pipeline)
      .toArray();
    return subtotalPerRoom;
  } catch (error) {
    console.error("Error calculating sum of subtotals per room:", error);
    return null;
  } finally {
    disconnectDB();
  }
};
