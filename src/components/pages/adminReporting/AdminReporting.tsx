import React from "react";
import { auth, signOutUser } from "../../../firebase";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addDays, format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "white",
      },
    },
    title: {
      display: true,
      text: "Income by Month",
    },
  },
  scales: {
    x: {
      ticks: {
        color: "white",
      },
    },
    y: {
      ticks: {
        color: "white",
      },
    },
  },
};

const AdminReporting: React.FC = () => {
  const [userEmail, setUserEmail] = React.useState("");
  const [startDate, setStartDate] = React.useState<string | null>(null);
  const [endDate, setEndDate] = React.useState<string | null>(null);

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
      //TODO: remove after testing
      console.log("submitting");
      console.log(startDate);
      console.log(endDate);

      // Reset all fields
      resetDates();
    }
  };

  //CHART VALUES
  //TESTING VALUES
  const monthLabels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const values = [
    3333.33, 4030, 3583, 9238, 400, 2383.23, 2387, 4000, 5000, 3000, 4000, 5000,
  ];
  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: "Money (in Dollars)",
        data: values,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div>
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
                Reporting
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
              <h2 className="text-2xl font-bold mb-2">Generate Report</h2>
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
              {/* Generated Report */}
              {/* 
                - number of stays per month
                - on site vs thirda party bookings
                - total income per month
              */}
              <div className="w-full">
                <Bar options={options} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReporting;
