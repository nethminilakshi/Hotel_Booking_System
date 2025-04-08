$(document).ready(function () {
  const hotelDropdown = $('#hotelId');
  const roomTypeSelect = $('<select id="roomTypeSelect" class="form-control mt-3"></select>').insertAfter('#timeSlotSelect');
  const roomAvailabilityInfo = $('<div id="roomAvailabilityInfo" class="mt-2 text-success font-weight-bold"></div>').insertAfter(roomTypeSelect);

  hotelDropdown.on('change', function () {
    const hotelId = hotelDropdown.val();
    console.log("Selected hotelId:", hotelId);
    loadRoomTypes(hotelId);
  });

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
            // Change this line - use hotelId instead of id
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
          // Use roomTypeName instead of name
          roomTypeSelect.append(`<option value="${rt.roomTypeId}">${rt.roomTypeName}</option>`);
        });

        updateRoomAvailability();
      },
      error: function (err) {
        console.error("Failed to load room types", err);
      }
    });
  }  // the rest of your updateRoomAvailability and event bindings...
});
