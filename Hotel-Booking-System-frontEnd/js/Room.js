// Function to load hotels
function loadHotelsForRooms() {
$.ajax({
  url: 'http://localhost:8080/api/v1/hotel/getAll',  // Replace with your actual API URL
  type: 'GET',
  success: function(response) {
    console.log('Response from API:', response);
    console.log('Data from response:', response.data);

    if (response && Array.isArray(response.data)) {
      const hotels = response.data;
      let hotelDropdown = $('#hotel_id');
      hotelDropdown.empty();
      hotelDropdown.append('<option value="">Select a Hotel</option>');

      hotels.forEach(hotel => {
        let option = `<option value="${hotel.hotelId}">${hotel.name}</option>`;
        hotelDropdown.append(option);
      });
    } else {
      console.error('Expected an array but got:', response);
    }
  },
  error: function(error) {
    console.error('Error loading hotels:', error);
  }
});
}

$(document).ready(function () {
  loadHotelsForRooms();  // This will load hotels once the document is ready
  loadRoomTypes();
  loadRooms();

  // Form event listeners
  document.getElementById("addRoomForm").addEventListener("submit", function (e) {
    e.preventDefault();
    addRoom();
  });

  document.getElementById("updateRoomForm").addEventListener("submit", function (e) {
    e.preventDefault();
    updateRoom();
  });

  document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
    deleteRoom();
  });
});

// Function to load room types
function loadRoomTypes() {
  fetch("http://localhost:8080/api/v1/roomType/getAll")
    .then(response => response.json())
    .then(data => {
      const roomTypeSelect = document.getElementById("roomType");
      const updateRoomTypeSelect = document.getElementById("updateRoomType");
      roomTypeSelect.innerHTML = "<option value='' disabled selected>Select Room Type</option>";
      updateRoomTypeSelect.innerHTML = roomTypeSelect.innerHTML;
      data.forEach(roomType => {
        const option = `<option value="${roomType.roomTypeId}">${roomType.typeName}</option>`;
        roomTypeSelect.innerHTML += option;
        updateRoomTypeSelect.innerHTML += option;
      });
    });
}

// Function to load rooms
function loadRooms() {
  fetch("http://localhost:8080/api/v1/room/getAll")
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById("roomTableBody");
      tableBody.innerHTML = "";
      data.forEach(room => {
        tableBody.innerHTML += `
          <tr>
            <td>${room.roomId}</td>
            <td>${room.roomType.roomTypeId}</td>
            <td>${room.floorNumber}</td>
            <td>${room.hotel.hotelId}</td>
            <td>${room.availability ? "Available" : "Not Available"}</td>
            <td>
              <button class='btn btn-warning' onclick='editRoom(${room.roomId})'>Edit</button>
              <button class='btn btn-danger' onclick='confirmDelete(${room.roomId})'>Delete</button>
            </td>
          </tr>`;
      });
    });
}

// Function to add a room
function addRoom() {
  const room = {
    roomTypeId: document.getElementById("roomType").value,
    floorNumber: document.getElementById("floorNumber").value,
    hotelId: document.getElementById("hotel").value,
    availability: document.getElementById("availability").value === "true"
  };
  fetch("http://localhost:8080/api/v1/room/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room)
  }).then(() => {
    loadRooms();
    document.getElementById("addRoomForm").reset();
    bootstrap.Modal.getInstance(document.getElementById("addRoomModal")).hide();
  });
}

// Function to edit a room
function editRoom(roomId) {
  fetch(`http://localhost:8080/api/v1/room/${roomId}`)
    .then(response => response.json())
    .then(room => {
      document.getElementById("updateRoomId").value = room.roomId;
      document.getElementById("updateRoomType").value = room.roomType.roomTypeId;
      document.getElementById("updateFloorNumber").value = room.floorNumber;
      document.getElementById("updateHotel").value = room.hotel.hotelId;
      document.getElementById("updateAvailability").value = room.availability.toString();
      new bootstrap.Modal(document.getElementById("updateRoomModal")).show();
    });
}

// Function to update a room
function updateRoom() {
  const roomId = document.getElementById("updateRoomId").value;
  const room = {
    roomTypeId: document.getElementById("updateRoomType").value,
    floorNumber: document.getElementById("updateFloorNumber").value,
    hotelId: document.getElementById("updateHotel").value,
    availability: document.getElementById("updateAvailability").value === "true"
  };
  fetch(`http://localhost:8080/api/v1/room/${roomId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room)
  }).then(() => {
    loadRooms();
    bootstrap.Modal.getInstance(document.getElementById("updateRoomModal")).hide();
  });
}

// Function to confirm delete
function confirmDelete(roomId) {
  document.getElementById("deleteRoomId").value = roomId;
  new bootstrap.Modal(document.getElementById("deleteRoomModal")).show();
}

// Function to delete a room
function deleteRoom() {
  const roomId = document.getElementById("deleteRoomId").value;
  fetch(`http://localhost:8080/api/v1/room/${roomId}`, { method: "DELETE" })
    .then(() => {
      loadRooms();
      bootstrap.Modal.getInstance(document.getElementById("deleteRoomModal")).hide();
    });
}
