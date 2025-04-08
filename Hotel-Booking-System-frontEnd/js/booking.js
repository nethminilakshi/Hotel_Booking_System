$(document).ready(function () {
  const hotelDropdown = $('#hotelId');
  const roomTypeSelect = $('#roomTypeSelect');
  const roomAvailabilityInfo = $('#roomAvailabilityInfo');
  const checkinDateInput = $('#checkinDate');
  const checkoutDateInput = $('#checkoutDate');
  const timeSlotSelect = $('#timeSlotSelect');
  const bookRoomButton = $('#bookRoomButton');

  // Set events
  hotelDropdown.on('change', function () {
    const hotelId = hotelDropdown.val();
    console.log("Selected hotelId:", hotelId);
    loadRoomTypes(hotelId);
  });

  roomTypeSelect.on('change', updateRoomAvailability);
  checkinDateInput.on('change', updateRoomAvailability);
  checkoutDateInput.on('change', updateRoomAvailability);
  timeSlotSelect.on('change', updateRoomAvailability);

  // Function to get the authentication token
  const getAuthToken = function() {
    return localStorage.getItem('authToken');
  };

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
            console.log("Hotel object:", hotel);
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

  loadHotels();

  function loadRoomTypes(hotelId) {
    if (!hotelId) return;
    $.ajax({
      url: `http://localhost:8080/api/v1/room/roomTypesByHotel/${hotelId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function (response) {
        console.log("Room types response:", response);
        const roomTypes = response.data || [];

        roomTypeSelect.empty().append('<option value="">-- Select Room Type --</option>');

        roomTypes.forEach(rt => {
          roomTypeSelect.append(`<option value="${rt.roomTypeId}">${rt.roomTypeName}</option>`);
        });

        updateRoomAvailability();
      },
      error: function (err) {
        console.error("Failed to load room types", err);
      }
    });
  }

  function updateRoomAvailability() {
    const hotelId = hotelDropdown.val();
    const roomTypeId = roomTypeSelect.val();
    const checkinDate = checkinDateInput.val();
    const checkoutDate = checkoutDateInput.val();
    const timeSlot = timeSlotSelect.val();

    // Clear previous availability info
    roomAvailabilityInfo.text('').removeClass('text-success text-danger text-warning');

    // Only check availability if all required fields are filled
    if (!hotelId || !roomTypeId || !checkinDate || !checkoutDate) {
      return;
    }

    console.log("Checking availability for:", {
      hotelId,
      roomTypeId,
      checkinDate,
      checkoutDate,
      timeSlot
    });

    // Make API call to check availability
    $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: {
        hotelId: hotelId,
        roomTypeId: roomTypeId,
        checkInDate: checkinDate,
        checkOutDate: checkoutDate,
        timeSlot: timeSlot
      },
      success: function(response) {
        console.log("Availability response:", response);

        if (response.code === 200) {
          const availableRooms = response.data;

          if (availableRooms > 0) {
            roomAvailabilityInfo.html(`<strong>Available Rooms: ${availableRooms}</strong>`).addClass('text-success');
            bookRoomButton.prop('disabled', false);
          } else {
            roomAvailabilityInfo.html('<strong>No rooms available for selected dates</strong>').addClass('text-danger');
            bookRoomButton.prop('disabled', true);
          }
        } else {
          roomAvailabilityInfo.html('<strong>Error checking availability</strong>').addClass('text-warning');
          bookRoomButton.prop('disabled', true);
        }
      },
      error: function(err) {
        console.error("Error checking availability:", err);
        roomAvailabilityInfo.html('<strong>Error checking availability</strong>').addClass('text-warning');
        bookRoomButton.prop('disabled', true);
      }
    });
  }

  // Book Room functionality
  bookRoomButton.on('click', function() {
    const hotelId = hotelDropdown.val();
    const roomTypeId = roomTypeSelect.val();
    const checkinDate = checkinDateInput.val();
    const checkoutDate = checkoutDateInput.val();
    const timeSlot = timeSlotSelect.val();

    if (!hotelId || !roomTypeId || !checkinDate || !checkoutDate) {
      alert('Please fill all required fields');
      return;
    }

    const bookingData = {
      hotelId: hotelId,
      roomTypeId: roomTypeId,
      checkInDate: checkinDate,
      checkOutDate: checkoutDate,
      timeSlot: timeSlot
      // Add any other booking details you need (user info, etc.)
    };

    $.ajax({
      url: 'http://localhost:8080/api/v1/booking/save',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: JSON.stringify(bookingData),
      success: function(response) {
        console.log("Booking response:", response);

        if (response.code === 200 || response.code === 201) {
          alert('Booking successful!');
          // Redirect to booking confirmation or booking list page
          // window.location.href = 'booking-confirmation.html?id=' + response.data.bookingId;
        } else {
          alert('Booking failed: ' + (response.message || 'Unknown error'));
        }
      },
      error: function(err) {
        console.error("Error making booking:", err);
        alert('Booking failed. Please try again later.');
      }
    });
  });
});
