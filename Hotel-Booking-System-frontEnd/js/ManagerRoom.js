document.addEventListener('DOMContentLoaded', () => {
  // Elements for the Room Registration Form
  const roomRegisterForm = document.getElementById('room-register-form');
  const addRoomButton = document.getElementById('add-room');
  const closeButton = document.getElementById('room-register-close');
  const roomForm = document.getElementById('room-form');
  const tableBody = document.querySelector('.room-table tbody');
  const formTitle = document.querySelector('.room-register-title');
  const hotelDropdown = document.getElementById('room-hotel-id');
  const roomTypeDropdown = document.getElementById('room-roomType-id');

  let currentRoomId = null;

  // Function to open the registration form
  const openForm = () => {
    console.log("Opening Room Form...");
    roomRegisterForm.style.display = "flex";
    formTitle.textContent = "Register Room";
    currentRoomId = null;
    clearForm();
  };

  // Function to close the registration form
  const closeForm = () => {
    console.log("Closing Room Form...");
    roomRegisterForm.style.display = "none";
    clearForm();
  };

  addRoomButton?.addEventListener("click", openForm);
  closeButton?.addEventListener("click", closeForm);

  // Close the form when clicking outside it
  window.addEventListener('click', (event) => {
    if (event.target === roomRegisterForm) {
      closeForm();
    }
  });

  // Load hotel details into dropdown
  $(document).ready(() => {
    $('#load-cus-ids').click((e) => {
      e.preventDefault();

      $.ajax({
        url: 'http://localhost:8080/api/v1/hotel/getAll',
        type: 'GET',
        success: (res) => {
          console.log("Response from server:", res);
          $('#room-hotel-id').empty();
          $('#room-hotel-id').append('<option value="">-- Select Hotel --</option>');

          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach(hotel => {
              $('#room-hotel-id').append(
                `<option value="${hotel.hotelId}">${hotel.description}</option>`
              );
            });
          } else {
            console.log("No hotel data found in response");
          }
        },
        error: (err) => {
          console.error("Error fetching hotel IDs:", err);
        }
      });
    });
  });

  // Load room type details into dropdown
  $('#load-hotel-ids').click((e) => {
    e.preventDefault();

    $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/getAll',
      type: 'GET',
      success: (res) => {
        console.log(res);
        $('#room-roomType-id').empty();
        $('#room-roomType-id').append('<option value="">-- Select Room Type --</option>');

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach(roomType => {
            $('#room-roomType-id').append(
              `<option value="${roomType.typeId}">${roomType.description}</option>`
            );
          });
        } else {
          console.log("No room type data found in response");
        }
      },
      error: (err) => {
        console.error("Error fetching room types:", err);
      }
    });
  });

  // Fetch and display room data
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/room/getAll");
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
        <td><span class="update-button"><i class="fas fa-edit">update</i></span></td>
        <td><span class="delete-button"><i class="fas fa-trash">delete</i></span></td>
    `;

    row.querySelector(".update-button").addEventListener("click", () => openUpdateForm(room));
    row.querySelector(".delete-button").addEventListener("click", () => deleteRoom(room.roomId));

    tableBody.appendChild(row);
  };

  // Save or Update Room
  roomForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const availability = document.getElementById("room-availability").value;
    const floorNumber = document.getElementById("room-floor-number").value;
    const hotelId = document.getElementById("room-hotel-id").value;
    const roomTypeId = document.getElementById("room-roomType-id").value;

    const roomData = {
      availability: availability === "true",
      floorNumber: parseInt(floorNumber),
      hotelId: hotelId,
      roomTypeId: roomTypeId
    };

    try {
      const url = currentRoomId
        ? `http://localhost:8080/api/v1/room/update/${currentRoomId}`
        : "http://localhost:8080/api/v1/room/save";
      const method = currentRoomId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (!response.ok) throw new Error(`Failed to save room: ${response.statusText}`);

      await fetchRooms();
      closeForm();
      currentRoomId = null;
    } catch (error) {
      console.error("Error saving room:", error);
      alert(error.message);
    }
  });

  // Clear the form
  const clearForm = () => {
    roomForm.reset();
    currentRoomId = null;
  };

  // ✅ Fixed Delete Room Function
  const deleteRoom = async (id) => {
    if (!id) {
      console.error("Invalid room ID:", id);
      return;
    }

    if (!confirm("Are you sure you want to delete this room?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/room/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(`Failed to delete room: ${result.message}`);
      }

      console.log(`Room with ID ${id} deleted successfully.`);

      const roomElement = document.getElementById(`room-${id}`);
      if (roomElement) {
        roomElement.remove();
      } else {
        console.warn(`Room element with ID "room-${id}" not found in DOM.`);
      }

      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert(error.message);
    }
  };

  // Initial Fetch
  fetchRooms();
});
