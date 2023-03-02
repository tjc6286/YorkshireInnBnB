import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";
import Button from "../../atoms/button";

interface DateRangeSelectorProps {}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({}) => {
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

    try {
      fetch("/api/room/getAll")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    } catch (error) {
      console.log(error);
    }
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
