import React, { useEffect } from "react";
import { Button, TextField } from "@mui/material";
import type { Booking } from "../../../types/Booking";
import { Typography, Box, Grid } from "@mui/material";
import { min, max, format, parse } from "date-fns";

const BookingLookup = () => {
  const [booking, setBooking] = React.useState<{}>();
  const [bookingId, setBookingId] = React.useState("");
  const [roomList, setRoomList] = React.useState<any>([]);
  const [bookingNotFound, setBookingNotFound] = React.useState(false);

  const handleSubmit = () => {
    fetch("/api/booking/bookingLookup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: bookingId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setBooking(data);
      });
  };

  const cancelBooking = (bookingId: string) => {
    fetch("/api/booking/cancelBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: bookingId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBookingNotFound(false);
        setBooking(data);
        //reload window
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        setBookingNotFound(true);
      });
  };

  //get room name from the room list by room id
  const getRoomName = (roomId: string) => {
    const room = roomList.find((room: any) => room._id === roomId);
    return room?.name;
  };

  const getDateRange = (dates: Array<string>) => {
    const dateFormat = "MM/dd/yyyy";
    const dateObjects = dates.map((dateString) =>
      parse(dateString, dateFormat, new Date())
    );

    const minDate = min(dateObjects);
    const maxDate = max(dateObjects);

    const minDateString = format(minDate, "MM/dd/yyyy");
    const maxDateString = format(maxDate, "MM/dd/yyyy");

    return `${minDateString} - ${maxDateString}`;
  };

  useEffect(() => {
    fetch("/api/room/getAll", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setRoomList(data);
      });
  }, []);

  return (
    <div className="h-screen">
      <div className="flex">
        <div className="mx-4">
          <TextField
            sx={{ width: "400px" }}
            className="w-40"
            value={bookingId}
            onChange={(e) => {
              setBookingId(e.target.value);
            }}
            id="outlined-basic"
            label="Booking Confirmation Number"
            variant="outlined"
          />
        </div>

        <button
          disabled={bookingId === ""}
          className="px-5 py-2 inline-block bg-transparent outline rounded-md text-white outline-1 bg-gray-600 transition-colors mx-px"
          style={{
            fontFamily: "Martel",
            fontWeight: "400",
            fontSize: "20px",
            lineHeight: "34px",
            letterSpacing: "0.13em",
          }}
          onClick={handleSubmit}>
          Look up Booking
        </button>
      </div>
      {/* booking lookup  */}
      {booking && (
        <div className="rounded-sm border-2 border-black p-4 mt-2">
          <Typography>{`Confirmation Num: ${booking?.booking?.transactionId}`}</Typography>
          <Typography>{`Price: $${booking?.booking?.totalPrice}`}</Typography>
          <Typography>{`Customer Name: ${booking?.customer?.firstName} ${booking?.customer?.lastName}`}</Typography>
          <Typography>{`Email: ${booking?.customer?.email}`}</Typography>
          <Typography>{`Stay: ${getDateRange(
            booking?.booking?.dates
          )}`}</Typography>
          <Typography className="mt-2 underline font-semibold">
            Reservations:
          </Typography>
          {booking?.reservations?.map((reservation: any) => {
            return (
              <div className="my-2" key={reservation._id}>
                <Typography>{`Room:${getRoomName(
                  reservation.roomId
                )}`}</Typography>
                {reservation.allergiesIncluded && (
                  <Typography>{`Allergies: ${reservation.allergies}`}</Typography>
                )}
                {reservation.petsIncluded && (
                  <Typography>{`Pet: ${reservation.pet}`}</Typography>
                )}
              </div>
            );
          })}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              cancelBooking(booking.booking._id);
            }}
            style={{
              backgroundColor: "red",
              color: "white",
            }}>
            Cancel Booking
          </Button>
        </div>
      )}
      {/* booking not found */}
      {bookingNotFound && (
        <div className="rounded-sm border-2 border-black p-4 mt-2">
          <Typography>Booking not found</Typography>
        </div>
      )}
    </div>
  );
};

export default BookingLookup;
