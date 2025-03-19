document.addEventListener('DOMContentLoaded', () => {
  // Elements for the Room Registration Form
  const roomRegisterForm = document.getElementById('room-register-form');
  const addRoomButton = document.getElementById('add-room');
  const closeButton = document.getElementById('room-register-close');
  const roomForm = document.getElementById('room-form');
  const tableBody = document.querySelector('.room-table tbody');
  const formTitle = document.querySelector('.room-register-title');
  const hotelDropdown = document.getElementById('room-hotel-id');
  const roomTypeDropdown = document.getElementById('room-roomType-id'); // Ensure you have the dropdown element

  let currentRoomId = null;

  // Function to open the registration form
  const openForm = () => {
    console.log("Opening Room Form...");
    roomRegisterForm.style.display = "flex";
    formTitle.textContent = "Register Room ";
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

// load hotel details to dropdown
  $(document).ready(() => {
    $('#load-cus-ids').click((e) => {
      e.preventDefault();

      $.ajax({
        url: 'http://localhost:8080/api/v1/hotel/getAll', // Ensure this API is correct
        type: 'GET',
        success: (res) => {
          console.log("Response from server:", res);

          // Clear existing options
          $('#room-hotel-id').empty();

          // Add default option
          $('#room-hotel-id').append('<option value="">-- Select Hotel --</option>');

          // Check if data exists and is an array
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

    // Capture the selected hotel ID
    $('#room-roomType-id').change(function () {
      const selectedId = $(this).val();
      const selectedName = $(this).find("option:selected").text();
      console.log("Selected Hotel ID:", selectedId);
      console.log("Selected Hotel Name:", selectedName);
    });
  });


// load room type details to dropdown

  $('#load-hotel-ids').click((e) => {
    e.preventDefault();

    $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/getAll', // Updated URL
      type: 'GET',
      success: (res) => {
        console.log(res);

        // Clear existing options
        $('#room-roomType-id').empty();

        // Add default option
        $('#room-roomType-id').append('<option value="">-- Select roomType --</option>');

        // Check if data exists and is an array
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          res.data.forEach(roomType => {
            $('#room-roomType-id').append(
              `<option value="${roomType.typeId}">${roomType.description}</option>`
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


  // Capture the selected hotel ID
  $('#room-hotel-id').change(function () {
    const selectedId = $(this).val();
    const selectedName = $(this).find("option:selected").text();
    console.log("Selected RoomType ID:", selectedId);
    console.log("Selected roomType Name:", selectedName);
  });
});



// Fetch and display room data from the backend
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/room/getAll");
      if (!response.ok) throw new Error("Failed to fetch rooms");

      // Get raw response as text
      const rawText = await response.text();
      console.log("🔍 Raw Response from Backend:", rawText); // Debugging

      // Try parsing the JSON manually
      const result = JSON.parse(rawText);
      console.log("✅ Parsed JSON:", result); // Check if JSON is valid

      const rooms = result.data || [];
      tableBody.innerHTML = "";
      rooms.forEach(addRoomToTable);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("An error occurred while fetching rooms.");
    }
  };



// Function to dynamically add room to the table
  const addRoomToTable = (room) => {
    console.log("Room Data:", room); // Debugging line

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${room.roomId || "N/A"}</td>
        <td>${room.roomTypeId || "N/A"}</td>  <!-- ✅ Corrected -->
        <td>${room.floorNumber || "N/A"}</td>
        <td>${room.hotelId || "N/A"}</td>  <!-- ✅ Corrected -->
        <td>${room.availability ? "Available" : "Not Available"}</td>
        <td><span class="update-button"><i class="fas fa-edit">update</i></span></td>
        <td><span class="delete-button"><i class="fas fa-trash">delete</i></span></td>
    `;

    row.querySelector(".update-button").addEventListener("click", () => openUpdateForm(room));
    row.querySelector(".delete-button").addEventListener("click", () => deleteRoom(room.id));

    tableBody.appendChild(row);
  };

  // Save Room Type (Create or Update)
  roomForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const availability = document.getElementById("room-availability").value;
    const floorNumber = document.getElementById("room-floor-number").value;
    const hotelId = document.getElementById("room-hotel-id").value;
    const roomTypeId = document.getElementById("room-roomType-id").value;

    const roomData = {
      availability: availability === "true", // Ensure boolean conversion
      floorNumber: parseInt(floorNumber), // Ensure it's a number
      hotelId: hotelId,
      roomTypeId: roomTypeId
    };

    try {
      const url = currentRoomId
        ? `http://localhost:8080/api/v1/room/update/${currentRoomId}`
        : "http://localhost:8080/api/v1/room/save";
      const method = currentRoomId ? "PATCH" : "POST"; // PATCH for update, POST for create

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json", //  Send JSON
        },
        body: JSON.stringify(roomData), //  Convert data to JSON
      });

      if (!response.ok) throw new Error(`Failed to save room: ${response.statusText}`);

      await fetchRooms(); // Refresh room list
      closeForm(); // Close the form
      currentRoomId = null; // Reset room ID after saving
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

  // Delete room
  const deleteRoom = async (id) => {
    if (!confirm("Are you sure you want to remove this room?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/room/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      //  Check if the response is okay
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to remove room: ${errorText}`);
      }
      fetchRooms();
      //  Handle successful deletion
    } catch (error) {
      console.error(" Error removing room:", error);
      alert("An error occurred while removing the room.");
    }
  };


  // Initial fetches
  fetchRooms();

});
