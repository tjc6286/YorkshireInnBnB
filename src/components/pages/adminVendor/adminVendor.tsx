import React, { useEffect } from "react";
import { auth, signOutUser } from "../../../firebase";
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
  TextField,
  Typography,
} from "@mui/material";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const AdminVendor: React.FC = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const [vendorName, setVendorName] = React.useState("");
  const [vendorList, setVendorList] = React.useState([]);

  //modal states
  const [modalState, setModalState] = React.useState(false);
  const [modalVendorKey, setModalVendorKey] = React.useState("");

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

  const handleSubmit = () => {
    fetch("/api/vendor/insertNewVendor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorName: vendorName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
      });
  };

  const handleOpenModal = (vendorKey: string) => {
    setModalState(true);
    setModalVendorKey(vendorKey);
  };

  const handleCloseModal = () => {
    setModalState(false);
    setModalVendorKey("");
  };

  const removeVendor = (vendorKey: string) => {
    fetch("/api/vendor/removeVendor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vendorKey: vendorKey,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.location.reload();
      });
  };

  useEffect(() => {
    fetch("/api/vendor/getAll", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setVendorList(data);
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
              Manage Vendors
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
            <h2 className="text-2xl font-bold mb-2">Create new Vendor Keys</h2>
            {/* TOP CONTROLS */}
            <div className="flex">
              <div className="mx-4">
                <TextField
                  value={vendorName}
                  onChange={(e) => {
                    setVendorName(e.target.value);
                  }}
                  sx={{
                    "& .MuiInputLabel-root": { color: "white" },
                    "& .MuiInputBase-input": { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                  id="outlined-basic"
                  label="New Vendor Name"
                  variant="outlined"
                />
              </div>

              <button
                disabled={vendorName === ""}
                className="px-5 py-2 inline-block bg-transparent outline rounded-md text-white outline-1 bg-gray-600 transition-colors mx-px"
                style={{
                  fontFamily: "Martel",
                  fontWeight: "400",
                  fontSize: "20px",
                  lineHeight: "34px",
                  letterSpacing: "0.13em",
                }}
                onClick={handleSubmit}>
                Create Vendor Key
              </button>
            </div>
            {/* Vendor Table */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
              <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Vendor Name</TableCell>
                      <TableCell>Vendor Key</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {vendorList.map((vendor) => {
                      return (
                        <TableRow key={vendor.vendorKey}>
                          <TableCell>{vendor.vendorName}</TableCell>
                          <TableCell>{vendor.vendorKey}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => {
                                handleOpenModal(vendor.vendorKey);
                              }}
                              style={{
                                backgroundColor: "red",
                                color: "white",
                              }}>
                              Remove Key
                            </Button>
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

      {/* Remove Modal */}
      <Modal
        open={modalState}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Removing Vendor
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`Are you sure you want to remove Vendor with VendorKey:`}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mb: 2 }}>
            {`${modalVendorKey}?`}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              removeVendor(modalVendorKey);
            }}
            style={{
              backgroundColor: "#2196f3",
              color: "white",
              marginRight: "10px",
            }}>
            Remove Vendor
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
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

export default AdminVendor;
