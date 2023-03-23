import React from "react";
import { auth, signOutUser } from "../../../firebase";

const AdminHome: React.FC = () => {
  const [userEmail, setUserEmail] = React.useState("");

  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User

      setUserEmail(user.email ?? "Admin");

      // ...
    } else {
      // User is signed out
      // ...
      window.location.replace("/login");
    }
  });

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row lg:space-x-10 max-w-6xl sm:p-6 sm:my-2 sm:mx-4 sm:rounded-2xl">
        <div className="flex-1 px-2 sm:px-0">
          {/* <!-- Title --> */}
          <div className="flex justify-between items-center">
            <h3 className="text-3xl text-white font-bold text-center md:mt-2 mt-10">
              Yorkshire Inn Admin Portal
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
          <div className="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="relative group bg-gray-900 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
              <svg
                className="text-white w-[30%]"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <h4 className="text-white text-2xl font-bold capitalize text-center"></h4>
              <p className="text-white/50">Manage bookings</p>
            </div>
            <div className="relative group bg-gray-900 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
              <svg
                className="text-white w-[30%]"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <h4 className="text-white text-2xl font-bold capitalize text-center"></h4>
              <p className="text-white/50 text-center">
                Manage Room Availability and Pricing
              </p>
            </div>
            <div className="relative group bg-gray-900 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
              <svg
                className="text-white w-[30%]"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <h4 className="text-white text-2xl font-bold capitalize text-center"></h4>
              <p className="text-white/50 text-center">Generate Reports</p>
            </div>
            <div className="relative group bg-gray-900 py-10 sm:py-20 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md hover:bg-gray-900/80 hover:smooth-hover">
              <svg
                className="text-white w-[30%]"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <h4 className="text-white text-2xl font-bold capitalize text-center"></h4>
              <p className="text-white/50 text-center">Manage Reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
