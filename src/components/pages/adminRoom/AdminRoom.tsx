import {
  Checkbox,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays, eachDayOfInterval, format } from "date-fns";
import React, { useEffect } from "react";
import { auth, signOutUser } from "../../../firebase";

const radioStyles = {
  color: "white",
  "&.Mui-checked": {
    color: "white",
  },
};

const AdminRoom: React.FC = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);
  const [updatePrice, setUpdatePrice] = React.useState<string>("");
  const [isBlocking, setIsBlocking] = React.useState(false);
  const [selectedRoom, setSelectedRoom] = React.useState<string>("");
  const [roomList, setRoomList] = React.useState<any[]>([]);
  const [blockedMap, setBlockMap] = React.useState<any[]>([]);
  const [priceMap, setPriceMap] = React.useState<any[]>([]);
  const [reload, setReload] = React.useState(false);

  const handlePriceChange = (event: any) => {
    setUpdatePrice(event.target.value);
  };

  const handleCheckboxChange = (event: any) => {
    setIsBlocking(event.target.checked);
    if (event.target.checked) {
      setUpdatePrice("");
    }
  };

  const handleRoomSelect = (event: any) => {
    setSelectedRoom(event.target.value);
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      userEmail === "" && setUserEmail(user.email ?? "Admin");

      // ...
    } else {
      // User is signed out
      // ...
      window.location.replace("/login");
    }
  });

  const handleSetStartDate = (newStartDate: string) => {
    if (endDate && new Date(newStartDate) > new Date(endDate)) {
      setEndDate(addDays(new Date(newStartDate), 1).toString());
    }

    setStartDate(newStartDate);
  };

  const handleSetEndDate = (newEndDate: string) => {
    if (endDate && new Date(newEndDate) < new Date(endDate)) {
      return;
    }
    setEndDate(newEndDate);
  };

  const resetDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      if (isBlocking || updatePrice !== "") {
        //TODO: remove after testing
        // console.log("submitting");
        // console.log(startDate);
        // console.log(endDate);
        // console.log(updatePrice);
        // console.log(isBlocking);
        // console.log(selectedRoom);

        const allDatesBetweenStartAndEndDate = eachDayOfInterval({
          start: new Date(startDate),
          end: new Date(endDate),
        });

        const formattedDates = allDatesBetweenStartAndEndDate.map((date) =>
          format(date, "MM/dd/yyyy"),
        );

        if (isBlocking) {
          fetch("/api/room/addBlockDates", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: selectedRoom,
              dates: formattedDates,
            }),
          })
            .then((response) => response.json())
            .then(() => setReload(true));
        } else {
          //update the special price by hitting the addSpecialDatePrice endpoint
          fetch("/api/room/addSpecialDatePrice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: selectedRoom,
              dates: formattedDates,
              price: updatePrice,
            }),
          }).then(() => setReload(true));
        }
      }
    }
  };

  const removeBlockDate = (roomId: string, date: string) => {
    fetch("/api/room/removeBlockDate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //reload the page
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const removeSpecialDatePrice = (roomId: string, date: string) => {
    fetch("/api/room/removeSpecialDatePrice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        date: date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        //reload the page
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (reload) {
      window.location.reload();
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    fetch("/api/room/getAllAdmin", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setRoomList(data.rooms);
        setPriceMap(data.priceMap);
        setBlockMap(data.blockedMap);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          {/* <!-- Title --> */}
          <div className="flex justify-between items-center">
            <a
              href="/adminHome"
              className="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover"
            >
              {" "}
              Return Home
            </a>
            <h3 className="text-3xl text-white font-bold text-center md:mt-2 mt-10">
              Manage Room Pricing and Availability
            </h3>
            <div className="inline-flex items-center space-x-2">
              <p className="text-white">Logged in as : {userEmail}</p>
              <a
                className="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                href="#"
              >
                <button onClick={() => signOutUser()}>Logout</button>
              </a>
            </div>
          </div>
          {/* Content */}
          <div className="h-[50%] pt-10 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Room Blocking/ Pricing Update
            </h2>
            {/* TOP CONTROLS */}
            <div className="flex">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isBlocking}
                    onChange={handleCheckboxChange}
                    sx={{
                      color: "white",
                      "&.Mui-checked": {
                        color: "white",
                      },
                    }}
                  />
                }
                label="Block Selected Room"
              />
              <TextField
                id="outlined-basic"
                label="Price to Update"
                variant="outlined"
                value={updatePrice}
                onChange={handlePriceChange}
                disabled={isBlocking}
                sx={{
                  "& .MuiInputLabel-root": { color: "white" },
                  "& .MuiInputBase-input": { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "white" },
                    "&:hover fieldset": { borderColor: "white" },
                    "&.Mui-focused fieldset": { borderColor: "white" },
                  },
                }}
              />
              <div className="mx-4">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label={"Start Date"}
                    value={startDate ? new Date(startDate) : null}
                    disablePast
                    maxDate={addDays(new Date(), 365)}
                    onChange={(newValue: Date | null) => {
                      newValue && handleSetStartDate(newValue.toString());
                    }}
                    componentsProps={{ textField: { variant: "outlined" } }}
                    sx={{
                      svg: { color: "white" },
                      input: { color: "white" },
                      label: { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color on focus
                      },
                    }}
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
                    onChange={(newValue: Date | null) => {
                      if (newValue && newValue <= new Date()) return;

                      newValue && handleSetEndDate(newValue.toString());
                    }}
                    componentsProps={{ textField: { variant: "outlined" } }}
                    sx={{
                      svg: { color: "white" },
                      input: { color: "white" },
                      label: { color: "white" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color on hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Border color on focus
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
              <button
                disabled={
                  !selectedRoom ||
                  !startDate ||
                  !endDate ||
                  (!updatePrice && !isBlocking)
                }
                className="px-5 py-2 inline-block bg-transparent outline rounded-md text-white outline-1 bg-gray-600 transition-colors mx-px"
                style={{
                  fontFamily: "Martel",
                  fontWeight: "400",
                  fontSize: "20px",
                  lineHeight: "34px",
                  letterSpacing: "0.13em",
                }}
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
            {/* ROOM SELECTION TABLE */}
            <RadioGroup value={selectedRoom} onChange={handleRoomSelect} row>
              {roomList.map((room) => {
                return (
                  <FormControlLabel
                    key={room._id}
                    value={room._id}
                    control={<Radio sx={radioStyles} />}
                    label={room.name}
                  />
                );
              })}
            </RadioGroup>
            {/* Table for Room priceing or blocked */}
            <h2 className="text-2xl font-bold my-2">Blocked Off Dates</h2>
            <div className="relative max-h-[300px] overflow-y-auto overflow-x-auto shadow-md sm:rounded-lg">
              <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Room Name</TableCell>
                      <TableCell>Blocked Date Range</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {blockedMap.map((entry) => {
                      return (
                        <TableRow key={entry.key}>
                          <TableCell>{entry.room}</TableCell>
                          <TableCell>
                            {format(new Date(entry.date), "MM/dd/yyyy")}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                console.log(entry);
                                removeBlockDate(entry.roomId, entry.date);
                              }}
                              className="text-red-500 hover:underline"
                            >
                              Remove Block
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <hr className="my-4" />
            {/* TABLE FOR ROOM PRICING */}
            <h2 className="text-2xl font-bold my-2">Special Price Dates</h2>
            <div className="relative max-h-[300px] overflow-x-auto overflow-y-auto shadow-md sm:rounded-lg">
              <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow className="font-bold">
                      <TableCell>Room Name</TableCell>
                      <TableCell>Date Range</TableCell>
                      <TableCell>Price Change</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {priceMap.map((entry) => {
                      return (
                        <TableRow key={entry.key}>
                          <TableCell>{entry.room}</TableCell>
                          <TableCell>
                            {format(new Date(entry.date), "MM/dd/yyyy")}
                          </TableCell>
                          <TableCell>$ {entry.price}</TableCell>
                          <TableCell>
                            <button
                              onClick={() => {
                                console.log(entry);
                                removeSpecialDatePrice(
                                  entry.roomId,
                                  entry.date,
                                );
                              }}
                              className="text-red-500 hover:underline"
                            >
                              Remove Price Change
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoom;
