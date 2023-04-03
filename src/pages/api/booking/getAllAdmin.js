import { getAllBookings } from "../../../lib/bookings";
import { getCustomerByID } from "../../../lib/customers";
import { getReservationByID } from "../../../lib/reservations";
import { logMessage } from "../../../lib/logger";
/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  logMessage("ENDPOINT: /api/booking/getAllAdmin", "Getting All Bookings");

  const bookings = await getAllBookings();
  if (!bookings) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
  const newBookingList = [];
  //iterate over bookings and add customer data to customerList use the getCustomerById function
  for (const booking of bookings) {
    const customer = await getCustomerByID(booking.customerId);
    const reservationData = [];
    for (const reservationID of booking.reservationIds) {
      const reservation = await getReservationByID(reservationID);
      reservationData.push(reservation);
    }
    newBookingList.push({
      booking: booking,
      customer: customer,
      reservation: reservationData,
    });
  }

  return new Response(JSON.stringify(newBookingList), {
    status: 200,
  });
};
