$(document).ready(function () {
  const hotelDropdown = $('#hotelId');
  const roomTypeSelect = $('#roomTypeSelect');
  const roomAvailabilityInfo = $('#roomAvailabilityInfo');
  const checkinDateInput = $('#checkinDate');
  const checkoutDateInput = $('#checkoutDate');
  const timeSlotSelect = $('#timeSlotSelect');
  const bookRoomButton = $('#bookRoomButton');
  const roomQtyInput = $('#roomQtyInput');

  const getAuthToken = () => localStorage.getItem('authToken');
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  $('#openRegisterBtn').on('click', function () {
    $('#registerModal').modal('show');
  });

  function loadHotels() {
    $.ajax({
      url: 'http://localhost:8080/api/v1/hotel/getAll',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (result) {
        hotelDropdown.html('<option value="">-- Select Hotel --</option>');
        result.data.forEach(hotel => {
          hotelDropdown.append(`<option value="${hotel.hotelId}">${hotel.name}</option>`);
        });

        const pending = JSON.parse(localStorage.getItem('pendingBooking'));
        if (pending?.hotelId) {
          hotelDropdown.val(pending.hotelId).trigger('change');
        }
      },
      error: () => console.error("Hotel loading failed.")
    });
  }

  function loadRoomTypes(hotelId) {
    if (!hotelId) return;
    $.ajax({
      url: `http://localhost:8080/api/v1/room/roomTypesByHotel/${hotelId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (res) {
        roomTypeSelect.html('<option value="">-- Select Room Type --</option>');
        res.data.forEach(rt => {
          roomTypeSelect.append(`<option value="${rt.roomTypeId}">${rt.roomTypeName}</option>`);
        });

        const pending = JSON.parse(localStorage.getItem('pendingBooking'));
        if (pending?.roomTypeId) {
          roomTypeSelect.val(pending.roomTypeId);
        }

        updateRoomAvailability();
      },
      error: () => console.error("Room types load failed.")
    });
  }

  function updateRoomAvailability() {
    const hotelId = hotelDropdown.val();
    const roomTypeId = roomTypeSelect.val();
    const checkinDate = checkinDateInput.val();
    const checkoutDate = checkoutDateInput.val();
    const timeSlot = timeSlotSelect.val();

    if (!hotelId || !roomTypeId || !checkinDate || !checkoutDate || !timeSlot) {
      roomAvailabilityInfo.text('Please complete booking details.');
      bookRoomButton.prop('disabled', true);
      return;
    }

    $.ajax({
      url: 'http://localhost:8080/api/v1/Booking/availability',
      method: 'GET',
      data: { hotelId, roomTypeId, checkinDate, checkoutDate, time: timeSlot },
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (res) {
        const available = res.data || 0;
        roomAvailabilityInfo.text(`Available Rooms: ${available}`);
        bookRoomButton.prop('disabled', available <= 0);

        // Update room quantity max value
        roomQtyInput.attr('max', available);
        if (parseInt(roomQtyInput.val()) > available) {
          roomQtyInput.val(available);
        }
      },
      error: () => {
        roomAvailabilityInfo.text('Error checking availability.');
        bookRoomButton.prop('disabled', true);
      }
    });
  }

  // Book Room Button Click Handler
  bookRoomButton.on('click', function () {
    console.log("Book Room button clicked");

    // Store booking details in localStorage
    const bookingInputs = {
      hotelId: hotelDropdown.val(),
      roomTypeId: roomTypeSelect.val(),
      checkinDate: checkinDateInput.val(),
      checkoutDate: checkoutDateInput.val(),
      timeSlot: timeSlotSelect.val(),
      roomQty: roomQtyInput.val() || 1
    };

    if (Object.values(bookingInputs).some(val => !val)) {
      alert("Please fill in all booking details.");
      return;
    }

    localStorage.setItem('pendingBooking', JSON.stringify(bookingInputs));

    // Show the check user modal for everyone
    $('#checkUserModal').modal('show');
  });

  // Handle Check User Submit button click in modal
  $('#checkUserSubmit').on('click', function () {
    const email = $('#checkUserEmail').val().trim();
    const contact = $('#checkUserContact').val().trim();

    if (!email || !contact) {
      alert("Please enter both email and contact number.");
      return;
    }

    // Log the values for debugging
    console.log("Checking user with email:", email, "and contact:", contact);

    // Then process the data
    $.ajax({
      url: 'http://localhost:8080/api/v1/user/checkUser',
      method: 'GET',
      data: {
        email: email,
        contact: contact
      },
      success: function(response) {
        console.log("User check response:", response);

        // Close the modal
        $('#checkUserModal').modal('hide');

        // Check if the user exists based on the response structure
        if (response.data === true || response.userExists === true) {
          alert("User found successfully!");
          proceedWithBooking(getAuthToken(), email, contact);
        } else {
          alert('User not found, please register for a booking.');
          $('#registerModal').modal('show');
        }
      },
      error: function(xhr, status, error) {
        console.error("Error checking user:", xhr, status, error);
        alert('Error checking user. Please try again.');
      }
    });
  });

  function proceedWithBooking(token, email, contact) {
    const data = JSON.parse(localStorage.getItem('pendingBooking'));
    if (!data) return alert("Booking data not found!");

    // Make sure we have an auth token
    const authToken = token || getAuthToken();

    if (!authToken) {
      console.error("No authentication token available");
      alert("Authentication required. Please login first.");
      return;
    }

    const bookingData = {
      hotelId: data.hotelId,
      roomTypeId: data.roomTypeId,
      checkIn: data.checkinDate,
      checkOut: data.checkoutDate,
      time: data.timeSlot,
      quantity: parseInt(data.roomQty) || 1,
      status: 'PENDING',
      email: email,
      phoneNumber: contact
    };

    console.log("Sending booking data:", bookingData);
    console.log("Using token:", authToken);

    $.ajax({
      url: 'http://localhost:8080/api/v1/Booking/save',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      data: JSON.stringify(bookingData),
      success: function (response) {
        console.log("Booking response:", response);
        localStorage.removeItem('pendingBooking');
        alert("Booking successful!");

        // Optional: Redirect to a booking confirmation page
        // window.location.href = "booking-confirmation.html";
      },
      error: function (xhr, status, error) {
        console.error("Booking error:", xhr.responseText);
        alert("Booking failed. Please try again. " + (xhr.responseJSON?.message || error));
      }
    });
  }

  // Handle user registration
  $('#registerSubmitBtn').on('click', function () {
    const name = $("#nameSignUp").val().trim();
    const email = $("#emailSignUp").val().trim();
    const contact = $("#contactSignUp").val().trim();
    const password = $("#passwordSignUp").val().trim();
    const confirmPassword = $("#confPasswordSignUp").val().trim();

    if (!name || !email || !contact || !password || !confirmPassword) {
      return alert("All fields required!");
    }
    if (password !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    const userData = {
      name,
      email,
      contact,
      password,
      role: "USER"
    };

    $.ajax({
      url: 'http://localhost:8080/api/v1/user/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(userData),
      success: function (response) {
        console.log("Registration response:", response);
        $('#registerModal').modal('hide');

        // After registration, automatically login the user
        $.ajax({
          url: 'http://localhost:8080/api/v1/user/login',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ email: email, password: password }),
          success: function(loginRes) {
            console.log("Login response:", loginRes);
            if (loginRes.token) {
              localStorage.setItem('authToken', loginRes.token);
              alert("Registration successful!");
              proceedWithBooking(loginRes.token, email, contact);
            } else {
              alert("Registration successful but login failed. Please login manually.");
            }
          },
          error: function() {
            alert("Registration successful but login failed. Please login manually.");
          }
        });
      },
      error: function (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + (error.responseJSON?.message || "Unknown error"));
      }
    });
  });

  // Event listeners for form inputs
  hotelDropdown.on('change', () => loadRoomTypes(hotelDropdown.val()));
  roomTypeSelect.on('change', updateRoomAvailability);
  checkinDateInput.on('change', updateRoomAvailability);
  checkoutDateInput.on('change', updateRoomAvailability);
  timeSlotSelect.on('change', updateRoomAvailability);
  roomQtyInput.on('change', function() {
    const max = parseInt($(this).attr('max') || 1);
    const value = parseInt($(this).val() || 1);
    if (value > max) {
      $(this).val(max);
    } else if (value < 1) {
      $(this).val(1);
    }
  });

  // Set minimum date for check-in to today
  const today = new Date().toISOString().split('T')[0];
  checkinDateInput.attr('min', today);

  // Set minimum date for check-out to check-in date
  checkinDateInput.on('change', function() {
    checkoutDateInput.attr('min', $(this).val());
    if (checkoutDateInput.val() < $(this).val()) {
      checkoutDateInput.val($(this).val());
    }
  });

  // Load any pending booking data from localStorage
  const pending = JSON.parse(localStorage.getItem('pendingBooking'));
  if (pending) {
    checkinDateInput.val(pending.checkinDate);
    checkoutDateInput.val(pending.checkoutDate);
    timeSlotSelect.val(pending.timeSlot);
    roomQtyInput.val(pending.roomQty || 1);
  }

  // Initialize page data
  loadHotels();
});
