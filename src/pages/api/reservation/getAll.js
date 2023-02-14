import { getAllReservations } from "../../../lib/reservations";

/**
 *
 * @returns
 */
export const get = async () => {
  console.log("Log - GET ALL RESERVATIONS");
  const reservations = await getAllReservations();
  if (!reservations) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(reservations), {
    status: 200,
  });
};
