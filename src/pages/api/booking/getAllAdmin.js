import { getAllBookings } from "../../../lib/bookings";
import { getCustomerByID } from "../../../lib/customers";
import { getReservationByID } from "../../../lib/reservations";
/**
 *
 * @returns
 */
export const get = async () => {
  //SERVER LOGGING
  console.log(
    "Endpoint: /api/booking/getAllAdmin - " + new Date().toISOString()
  );

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
