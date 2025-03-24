const tableBody = document.querySelector(".room-table tbody");


// Fetch Room Types
const fetchRooms = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/roomTypeController/getAll");
    if (!response.ok) throw new Error("Failed to fetch room types");

    const result = await response.json();
    const rooms = result.data || []; // Ensure it's an array
    tableBody.innerHTML = "";
    rooms.forEach(addRoomToTable);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    alert("An error occurred while fetching room types.");
  }
};

// Add Room Type to Table
const addRoomToTable = (room) => {
  console.log("Room Data:", room); // Debugging line

  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${room.roomId || room.typeId || "N/A"}</td>
        <td>${room.description || "N/A"}</td>
        <td>${room.price || "N/A"}</td>
        <td>${room.qtyOnHand || "N/A"}</td>
        <td>
            <img src="data:image/png;base64,${room.image || ''}"
                 alt="Room Image"
                 class="room-image-table" />
        </td>

    `;

  tableBody.appendChild(row);
};
// Fetch Initial Data
fetchRooms();
