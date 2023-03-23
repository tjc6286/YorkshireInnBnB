import React from "react";
import type { Room } from "../../../types/room";

interface CustomerInformationFormProps {
  bookingInfo: string;
  images?: Array<any>;
}

const CustomerInformationForm: React.FC<CustomerInformationFormProps> = ({
  bookingInfo,
  images,
}) => {
  const [roomInfo, setRoomInfo] = React.useState<Room>({} as Room);
  const [loading, setLoading] = React.useState<boolean>(false);

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

  React.useEffect(() => {
    const roomID = bookingInfo.split("-")[0];
    fetchRoomInfo(roomID);
  }, []);

  console.log(roomInfo);
  return loading ? (
    <div>Loading...</div>
  ) : (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100dvh",
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
                backgroundColor: "blue",
              }}
            >
              {roomInfo ? (
                <img
                  style={{ width: "100%" }}
                  src={`/assets/Gallery/${roomInfo.imgPathName}`}
                  alt="Beautiful Room Image"
                />
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                flex: 8,
                flexDirection: "row",
                backgroundColor: "green",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInformationForm;
