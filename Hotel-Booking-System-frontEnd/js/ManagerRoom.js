$(document).ready(function() {
  const roomRegisterForm = $('#room-register-form');
  const addRoomButton = $('#add-room');
  const closeButton = $('#room-register-close');
  const roomForm = $('#room-form');
  const tableBody = $('.room-table tbody');
  const formTitle = $('.room-register-title');
  const roomTypeDropdown = $('#roomTypeId');
  const hotelDropdown = $('#hotelId');
  let currentRoomId = null;
  let hotels = []; // Store hotels data
  let roomTypes = []; // Store room types data

  const openForm = function() {
    roomRegisterForm.css("display", "flex");
    formTitle.text(currentRoomId ? "Update Room" : "Register Room");
    if (!currentRoomId) {
      clearForm();
    }
  };

  const closeForm = () => {
    roomRegisterForm.css("display", "none");
    clearForm();
  };

  $('#room-register-submit').on('click', function(e) {
    e.preventDefault();
    saveRoom();
  });

  addRoomButton.on('click', openForm);
  closeButton.on('click', closeForm);

  $(window).on('click', function(event) {
    if (event.target === roomRegisterForm[0]) closeForm();
  });

  const getAuthToken = function() {
    return localStorage.getItem('authToken');
  };

  function getHotelNameById(hotelId) {
    if (hotels.length === 0) {
      console.warn("Hotels data not loaded yet.");
      return "Unknown Hotel";
    }

    const hotel = hotels.find(h => h.hotelId === hotelId);
    return hotel ? hotel.name : "Unknown Hotel";
  }

  // Function to get room type name by roomTypeId

  // Load hotel details into dropdown
  const loadHotels = function() {
    return $.ajax({
      url: 'http://localhost:8080/api/v1/hotel/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(result) {
        if (result.data && Array.isArray(result.data)) {
          hotels = result.data;
          hotelDropdown.html('<option value="">-- Select Hotel --</option>');
          result.data.forEach(function(hotel) {
            const option = $('<option></option>');
            option.val(hotel.hotelId);
            option.text(hotel.name || "Unknown");
            hotelDropdown.append(option);
          });
        } else {
          console.error("Error loading hotels:", result);
        }
      },
      error: function(error) {
        console.error("Error loading hotels:", error);
      }
    });
  };

  // Load room type details into dropdown
  const loadRoomType = function() {
    return $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(result) {
        console.log("Room Types Response:", result);
        if (result.data && Array.isArray(result.data)) {
          roomTypes = result.data;
          console.log("Room Types Array:", roomTypes);
          roomTypeDropdown.html('<option value="">-- Select RoomType --</option>');
          result.data.forEach(function(room) {
            const option = $('<option></option>');
            option.val(room.roomTypeId);  // Ensure the correct roomTypeId is used
            option.text(room.name || "Unknown");  // Ensure the name is properly assigned
            roomTypeDropdown.append(option);
          });
        } else {
          console.error("Error loading room types:", result);
        }
      },
      error: function(error) {
        console.error("Error loading room types:", error);
      }
    });
  };

// Function to get room type name by roomTypeId
  function getRoomTypeNameById(roomTypeId) {
    if (roomTypes.length === 0) {
      console.warn("Room Types data not loaded yet.");
      return "Unknown Room Type";
    }

    console.log("Looking for Room Type ID:", roomTypeId);  // Log the ID being searched for

    // Log all room types to inspect their structure
    roomTypes.forEach((roomType, index) => {
      console.log(`Room Type ${index}:`, roomType);
    });

    // Now let's check the roomTypeId more carefully
    const roomType = roomTypes.find(rt => rt.typeId && rt.typeId.trim() === roomTypeId.trim());

    if (roomType) {
      console.log("Room Type Found:", roomType);  // Log the found room type
      return roomType.name || "Unknown Room Type";
    } else {
      console.warn("Room Type ID not found:", roomTypeId);  // Log when no match is found
      return "Unknown Room Type";
    }
  }


  // Fetch rooms for the table
  const fetchRooms = function() {
    $.ajax({
      url: 'http://localhost:8080/api/v1/room/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(result) {
        tableBody.html("");
        if (result && result.data && Array.isArray(result.data)) {
          result.data.forEach(function(room) {
            addRoomToTable(room);
          });
        } else {
          console.error("Invalid data format received:", result);
        }
      },
      error: function(error) {
        console.error("Error fetching rooms:", error);
        alert("An error occurred while fetching rooms.");
      }
    });
  };

  // Add room data to table
  const addRoomToTable = function(room) {
    const row = $('<tr></tr>');
    row.html(`
      <td>${room.roomId || "N/A"}</td>
      <td>${getRoomTypeNameById(room.roomTypeId) || "Unknown"}</td>
      <td>${room.floorNumber || "N/A"}</td>
      <td>${getHotelNameById(room.hotelId) || "Unknown"}</td>
      <td>${room.availability ? "Available" : "Not Available"}</td>
      <td><span class="update-button">Update</span></td>
      <td><span class="delete-button">Delete</span></td>
    `);
    row.find('.update-button').on('click', function() {
      openUpdateForm(room);
    });
    row.find('.delete-button').on('click', function() {
      deleteRoom(room.roomId);
    });
    tableBody.append(row);
  };

  roomForm.on('submit', function(e) {
    e.preventDefault();
    if (currentRoomId) {
      updateHotel();
    } else {
      saveRoom();
    }
  });

  const saveRoom = function() {
    const roomData = {
      roomTypeId: roomTypeDropdown.val(),
      hotelId: hotelDropdown.val(),
      floorNumber: $('#floorNumber').val(),
      availability: $('#availability').is(':checked')
    };

    console.log("Attempting to save room with data:", roomData);
    console.log("Auth token:", getAuthToken());

    $.ajax({
      url: 'http://localhost:8080/api/v1/room/save',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(roomData),
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(response) {
        console.log("Room saved successfully:", response);
        fetchRooms();
        closeForm();
      },
      error: function(xhr, status, error) {
        console.error("Error saving room - Status:", status);
        console.error("Error saving room - Error:", error);
        console.error("Error saving room - Response:", xhr.responseText);
        alert("An error occurred while saving the room.");
      }
    });
  };
  const clearForm = function() {

    roomForm[0].reset();
    currentRoomId = null;
    roomTypeDropdown.val('');
    hotelDropdown.val('');
  }

  // Initial load sequence using $.ajax()
  $.when(loadHotels(), loadRoomType()).done(function() {
    fetchRooms(); // Only fetch rooms after both hotels and room types are loaded
  }).fail(function() {
    console.error("Error loading data");
  });
});
