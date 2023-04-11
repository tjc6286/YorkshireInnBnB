import { CircularProgress, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { DateValidationError } from "@mui/x-date-pickers/internals";
import { addDays, eachDayOfInterval, format } from "date-fns";
import React from "react";
import type { ReservationWithPriceBreakdown } from "../../../types/reservation";
import type { Room, RoomAvailability } from "../../../types/room";
import type SpecialDatePrice from "../../../types/specialDatePrice";
import ReservationsTable from "../reservationsTable";

// interface DateRangeSelectorProps {}

const RoomAvailabilityDateRangeSelector = () => {
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);
  const [results, setResults] = React.useState<Array<RoomAvailability>>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [itinerary, setItinerary] = React.useState<
    Array<ReservationWithPriceBreakdown>
  >([]);
  const [numberOfGuests, setNumberOfGuests] = React.useState<number>(2);
  const [unaccountedGuests, setUnaccountedGuests] = React.useState<number>(0);
  const [errors, setErrors] = React.useState<Array<string>>([]);
  const [endDateError, setEndDateError] =
    React.useState<DateValidationError | null>(null);
  const [startDateError, setStartDateError] =
    React.useState<DateValidationError | null>(null);

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
    event: React.ChangeEvent<HTMLInputElement>
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

  const createPriceBreakdown = (
    room: Partial<Room>,
    startDate: string,
    endDate: string
  ) => {
    const allDatesBetweenStartAndEndDate = eachDayOfInterval({
      start: new Date(startDate),
      end: new Date(endDate),
    });
    allDatesBetweenStartAndEndDate.pop();
    const dailyPrices: Array<SpecialDatePrice> = [];

    allDatesBetweenStartAndEndDate.forEach((date) => {
      const formattedDate = format(new Date(date), "MM/dd/yyyy");

      const specialDatePrice = room.specialPriceDates!.find(
        (specialDatePrice) => specialDatePrice.date === formattedDate
      );

      if (specialDatePrice) {
        dailyPrices.push(specialDatePrice);
      } else {
        dailyPrices.push({
          date: formattedDate,
          price: room.basePrice!,
        } satisfies SpecialDatePrice);
      }
    });

    const subtotal = dailyPrices.reduce((a, b) => a + b.price, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const bookingFee = Math.round(subtotal * 0.03 * 100) / 100;
    const total = Math.round((subtotal + tax + bookingFee) * 100) / 100;
    const priceBreakdown = {
      dailyPrices: dailyPrices,
      subtotal: subtotal,
      tax: tax,
      bookingFee: bookingFee,
      total: total,
    };
    return priceBreakdown;
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
    if (itinerary.length > 0) {
      setItinerary([]);
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
        priceBreakdown: createPriceBreakdown(room, startDate!, endDate!),
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
        console.log(data);
        setResults(data);
        originalResults.current = data;
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleCreateTemporaryBooking = () => {
    try {
      fetch("/api/booking/createInProcessBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate: format(new Date(startDate!), "MM/dd/yyyy").toString(),
          endDate: format(new Date(endDate!), "MM/dd/yyyy").toString(),
          itinerary,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          window.location.href = `/customerInformation/${data}`;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const endDateErrorMessage = React.useMemo(() => {
    switch (endDateError) {
      case "maxDate": {
        return "Reservations cannot be made beyond 1 year from today";
      }

      case "minDate": {
        return "Reservations cannot be made before today";
      }

      case "invalidDate": {
        return "Please enter a valid date";
      }

      default: {
        return "";
      }
    }
  }, [endDateError]);

  const startDateErrorMessage = React.useMemo(() => {
    switch (startDateError) {
      case "maxDate": {
        return "Reservations cannot be made beyond 1 year from today";
      }

      case "minDate": {
        return "Reservations cannot be made before today";
      }

      case "invalidDate": {
        return "Please enter a valid date";
      }

      default: {
        return "";
      }
    }
  }, [startDateError]);

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
              value={startDate ? new Date(startDate) : null}
              disablePast
              maxDate={addDays(new Date(), 365)}
              onChange={(newValue: Date | null) => {
                newValue && handleSetStartDate(newValue.toUTCString());
              }}
              onError={(newError) => setStartDateError(newError)}
              slotProps={{
                textField: {
                  helperText: startDateErrorMessage,
                },
              }}
              componentsProps={{ textField: { variant: "outlined" } }}
            />
          </LocalizationProvider>
        </div>
        <div className="mx-4">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={"End Date"}
              value={endDate ? new Date(endDate) : null}
              disablePast
              maxDate={addDays(new Date(), 365)}
              minDate={startDate ? new Date(startDate) : undefined}
              disabled={!startDate}
              onError={(newError) => {
                setErrors([...errors, "badEndDate"]);
                setEndDateError(newError);
              }}
              slotProps={{
                textField: {
                  helperText: endDateErrorMessage,
                },
              }}
              onChange={(newValue: Date | null) => {
                if (newValue && newValue <= new Date()) return;

                newValue && handleSetEndDate(newValue.toString());
              }}
              componentsProps={{ textField: { variant: "outlined" } }}
            />
          </LocalizationProvider>
        </div>
        <button
          disabled={!endDate}
          className="px-5 py-2 inline-block bg-transparent outline rounded-md text-white outline-1 bg-gray-600 transition-colors mx-px"
          style={{
            fontFamily: "Martel",
            fontWeight: "400",
            fontSize: "20px",
            lineHeight: "34px",
            letterSpacing: "0.13em",
          }}
          onClick={
            results.length > 0
              ? resetDates
              : () => {
                  if (endDateError || startDateError) {
                    return;
                  }
                  handleSelectedDates();
                }
          }>
          {results.length > 0 ? "Reset" : "Search"}
        </button>
      </div>
      <div className="m-8 h-full">
        {itinerary.length > 0 && (
          <>
            <ReservationsTable
              reservations={itinerary}
              onRemove={handleRemoveItineraryItem}
              unaccountedGuests={unaccountedGuests}
            />
            <div className="w-full flex justify-end">
              <button
                className="px-5 py-2 inline-block bg-transparent outline rounded-md text-white outline-1 bg-gray-600 transition-colors mt-10 mx-px"
                style={{
                  fontFamily: "Martel",
                  fontWeight: "400",
                  fontSize: "20px",
                  lineHeight: "34px",
                  letterSpacing: "0.13em",
                }}
                onClick={handleCreateTemporaryBooking}>
                Book Now!
              </button>
            </div>
          </>
        )}
        {results.length > 0 ? (
          results.map((room: Partial<RoomAvailability>) => (
            <div
              className={`flex text-black rounded-md border-2 border-gray-600 my-4 ${
                !room.isAvailable ? "opacity-40" : ""
              }`}
              key={room._id}>
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
                }`}>
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
