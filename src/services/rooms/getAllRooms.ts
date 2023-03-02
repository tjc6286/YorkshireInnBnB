const getAllRooms: () => any = () => {
  fetch("/api/room/getAll")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
};

export default getAllRooms;
