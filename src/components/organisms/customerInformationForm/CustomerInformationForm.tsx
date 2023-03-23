import React from "react";
import type { Room } from "../../../types/room";
import Button from "../../atoms/button";

interface CustomerInformationFormProps {
  bookingInfo: string;
}

const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({
  bookingInfo,
}) => {
  const [roomInfo, setRoomInfo] = React.useState<Room>({} as Room);
  const [loading, setLoading] = React.useState<boolean>(false);

  const [petCheck, setPetCheck] = React.useState<boolean>(false);
  const [allergyCheck, setAllergyCheck] = React.useState<boolean>(false);

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

  const handleSubmit = (event) => {
    //TODO: handle submit to send to stripe page and
    event.preventDefault();
    alert("test");
  };

  React.useEffect(() => {
    const roomID = bookingInfo.split("-")[0];
    fetchRoomInfo(roomID);
  }, []);

  console.log(roomInfo);
  return loading ? (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100dvh",
        justifyContent: "center",
      }}>
      Loading...
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "140dvh",
        justifyContent: "center",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
        }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            margin: "2rem",
            flexDirection: "column",
          }}>
          <h2
            style={{
              fontFamily: "Playfair Display",
              fontWeight: "600",
              fontSize: 32,
              lineHeight: "129%",
              letterSpacing: "0.035em",
              color: "#000000",
              paddingBottom: "1rem",
            }}>
            Selected Room
          </h2>
          <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                flex: 5,
                flexDirection: "column",
              }}>
              <img
                style={{ width: "100%" }}
                src={`/assets/Gallery/${roomInfo.imgPathName}`}
                alt="Beautiful Room Image"
              />
              <h2 className="text-2xl font-bold py-3">{roomInfo.name}</h2>
              <p className="pr-4">{roomInfo.description}</p>
            </div>
            <div
              style={{
                display: "flex",
                flex: 8,
                flexDirection: "column",
                alignItems: "center",
              }}>
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
                }}>
                Customer Information
              </h2>
              <form className="w-full max-w-lg">
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name">
                      First Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      placeholder="Jane"
                    />
                    {/* TODO: Add error handling and validation */}
                    {/* <p className="text-red-500 text-xs italic">
                      Please fill out this field.
                    </p> */}
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-last-name">
                      Last Name
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-last-name"
                      type="text"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password">
                      Email
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-password"
                    />
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password">
                      Phone
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-password"
                    />
                  </div>
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password">
                      Address
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-password"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-city">
                      City
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-city"
                      type="text"
                      placeholder="Albuquerque"
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-state">
                      State
                    </label>
                    <div className="relative">
                      <select
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state">
                        <option>New Mexico</option>
                        <option>Missouri</option>
                        <option>Texas</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-zip">
                      Zip
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-zip"
                      type="text"
                      placeholder="90210"
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-pets">
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
                        htmlFor="grid-pet-desc">
                        Please Describe your pets (Number | Species)
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-pet-desc"
                      />
                    </div>
                  ) : null}
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0 py-2">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-alergies">
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
                        htmlFor="grid-allergies-desc">
                        Please Describe Your Allergies.
                      </label>
                      <input
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-allergies-desc"
                      />
                    </div>
                  ) : null}
                </div>
                <div>
                  <Button
                    label={"Continue to Paymnet"}
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
