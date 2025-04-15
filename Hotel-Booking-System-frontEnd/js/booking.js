$(document).ready(function () {
  const hotelDropdown = $('#hotelId');
  const roomTypeSelect = $('#roomTypeSelect');
  const roomAvailabilityInfo = $('#roomAvailabilityInfo');
  const checkinDateInput = $('#checkinDate');
  const checkoutDateInput = $('#checkoutDate');
  const timeSlotSelect = $('#timeSlotSelect');
  const bookRoomButton = $('#bookRoomButton');

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


  //  Load hotels
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

  // Load room types by hotel
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

  // Update room availability
  function updateRoomAvailability() {
    const hotelId = hotelDropdown.val();
    const roomTypeId = roomTypeSelect.val();
    const checkinDate = checkinDateInput.val();
    const checkoutDate = checkoutDateInput.val();
    const timeSlot = timeSlotSelect.val();

    if (!hotelId || !roomTypeId || !checkinDate || !checkoutDate) return;

    $.ajax({
      url: 'http://localhost:8080/api/v1/Booking/availability',
      method: 'GET',
      data: { hotelId, roomTypeId, checkinDate, checkoutDate, time: timeSlot },
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (res) {
        const available = res.data || 0;
        roomAvailabilityInfo.text(`Available Rooms: ${available}`);
        bookRoomButton.prop('disabled', available <= 0);
      },
      error: () => roomAvailabilityInfo.text('Error checking availability.')
    });
  }

  //  Booking button click
  bookRoomButton.on('click', function () {
    const bookingInputs = {
      hotelId: hotelDropdown.val(),
      roomTypeId: roomTypeSelect.val(),
      checkinDate: checkinDateInput.val(),
      checkoutDate: checkoutDateInput.val(),
      timeSlot: timeSlotSelect.val()
    };

    if (Object.values(bookingInputs).some(val => !val)) {
      alert("Please fill in all booking details.");
      return;
    }

    localStorage.setItem('pendingBooking', JSON.stringify(bookingInputs));
    const token = getAuthToken();
    if (!token) {
      $('#registerModal').modal('show');
      return;
    }

    const decoded = parseJwt(token);
    if (!decoded?.sub) {
      localStorage.removeItem('authToken');
      $('#registerModal').modal('show');
      return;
    }

    proceedWithBooking(token, decoded.sub, decoded.contact || "0000000000");
  });

  // 🛒 Proceed with booking (after auth)
  function proceedWithBooking(token, email, contact) {
    const data = JSON.parse(localStorage.getItem('pendingBooking'));
    if (!data) return alert("Booking data not found!");

    const bookingData = {
      hotelId: data.hotelId,
      roomTypeId: data.roomTypeId,
      checkIn: data.checkinDate,
      checkOut: data.checkoutDate,
      time: data.timeSlot,
      status: 'PENDING',
      email,
      phoneNumber: contact
    };

    $.ajax({
      url: 'http://localhost:8080/api/v1/Booking/save',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: JSON.stringify(bookingData),
      success: function (response) {
        localStorage.removeItem('pendingBooking');
        alert("Booking successful! Proceeding to payment...");
      },
      error: function () {
        alert("Booking failed. Try again.");
      }
    });
  }

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

    // 1. Register first
    $.ajax({
      url: 'http://localhost:8080/api/v1/user/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(userData),
      success: function () {
        // 2. Then login
        $.ajax({
          url: 'http://localhost:8080/api/v1/auth/authenticate',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({
            email: email,
            password: password
          }),
          success: function (loginRes) {
            const token = loginRes.data.token;
            if (!token) {
              alert("No token received. Login failed.");
              return;
            }

            localStorage.setItem('authToken', token);
            $('#registerModal').modal('hide');
            alert("Registered & logged in! Proceeding with booking...");

            const decoded = parseJwt(token);
            if (!decoded || !decoded.sub) {
              alert("Login failed. Please log in manually.");
              return;
            }

            proceedWithBooking(token, decoded.sub, decoded.contact || "0000000000");
          },
          error: function (xhr) {
            console.error("Login failed after registration", xhr.responseText);
            alert("Login failed after registration: " + xhr.responseText);
          }
        });
      },
      error: function (xhr) {
        console.error("Registration failed", xhr.responseText);
        alert("Registration failed: " + xhr.responseText);
      }
    });
  });

  // Events
  hotelDropdown.on('change', () => loadRoomTypes(hotelDropdown.val()));
  roomTypeSelect.on('change', updateRoomAvailability);
  checkinDateInput.on('change', updateRoomAvailability);
  checkoutDateInput.on('change', updateRoomAvailability);
  timeSlotSelect.on('change', updateRoomAvailability);

 const pending = JSON.parse(localStorage.getItem('pendingBooking'));
  if (pending) {
    checkinDateInput.val(pending.checkinDate);
    checkoutDateInput.val(pending.checkoutDate);
    timeSlotSelect.val(pending.timeSlot);
  }

  localStorage.removeItem('pendingBooking'); // Reset after form is shown
  loadHotels();
});
