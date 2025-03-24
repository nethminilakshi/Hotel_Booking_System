const tableBody = document.querySelector('.room-table tbody');

// Fetch and display room data
const fetchRooms = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/roomController/getAll");
    if (!response.ok) throw new Error("Failed to fetch rooms");

    const rawText = await response.text();
    console.log("Raw Response from Backend:", rawText);
    const result = JSON.parse(rawText);
    console.log("Parsed JSON:", result);

    const rooms = result.data || [];
    tableBody.innerHTML = "";
    rooms.forEach(addRoomToTable);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    alert("An error occurred while fetching rooms.");
  }
};

// Function to dynamically add a room to the table
const addRoomToTable = (room) => {
  console.log("Room Data:", room);

  const row = document.createElement("tr");
  row.id = `room-${room.roomId}`; //  Add ID to the row for easy deletion

  row.innerHTML = `
        <td>${room.roomId || "N/A"}</td>
        <td>${room.roomTypeId || "N/A"}</td>
        <td>${room.floorNumber || "N/A"}</td>
        <td>${room.hotelId || "N/A"}</td>
        <td>${room.availability ? "Available" : "Not Available"}</td>

    `;

  tableBody.appendChild(row);
};

// Initial Fetch
fetchRooms();
