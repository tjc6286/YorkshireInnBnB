import { CircularProgress } from "@mui/material";
import format from "date-fns/format";
import React from "react";
import { states } from "../../../data/states";
import type { Room } from "../../../types/room";
import Button from "../../atoms/button";

interface CustomerInformationFormProps {
  bookingInfo: string;
}

interface IFormState {
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
}

const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({
  bookingInfo,
}) => {
  const [roomInfo, setRoomInfo] = React.useState<Room>({} as Room);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sDate, setSDate] = React.useState<string>("");
  const [eDate, setEDate] = React.useState<string>("");

  const [petCheck, setPetCheck] = React.useState<boolean>(false);
  const [allergyCheck, setAllergyCheck] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<string[]>([]);

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

  const fetchRoomInfo = async (roomId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/room/getById", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: roomId }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRoomInfo(data[0]);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

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

    alert(JSON.stringify(formState));
  };

  React.useEffect(() => {
    const roomID = bookingInfo.split("-")[0];
    const startDate = bookingInfo.split("-")[1];
    const endDate = bookingInfo.split("-")[2];
    setSDate(format(new Date(startDate), "MM/dd/yyyy"));
    setEDate(format(new Date(endDate), "MM/dd/yyyy"));
    fetchRoomInfo(roomID);
  }, []);

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
      style={{
        display: "flex",
        width: "100%",
        height: "140dvh",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
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
            Selected Room
          </h2>
          <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                flex: 5,
                flexDirection: "column",
              }}
            >
              <img
                style={{ width: "100%" }}
                src={`/assets/Gallery/${roomInfo.imgPathName}`}
                alt="Beautiful Room Image"
              />
              <h2 className="text-2xl font-bold py-3">{roomInfo.name}</h2>
              <p className="pr-4">{roomInfo.description}</p>
              <div className="flex flex-row justify-around">
                <div>
                  <p className=" pt-2 pr-4 font-bold">FROM:</p>
                  <p className="pr-4">{sDate}</p>
                </div>
                <div>
                  <p className="pr-4 pt-2 font-bold">TO:</p>
                  <p className="pr-4">{eDate}</p>
                </div>
              </div>
              <p className="mt-4 pr-4 font-semibold text-xl">
                Price/Night: ${roomInfo.basePrice}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flex: 8,
                flexDirection: "column",
                alignItems: "center",
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
