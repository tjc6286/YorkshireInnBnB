import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays, format, max, min, parse } from "date-fns";
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

const textFieldStyles = {
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "white" },
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
};

const AdminBooking: React.FC = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const [bookingList, setBookingList] = React.useState<any[]>([]);
  const [modalState, setModalState] = React.useState(false);
  const [customerModalState, setCustomerModalState] = React.useState(false);
  const [bookingIdToCancel, setBookingIdToCancel] = React.useState("");
  const [customerToView, setCustomerToView] = React.useState<Customer>();

  const [loading, setLoading] = React.useState(true);

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

  const getDateRange = (dates: Array<string>) => {
    console.log(dates);
    const dateFormat = "MM/dd/yyyy";
    const dateObjects = dates.map((dateString) =>
      parse(dateString, dateFormat, new Date())
    );

    const minDate = min(dateObjects);
    let maxDate = max(dateObjects);

    if (minDate === maxDate) {
      maxDate = new Date(maxDate.setDate(maxDate.getDate() + 1));
    }

    const minDateString = format(minDate, "MM/dd/yyyy");
    const maxDateString = format(maxDate, "MM/dd/yyyy");

    return `${minDateString} - ${maxDateString}`;
  };

  const handleNewBooking = () => {
    window.location.replace("/startBooking");
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
    });
    //reload window
    window.location.reload();
    handleCloseModal();
  };

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

  const handleSubmit = () => {};

  const fetchBookings = () => {
    fetch("/api/booking/getAllAdmin", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBookingList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchBookings();
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
            {/* Booking Table */}
            <div className="flex gap-x-2 mb-4">
              <h2 className="text-2xl font-bold my-2">Existing Bookings</h2>
              <Button
                onClick={handleNewBooking}
                type="submit"
                variant="contained"
                color="primary">
                Create New Booking
              </Button>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              {loading ? (
                <div className="flex justify-center">
                  <CircularProgress />
                </div>
              ) : (
                <TableContainer
                  component={Paper}
                  style={{ maxHeight: "400px" }}>
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
                              {(entry.totalPrice / 100).toLocaleString(
                                "en-US",
                                {
                                  style: "currency",
                                  currency: "USD",
                                }
                              )}
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
              )}
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
