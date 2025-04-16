$(document).ready(function () {
  const roomRegisterForm = $('#room-register-form');
  const addRoomButton = $('#add-room');
  const closeButton = $('#room-register-close');
  const roomForm = $('#room-form');
  const tableBody = $('.room-table tbody');
  const formTitle = $('.room-register-title');
  const roomTypeDropdown = $('#roomTypeId');
  const hotelDropdown = $('#hotelId');
  let currentRoomId = null;
  let hotels = [];
  let roomTypes = [];

  const openForm = function () {
    roomRegisterForm.css("display", "flex");
    formTitle.text(currentRoomId ? "Update Room" : "Register Room");
    if (!currentRoomId) clearForm();
    console.log("Room Type Dropdown Value on Open Form:", roomTypeDropdown.val());

  };

  const closeForm = () => {
    roomRegisterForm.css("display", "none");
    clearForm();
  };

  addRoomButton.on('click', openForm);
  closeButton.on('click', closeForm);

  $(window).on('click', function (event) {
    if (event.target === roomRegisterForm[0]) closeForm();
  });

  const getAuthToken = () => localStorage.getItem('authToken');

  const getHotelNameById = (hotelId) => {
    const hotel = hotels.find(h => h.hotelId === hotelId);
    return hotel ? hotel.name : "Unknown Hotel";
  };

  const getRoomTypeNameById = (roomTypeId) => {
    const roomType = roomTypes.find(rt => rt.typeId && rt.typeId.trim() === roomTypeId.trim());
    return roomType ? roomType.name : "Unknown Room Type";
  };

  const loadHotels = function () {
    return $.ajax({
      url: 'http://localhost:8080/api/v1/hotel/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function (result) {
        if (result.data && Array.isArray(result.data)) {
          hotels = result.data;
          hotelDropdown.html('<option value="">-- Select Hotel --</option>');
          result.data.forEach(hotel => {
            const option = $('<option></option>').val(hotel.hotelId).text(hotel.name || "Unknown");
            hotelDropdown.append(option);
          });
        }
        console.log("Loaded Hotels:", hotels); // Log loaded hotels
      },
      error: function (error) {
        console.error("Error loading hotels:", error);
      }
    });
  };

  const loadRoomTypes = function () {
    return $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function (result) {
        if (result.data && Array.isArray(result.data)) {
          roomTypes = result.data;
          roomTypeDropdown.html('<option value="">-- Select Room Type --</option>');
          result.data.forEach(room => {
            const option = $('<option></option>').val(room.typeId).text(room.name || "Unknown");
            roomTypeDropdown.append(option);
          });

          // Log the room type dropdown value to ensure it's populated correctly
          console.log("Room Type Dropdown populated. Current Value:", roomTypeDropdown.val());
        }
      },
      error: function (error) {
        console.error("Error loading room types:", error);
      }
    });
  };

  const fetchRooms = function () {
    $.ajax({
      url: 'http://localhost:8080/api/v1/room/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function (result) {
        tableBody.html("");
        if (result && result.data && Array.isArray(result.data)) {
          result.data.forEach(addRoomToTable);
        }
      },
      error: function (error) {
        console.error("Error fetching rooms:", error);
        alert("An error occurred while fetching rooms.");
      }
    });
  };

  const addRoomToTable = function (room) {
    const row = $('<tr></tr>');
    row.html(`
      <td>${room.roomId || "N/A"}</td>
      <td>${getRoomTypeNameById(room.roomTypeId)}</td>
      <td>${room.floorNumber || "N/A"}</td>
      <td>${getHotelNameById(room.hotelId)}</td>
      <td><span class="update-button">Update</span></td>
      <td><span class="delete-button">Delete</span></td>
    `);
    row.find('.update-button').on('click', function () {
      openUpdateForm(room);
    });
    row.find('.delete-button').on('click', function () {
      deleteRoom(room.roomId);
    });
    tableBody.append(row);
  };

  const clearForm = function () {
    roomForm[0].reset();
    currentRoomId = null;
    roomTypeDropdown.val('');
    hotelDropdown.val('');
  };

  const saveRoom = function () {
    const roomTypeId = roomTypeDropdown.val();
    const hotelId = hotelDropdown.val();
    const floorNumber = $('#room-floor-number').val();

    console.log("Selected Room Type ID:", roomTypeId); // Log room type id selected
    console.log("hotelId:", hotelId);
    console.log("floorNumber:", floorNumber);

    if (!roomTypeId || !hotelId || !floorNumber) {
      alert("Please fill all the fields!");
      return;
    }

    const roomData = {
      roomTypeId,
      hotelId,
      floorNumber: parseInt(floorNumber),
    };

    console.log("Saving room with data:", roomData);

    $.ajax({
      url: 'http://localhost:8080/api/v1/room/save',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(roomData),
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function (response) {
        alert("Room saved successfully!");
        fetchRooms();
        closeForm();
      },
      error: function (xhr, status, error) {
        console.error("Error saving room:", xhr.responseText);
        alert("Save failed: " + (xhr.responseJSON?.message || xhr.responseText || status));
      }
    });
  };

  const updateRoom = function () {
    const roomData = {
      roomId: currentRoomId,
      roomTypeId: roomTypeDropdown.val(),
      hotelId: hotelDropdown.val(),
      floorNumber: $('#room-floor-number').val(),
    };
    console.log("Updating room with data:", roomData);

    $.ajax({
      url: 'http://localhost:8080/api/v1/room/update',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(roomData),
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function (response) {
        fetchRooms();
        closeForm();
      },
      error: function (xhr, status, error) {
        console.error("Error updating room:", xhr.responseText);
        alert("Update failed: " + (xhr.responseJSON?.message || xhr.responseText || status));
      }
    });
  };

  const openUpdateForm = function (room) {
    currentRoomId = room.roomId;
    roomTypeDropdown.val(room.roomTypeId);
    hotelDropdown.val(room.hotelId);
    $('#room-floor-number').val(room.floorNumber);
    openForm();
  };

  const deleteRoom = function (roomId) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/room/delete/${roomId}`,
      type: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function () {
        fetchRooms();
      },
      error: function (xhr) {
        alert("Failed to delete room: " + (xhr.responseJSON?.message || xhr.responseText));
      }
    });
  };

  // Handle form submit once only
  roomForm.on('submit', function (e) {
    e.preventDefault();
    if (currentRoomId) {
      updateRoom();
    } else {
      saveRoom();
    }
  });

  // Load everything initially
  $.when(loadHotels(), loadRoomTypes()).done(fetchRooms);
});
