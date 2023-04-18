import { CircularProgress } from "@mui/material";
import React from "react";
import { states } from "../../../data/states";
import type SpecialDatePrice from "../../../types/specialDatePrice";
import Button from "../../atoms/button";

interface CustomerInformationFormProps {
  bookingInfo: any;
  id: string;
}

export interface IFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  petsDescription?: string;
  allergiesDescription?: string;
  previousBookings?: Array<any>;
}

const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({
  bookingInfo,
  id,
}) => {
  const calculateTotalFees = () =>
    bookingInfo.itinerary
      .map(
        (room: any) => room.priceBreakdown.tax + room.priceBreakdown.bookingFee,
      )
      .reduce((sum: number, b: number) => sum + b, 0);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [petCheck, setPetCheck] = React.useState<boolean>(false);
  const [allergyCheck, setAllergyCheck] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);
  const [fees] = React.useState<number>(calculateTotalFees());

  const [formState, setFormState] = React.useState<IFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    petsDescription: "",
    allergiesDescription: "",
  });

  const validateForm = () => {
    const errors = [];
    switch (true) {
      case formState.firstName === "":
        errors.push("firstName");
      case formState.lastName === "":
        errors.push("lastName");
      case formState.email === "":
        errors.push("email");
      case formState.phone === "":
        errors.push("phone");
      case formState.address === "":
        errors.push("address");
      case formState.city === "":
        errors.push("city");
      case formState.state === "":
        errors.push("state");
      case formState.zip === "":
        errors.push("zip");
      default:
        break;
    }
    if (errors.length > 0) {
      setErrors(errors);
      return true;
    }
    return false;
  };

  const convert = (currency: string) => {
    var temp = currency.replace(/[^0-9.-]+/g, "");

    return parseFloat(temp);
  };

  const getDepositCost = () => {
    const depositString = bookingInfo.itinerary
      .map((room: any) => room.priceBreakdown.dailyPrices[0].price)
      .reduce((sum: number, b: number) => sum + b, fees)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

    return convert(depositString);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (event: Event) => {
    //TODO: handle submit to send to stripe page and
    event.preventDefault();

    const errorFound = validateForm();
    if (errorFound) {
      return;
    }

    try {
      fetch("/api/payment/getPaymentIntent", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },

        //TODO: HANDLE MULTIPLE RESERVATIONS
        body: JSON.stringify({
          amountDue: Math.round(getDepositCost() * 100),
          totalCost: Math.round(
            convert(calculateBookingPriceBreakdownField("total")) * 100,
          ),
          bookingInfo: bookingInfo,
          id: id,
          customerInformation: {
            ...formState,
            petsIncluded: petCheck,
            allergiesIncluded: allergyCheck,
          },
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          window.location.href = data;
        });
    } catch (error) {
      console.log(error);
    }
  };

  const calculateBookingPriceBreakdownField = (fieldName: string) =>
    bookingInfo.itinerary
      .map((room: any) => room.priceBreakdown[fieldName])
      .reduce((sum: number, b: number) => sum + b, 0)
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

  return loading ? (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100dvh",
        justifyContent: "center",
      }}
    >
      <div className="m-auto">
        <CircularProgress color="inherit" />
      </div>
    </div>
  ) : (
    <div
      className="flex flex-col md:flex-row w-full"
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
      }}
    >
      <div
        // className="flex flex-col md:flex-row w-full"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            margin: "2rem",
            flexDirection: "column",
          }}
        >
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontWeight: "600",
              fontSize: 32,
              lineHeight: "129%",
              letterSpacing: "0.035em",
              color: "#000000",
              paddingBottom: "1rem",
            }}
          >
            Your Stay
          </h2>
          <div
            className="flex flex-col md:flex-row w-full"
            // style={{ display: "flex", flex: 1, flexDirection: "row" }}
          >
            <div
              className="flex flex-col md:flex-row w-full"
              style={{
                display: "flex",
                flex: 5,
                flexDirection: "column",
              }}
            >
              <img
                style={{ width: "100%" }}
                src={`/assets/Gallery/yorkshirebanner.png`}
                alt="Beautiful Room Image"
              />
              <div className="flex flex-row justify-evenly mt-4">
                <div>
                  <p className=" pt-2 pr-4 font-bold">Check In</p>
                  <p className="pr-4">{bookingInfo.startDate}</p>
                </div>
                <div>
                  <p className="pr-4 pt-2 font-bold">Check Out</p>
                  <p className="pr-4">{bookingInfo.endDate}</p>
                </div>
              </div>
              <div className="flex flex-row w-full justify-between">
                <h2
                  style={{
                    fontFamily: "Playfair Display",
                    fontWeight: "600",
                    fontSize: 24,
                    lineHeight: "129%",
                    letterSpacing: "0.035em",
                    color: "#000000",
                    paddingTop: "1rem",
                  }}
                >
                  {bookingInfo.itinerary.length > 1 ? "Rooms" : "Room"}
                </h2>
                <h2
                  style={{
                    fontFamily: "Playfair Display",
                    fontWeight: "600",
                    fontSize: 24,
                    lineHeight: "129%",
                    letterSpacing: "0.035em",
                    color: "#000000",
                    paddingTop: "1rem",
                  }}
                >
                  Guest Count
                </h2>
                <h2
                  style={{
                    fontFamily: "Playfair Display",
                    fontWeight: "600",
                    fontSize: 24,
                    lineHeight: "129%",
                    letterSpacing: "0.035em",
                    color: "#000000",
                    paddingTop: "1rem",
                  }}
                >
                  Dates/Price
                </h2>
              </div>

              {bookingInfo.itinerary.map((room: any) => (
                <div className="flex flex-row w-full justify-between mb-4">
                  <p className="mt-2 w-[200px] text-xl">{room.roomName}</p>
                  <p className="mt-2 text-xl">{room.guestCount}</p>
                  <div className="flex flex-col mt-2 text-xl">
                    {room.priceBreakdown.dailyPrices.map(
                      (obj: SpecialDatePrice) => (
                        <>
                          <div>
                            <span>{obj.date} - </span>
                            <span>
                              {obj.price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                              })}
                            </span>
                          </div>
                        </>
                      ),
                    )}
                  </div>
                </div>
              ))}
              <hr className="pv-4" />
              <div className="flex flex-row w-full justify-between">
                <p className="mt-4 font-semibold text-xl">Room Subtotal:</p>
                <p className="mt-4 font-semibold text-xl">
                  {calculateBookingPriceBreakdownField("subtotal")}
                </p>
              </div>
              <div className="flex flex-row w-full justify-between">
                <p className="mt-2 font-semibold text-xl">Taxes:</p>
                <p className="mt-2 font-semibold text-xl">
                  {calculateBookingPriceBreakdownField("tax")}
                </p>
              </div>
              <div className="flex flex-row w-full justify-between">
                <p className="mt-2 font-semibold text-xl">Booking Tax:</p>
                <p className="mt-2 font-semibold text-xl">
                  {calculateBookingPriceBreakdownField("bookingFee")}
                </p>
              </div>
              <hr />
              <div className="flex flex-row w-full justify-between">
                <p className="mt-8 font-semibold text-2xl">Booking Total:</p>
                <p className="mt-8 font-semibold text-2xl">
                  {calculateBookingPriceBreakdownField("total")}
                </p>
              </div>
              <div className="flex flex-row w-full justify-between">
                <p className="mt-8 font-semibold text-2xl">
                  Deposit due at checkout:
                </p>
                <p className="mt-8 font-semibold text-2xl">
                  {bookingInfo.itinerary
                    .map(
                      (room: any) => room.priceBreakdown.dailyPrices[0].price,
                    )
                    .reduce((sum: number, b: number) => sum + b, fees)
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                </p>
              </div>
            </div>
            <div
              className="mx-4"
              style={{
                display: "flex",
                flex: 6,
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h2
                className="pt-4"
                style={{
                  fontFamily: "Playfair Display",
                  fontWeight: "600",
                  fontSize: 32,
                  lineHeight: "129%",
                  letterSpacing: "0.035em",
                  color: "#000000",
                  paddingBottom: "1rem",
                  textAlign: "center",
                  width: "100%",
                }}
              >
                Customer Information
              </h2>
              <form className="w-full max-w-lg">
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      First Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-first-name"
                      type="text"
                      name="firstName"
                      value={formState.firstName}
                      style={
                        errors.includes("firstName")
                          ? { borderColor: "red" }
                          : {}
                      }
                      onChange={handleInputChange}
                    />
                    {/* TODO: Add error handling and validation */}
                    {/* <p className="text-red-500 text-xs italic">
                      Please fill out this field.
                    </p> */}
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name"
                    >
                      Last Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="text"
                      name="lastName"
                      value={formState.lastName}
                      onChange={handleInputChange}
                      style={
                        errors.includes("lastName")
                          ? { borderColor: "red" }
                          : {}
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-email"
                    >
                      Email
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-email"
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleInputChange}
                      style={
                        errors.includes("email") ? { borderColor: "red" } : {}
                      }
                    />
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-phone"
                    >
                      Phone
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-phone"
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleInputChange}
                      style={
                        errors.includes("phone") ? { borderColor: "red" } : {}
                      }
                    />
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-address"
                    >
                      Address
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-address"
                      type="text"
                      name="address"
                      value={formState.address}
                      onChange={handleInputChange}
                      style={
                        errors.includes("address") ? { borderColor: "red" } : {}
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      City
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-city"
                      type="text"
                      name="city"
                      value={formState.city}
                      onChange={handleInputChange}
                      style={
                        errors.includes("city") ? { borderColor: "red" } : {}
                      }
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-state"
                    >
                      State
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                        name="state"
                        value={formState.state}
                        onChange={handleInputChange}
                        style={
                          errors.includes("state") ? { borderColor: "red" } : {}
                        }
                      >
                        <option value="" selected disabled></option>
                        {states.map((state) => (
                          <option key={state.name} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-zip"
                    >
                      Zip
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-zip"
                      type="text"
                      name="zip"
                      value={formState.zip}
                      onChange={handleInputChange}
                      style={
                        errors.includes("zip") ? { borderColor: "red" } : {}
                      }
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-pets"
                    >
                      Are you traveling with a pet(s)
                    </label>
                    <input
                      className=""
                      id="grid-pets"
                      type="checkbox"
                      placeholder="90210"
                      checked={petCheck}
                      onChange={() => setPetCheck(!petCheck)}
                    />
                  </div>
                  {petCheck ? (
                    <div className="w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-pet-desc"
                      >
                        Please describe your pet(s)
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-pet-desc"
                        type="text"
                        name="petsDescription"
                        value={formState.petsDescription}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : null}
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-alergies"
                    >
                      Any Food Alergies?
                    </label>
                    <input
                      className=""
                      id="grid-alergies"
                      type="checkbox"
                      placeholder="90210"
                      checked={allergyCheck}
                      onChange={() => setAllergyCheck(!allergyCheck)}
                    />
                  </div>
                  {allergyCheck ? (
                    <div className="w-full px-3">
                      <label
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                        htmlFor="grid-allergies-desc"
                      >
                        Please Describe Your Allergies.
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-allergies-desc"
                        type="text"
                        name="allergiesDescription"
                        value={formState.allergiesDescription}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : null}
                </div>
                <div>
                  <Button
                    label={"Continue to Payment"}
                    onClick={(e: any) => handleSubmit(e)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformationForm;
