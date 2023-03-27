import { CircularProgress, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays, eachDayOfInterval, format } from "date-fns";
import React from "react";
import type { TempReservation } from "../../../types/reservation";
import type { Room, RoomAvailability } from "../../../types/room";
import Button from "../../atoms/button";
import ReservationsTable from "../reservationsTable";

// interface DateRangeSelectorProps {}

const RoomAvailabilityDateRangeSelector = () => {
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<Array<RoomAvailability>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [itinerary, setItinerary] = React.useState<Array<TempReservation>>([]);
  const [numberOfGuests, setNumberOfGuests] = React.useState<number>(2);
  const [unaccountedGuests, setUnaccountedGuests] = React.useState<number>(0);
  const [errors, setErrors] = React.useState<Array<string>>([]);

  const originalResults = React.useRef<Array<RoomAvailability>>([]);

  const handleSetStartDate = (newStartDate: string) => {
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      setEndDate(addDays(new Date(newStartDate), 1).toUTCString());
    }
    if (results.length > 0) {
      setResults([]);
      if (itinerary.length > 0) {
        setItinerary([]);
      }
    }
    setStartDate(newStartDate);
    setEndDate(addDays(new Date(newStartDate), 1).toUTCString());
  };

  const handleNumberOfGuestsChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (results.length > 0) {
      resetDates();
      if (itinerary.length > 0) {
        setItinerary([]);
      }
    }
    if (parseInt(event.target.value) <= 0) {
      setNumberOfGuests(1);
      return;
    }
    if (parseInt(event.target.value) > 16) {
      setNumberOfGuests(16);
      return;
    }
    setNumberOfGuests(parseInt(event.target.value));
  };

  const handleRemoveItineraryItem = (id: string) => {
    setItinerary(itinerary.filter((item) => item._id !== id));
    setResults([
      ...results,
      originalResults.current.find((result) => result._id === id)!,
    ]);
  };

  const calculateRoomSubtotal = (
    room: Partial<Room>,
    startDate: string,
    endDate: string,
  ) => {
    if (!startDate || !endDate) return 0;
    const allDatesBetweenStartAndEndDate = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });
    allDatesBetweenStartAndEndDate.pop();
    const dailyPrices: Array<number> = [];

    allDatesBetweenStartAndEndDate.forEach((date) => {
      const formattedDate = format(new Date(date), "MM/dd/yyyy");

      const specialDatePrice = room.specialPriceDates!.find(
        (specialDatePrice) => specialDatePrice.date === formattedDate,
      );

      if (specialDatePrice) {
        console.log(specialDatePrice.price);
        dailyPrices.push(specialDatePrice.price);
      } else {
        dailyPrices.push(room.basePrice!);
      }
    });

    return dailyPrices.reduce((a, b) => a + b, 0);
  };

  const handleSetEndDate = (newEndDate: string) => {
    if (endDate && new Date(newEndDate) < new Date(endDate)) {
      return;
    }
    if (results.length > 0) {
      setResults([]);
    }
    //if the endDate is greater than 14 days after the start date, set error
    if (startDate && new Date(newEndDate) > addDays(new Date(startDate), 14)) {
      setErrors(["longStayError"]);
      return;
    }

    if (errors.length > 0) {
      setErrors([]);
    }
    setEndDate(newEndDate);
  };

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
    setResults([]);
  };

  const addToItinerary = (room: Partial<Room>) => {
    if (numberOfGuests - unaccountedGuests > room.maximumOccupancy!) {
      setUnaccountedGuests(numberOfGuests - room.maximumOccupancy!);
    }

    setItinerary([
      ...itinerary,
      {
        _id: room._id!,
        roomName: room.name!,
        guestCount: numberOfGuests,
        subtotal: calculateRoomSubtotal(room, startDate!, endDate!),
      },
    ]);
    setResults(results.filter((result) => result._id !== room._id));
  };

  const handleSelectedDates = async () => {
    setLoading(true);
    if (!startDate || !endDate) {
      setLoading(false);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setLoading(false);
      return;
    }

    const allDatesBetweenStartAndEndDate = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });
    fetch("/api/room/getRoomAvailabilityByDateRange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allDatesBetweenStartAndEndDate),
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
        originalResults.current = data;
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  console.log(endDate);
  return (
    <div className="flex flex-1 flex-col justify-center">
      <div className="flex flex-row items-center">
        <div className="ml-8 mr-4 w-32">
          <TextField
            required
            label="Number of Guests"
            type="number"
            value={numberOfGuests}
            onChange={handleNumberOfGuestsChange}
          />
        </div>

        <div className="mx-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={"Start Date"}
              value={startDate}
              disablePast
              inputFormat="MM/dd/yyyy"
              maxDate={addDays(new Date(), 365)}
              onChange={(newValue: Date | null) => {
                newValue && handleSetStartDate(newValue.toUTCString());
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="mx-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={"End Date"}
              value={endDate}
              disablePast
              inputFormat="MM/dd/yyyy"
              maxDate={addDays(new Date(), 365)}
              minDate={startDate ? new Date(startDate) : undefined}
              disabled={!startDate}
              onChange={(newValue: Date | null) => {
                if (newValue && newValue <= new Date()) return;

                newValue && handleSetEndDate(newValue.toString());
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="mx-4">
          <Button
            disabled={!endDate}
            label={results.length > 0 ? "Reset" : "Search"}
            onClick={results.length > 0 ? resetDates : handleSelectedDates}
          />
        </div>
      </div>
      <div className="m-8 h-full">
        {itinerary.length > 0 && (
          <ReservationsTable
            reservations={itinerary}
            onRemove={handleRemoveItineraryItem}
            unaccountedGuests={unaccountedGuests}
          />
        )}
        {results.length > 0 ? (
          results.map((room: Partial<RoomAvailability>) => (
            <div
              className={`flex text-black rounded-md border-2 border-gray-600 my-4 ${
                !room.isAvailable ? "opacity-40" : ""
              }`}
              key={room._id}
            >
              <img
                style={{ width: 180, height: 180 }}
                src={`assets/Gallery/${room.imgPathName}`}
              />
              <div className="flex flex-1 justify-items-center">
                <div className="flex flex-col p-4">
                  <h2 className="block text-2xl">Room Name: {room.name}</h2>
                  <h2 className="block font-bold">Price: {room.priceRange}</h2>
                  <p className="block">Description: {room.description}</p>
                </div>
              </div>
              <button
                disabled={!room.isAvailable}
                onClick={() => {
                  addToItinerary(room);
                }}
                // href={`/customerInformation/${room._id}-${
                //   startDate + "-" + endDate
                // }`}
                className={`px-4 py-2 flex w-36 items-center justify-center bg-transparent outline outline-1 ${
                  room.isAvailable
                    ? "hover:text-white hover:bg-gray-600 transition-colors"
                    : ""
                }`}
              >
                {room.isAvailable ? "Add to Itinerary" : "Unavailable"}
              </button>
            </div>
          ))
        ) : loading ? (
          <div className="flex w-full h-screen justify-center align-middle">
            <CircularProgress />
          </div>
        ) : (
          <>
            {errors.includes("longStayError") && (
              <h1 className="text-red-500 text-xl h-screen">
                Reservations longer than 14 days must be booked over phone!
                Please call 315-548-9675.
              </h1>
            )}
            <h1 className="text-black text-xl h-screen">
              Select a start and end date to see what rooms are available!
            </h1>
          </>
        )}
      </div>
    </div>
  );
};
export default RoomAvailabilityDateRangeSelector;
