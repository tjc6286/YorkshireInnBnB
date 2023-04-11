import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays } from "date-fns";
import React, { useEffect } from "react";
import { auth, signOutUser } from "../../../firebase";
import type { Customer } from "../../../types/customer";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AdminBooking: React.FC = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);
  const [bookingList, setBookingList] = React.useState<any[]>([]);
  const [modalState, setModalState] = React.useState(false);
  const [customerModalState, setCustomerModalState] = React.useState(false);
  const [bookingIdToCancel, setBookingIdToCancel] = React.useState("");
  const [customerToView, setCustomerToView] = React.useState<Customer>();

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

  const handleOpenModal = (bookingId: string) => {
    setBookingIdToCancel(bookingId);
    setModalState(true);
  };

  const handleCloseModal = () => {
    setBookingIdToCancel("");
    setModalState(false);
  };

  const handleOpenCustomerModal = (customer: Customer) => {
    setCustomerModalState(true);
    setCustomerToView(customer);
  };

  const handleCloseCustomerModal = () => {
    setCustomerModalState(false);
    setCustomerToView(undefined);
  };

  const handleCancelBooking = (bookingId: string) => {
    fetch("/api/booking/cancelBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bookingId: bookingIdToCancel,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBookingList(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    //reload window
    // window.location.reload();
    handleCloseModal();
  };

  const handleSubmit = () => {
    if (startDate && endDate) {
      //TODO: remove after testing
      console.log("submitting");
      console.log(startDate);
      console.log(endDate);

      // Reset all fields
      resetDates();
    }
  };

  useEffect(() => {
    fetch("/api/booking/getAllAdmin", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBookingList(data);
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
              className="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover">
              {" "}
              Return Home
            </a>
            <h3 className="text-3xl text-white font-bold text-center md:mt-2 mt-10">
              Manage Bookings
            </h3>
            <div className="inline-flex items-center space-x-2">
              <p className="text-white">Logged in as : {userEmail}</p>
              <a
                className="bg-gray-900 text-white/50 p-2 rounded-md hover:text-white smooth-hover"
                href="#">
                <button onClick={() => signOutUser()}>Logout</button>
              </a>
            </div>
          </div>
          {/* Content */}
          <div className="h-[50%] pt-10 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Select Date Range to View Bookings
            </h2>
            {/* TOP CONTROLS */}
            <div className="flex">
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
                  />
                </LocalizationProvider>
              </div>
              <button
                disabled={!startDate || !endDate}
                className="px-5 py-2 inline-block bg-transparent outline rounded-md text-white outline-1 bg-gray-600 transition-colors mx-px"
                style={{
                  fontFamily: "Martel",
                  fontWeight: "400",
                  fontSize: "20px",
                  lineHeight: "34px",
                  letterSpacing: "0.13em",
                }}
                onClick={handleSubmit}>
                Update
              </button>
            </div>
            {/* Booking Table */}
            <h2 className="text-2xl font-bold my-2">Existing Bookings</h2>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Booking ID</TableCell>
                      <TableCell>Confirmation Code</TableCell>
                      <TableCell>Customer Name</TableCell>
                      <TableCell># of Reservations</TableCell>
                      <TableCell>Third Party</TableCell>
                      <TableCell>Total Price</TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookingList.map((entry) => {
                      return (
                        <TableRow key={entry._id}>
                          <TableCell>{entry._id}</TableCell>
                          <TableCell>{entry.transactionId}</TableCell>
                          <TableCell>
                            {entry.customer.firstName +
                              " " +
                              entry.customer.lastName}
                          </TableCell>
                          <TableCell>{entry.reservations.length}</TableCell>
                          <TableCell>
                            {entry.vendor ? "True" : "False"}
                          </TableCell>
                          <TableCell>
                            {(entry.totalPrice / 100).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                handleOpenCustomerModal(entry.customer);
                              }}
                              style={{
                                backgroundColor: "blue",
                                color: "white",
                              }}>
                              Customer
                            </Button>
                          </TableCell>
                          <TableCell>
                            {entry.isCancelled ? (
                              <p>Cancelled</p>
                            ) : (
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                  handleOpenModal(entry._id.toString());
                                }}
                                style={{
                                  backgroundColor: "red",
                                  color: "white",
                                }}>
                                Cancel
                              </Button>
                            )}
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
      {/* CANCELATION MODAL */}
      <Modal
        open={modalState}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Cancelling a Booking
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`Are you sure you want to cancel booking with the ID: ${bookingIdToCancel}?`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleCancelBooking(bookingIdToCancel);
            }}
            style={{
              backgroundColor: "#2196f3",
              color: "white",
              marginRight: "10px",
            }}>
            Cancel Booking
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
            style={{
              backgroundColor: "red",
              color: "white",
            }}>
            Stop Cancel
          </Button>
        </Box>
      </Modal>
      {/* CUSTOMER INFO MODAL */}
      <Modal
        open={customerModalState}
        onClose={handleCloseCustomerModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Customer Information:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`Name: ${customerToView?.firstName} ${customerToView?.lastName}`}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`Email: ${customerToView?.email}`}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`Phone: ${customerToView?.phone}`}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`id: ${customerToView?._id} `}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseCustomerModal}
            style={{
              backgroundColor: "red",
              color: "white",
            }}>
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminBooking;
