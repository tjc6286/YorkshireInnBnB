import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { eachDayOfInterval } from "date-fns";
import React from "react";
import Button from "../../atoms/button";

// interface DateRangeSelectorProps {}

const DateRangeSelector = () => {
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleSetStartDate = (newStartDate: Date) => {
    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
    setStartDate(newStartDate);
  };

  const handleSetEndDate = (newEndDate: Date) => {
    if (endDate && newEndDate < endDate) {
      return;
    }
    setEndDate(newEndDate);
  };

  const handleSelectedDates = async () => {
    if (!startDate || !endDate) return;
    if (startDate > endDate) return;

    const allDatesBetweenStartAndEndDate = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    console.log(allDatesBetweenStartAndEndDate);

    fetch("/api/room/getRoomAvailabilityByDateRange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allDatesBetweenStartAndEndDate),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex flex-row items-center">
      <div className="mx-8">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={"Start Date"}
            value={startDate}
            disablePast
            onChange={(newValue: Date | null) => {
              newValue && handleSetStartDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div className="mx-8">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={"End Date"}
            value={endDate}
            disablePast
            minDate={startDate ?? undefined}
            disabled={!startDate}
            onChange={(newValue: Date | null) => {
              newValue && handleSetEndDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <div className="mx-8">
        <Button label="Search" onClick={handleSelectedDates} />
      </div>
    </div>
  );
};
export default DateRangeSelector;
