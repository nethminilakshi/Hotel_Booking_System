$(document).ready(function () {
  const hotelDropdown = $('#hotelId');
  const roomTypeSelect = $('#roomTypeSelect');
  const roomAvailabilityInfo = $('#roomAvailabilityInfo');
  const checkinDateInput = $('#checkinDate');
  const checkoutDateInput = $('#checkoutDate');
  const timeSlotSelect = $('#timeSlotSelect');
  const bookRoomButton = $('#bookRoomButton');

  // Helpers
  const getAuthToken = () => localStorage.getItem('authToken');
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // -------------------- LOADERS --------------------
  function loadHotels() {
    $.ajax({
      url: 'http://localhost:8080/api/v1/hotel/getAll',
      method: 'GET',
      headers: { 'Authorization': Bearer ${getAuthToken()} },
      success: function (result) {
        hotelDropdown.html('<option value="">-- Select Hotel --</option>');
        result.data.forEach(hotel => {
          hotelDropdown.append(<option value="${hotel.hotelId}">${hotel.name}</option>);
        });

        const pending = JSON.parse(localStorage.getItem('pendingBooking'));
        if (pending?.hotelId) {
          hotelDropdown.val(pending.hotelId).trigger('change');
        }
      },
      error: function (err) {
        console.error("Hotel load failed", err);
      }
    });
  }

  function loadRoomTypes(hotelId) {
    if (!hotelId) return;
    $.ajax({
      url: http://localhost:8080/api/v1/room/roomTypesByHotel/${hotelId},
    method: 'GET',
      headers: { 'Authorization': Bearer ${getAuthToken()} },
    success: function (res) {
      roomTypeSelect.html('<option value="">-- Select Room Type --</option>');
      res.data.forEach(rt => {
        roomTypeSelect.append(<option value="${rt.roomTypeId}">${rt.roomTypeName}</option>);
      });

      const pending = JSON.parse(localStorage.getItem('pendingBooking'));
      if (pending?.roomTypeId) {
        roomTypeSelect.val(pending.roomTypeId);
      }

      updateRoomAvailability();
    },
    error: function (err) {
      console.error("Room type load error", err);
    }
  });
  }

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
      headers: { 'Authorization': Bearer ${getAuthToken()} },
      success: function (res) {
        const available = res.data || 0;
        roomAvailabilityInfo.text(Available Rooms: ${available});
        bookRoomButton.prop('disabled', available <= 0);
      },
      error: function () {
        roomAvailabilityInfo.text('Error checking availability');
      }
    });
  }

  // -------------------- BOOKING FLOW --------------------
  bookRoomButton.on('click', function () {
    const bookingInputs = {
      hotelId: hotelDropdown.val(),
      roomTypeId: roomTypeSelect.val(),
      checkinDate: checkinDateInput.val(),
      checkoutDate: checkoutDateInput.val(),
      timeSlot: timeSlotSelect.val()
    };
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
        'Authorization': Bearer ${token}
      },
      data: JSON.stringify(bookingData),
      success: function (response) {
        localStorage.removeItem('pendingBooking');
        alert("Booking successful! Opening payment window...");

// Open the payment page in a popup
        const popup = window.open(Payment.html?bookingId=${response.data.bookingId}, 'PaymentWindow', 'width=600,height=800');

// Optional: focus the popup
        if (popup) {
          popup.focus();
        } else {
          alert("Please allow popups for this site to proceed with payment.");
        }
      },
      error: function (err) {
        alert("Booking failed. Try again.");
        console.error("Booking error", err);
      }
    });
  }

  // -------------------- REGISTER + AUTO LOGIN --------------------
  $('#registerSubmitBtn').on('click', function () {
    const username = $("#nameSignUp").val().trim();
    const email = $("#emailSignUp").val().trim();
    const contact = $("#contactSignUp").val().trim();
    const password = $("#passwordSignUp").val().trim();
    const confirmPassword = $("#confPasswordSignUp").val().trim();

    if (!username || !email || !contact || !password || !confirmPassword) return alert("All fields required!");
    if (password !== confirmPassword) return alert("Passwords do not match!");

    const userData = {
      name: username,
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
      success: function () {
        $.ajax({
          url: 'http://localhost:8080/api/v1/auth/authenticate',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ email, password }),
          success: function (loginRes) {
            const token = loginRes.data.token; // ✅ extract from nested 'data'
            console.log("Login Response:", loginRes);
            console.log("Extracted Token:", token);

            if (!token) {
              alert("No token received. Login failed.");
              return;
            }

            localStorage.setItem('authToken', token);
            $('#registerModal').modal('hide');
            alert("Registered & logged in! Proceeding with booking...");

            const decoded = parseJwt(token);
            console.log("Decoded Token:", decoded);

            if (!decoded || !decoded.sub) {
              alert("Login failed. Please log in manually.");
              return;
            }

            proceedWithBooking(token, decoded.sub, decoded.contact || "0000000000");
          },
          error: function () {
            alert("Login failed after registration.");
          }
        });
      },
      error: function (err) {
        console.error("Registration error", err);
        alert("Registration failed. Try again.");
      }
    });
  });

  // -------------------- EVENTS --------------------
  hotelDropdown.on('change', () => loadRoomTypes(hotelDropdown.val()));
  roomTypeSelect.on('change', updateRoomAvailability);
  checkinDateInput.on('change', updateRoomAvailability);
  checkoutDateInput.on('change', updateRoomAvailability);
  timeSlotSelect.on('change', updateRoomAvailability);

  // -------------------- INIT --------------------
  const pending = JSON.parse(localStorage.getItem('pendingBooking'));
  if (pending) {
    checkinDateInput.val(pending.checkinDate);
    checkoutDateInput.val(pending.checkoutDate);
    timeSlotSelect.val(pending.timeSlot);
  }

  localStorage.removeItem('pendingBooking'); // Reset after form is shown
  loadHotels();
});
