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

  function checkRedirect() {
    const contactInfo = JSON.parse(localStorage.getItem('userContactInfo'));
    const pendingBooking = JSON.parse(localStorage.getItem('pendingBooking'));
    console.log("Checking redirect logic:", { contactInfo, pendingBooking });

    if (pendingBooking && contactInfo) {
      console.log("Resuming booking process");
      proceedWithBooking(contactInfo.email, contactInfo.contact);
    }
  }

  $('#openRegisterBtn').on('click', function () {
    $('#registerModal').modal('show');
  });

  function loadHotels() {
    console.log("Loading hotels...");
    $.ajax({
      url: 'http://localhost:8080/api/v1/hotel/getAll',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (result) {
        console.log("Hotels loaded:", result.data);
        hotelDropdown.html('<option value="">-- Select Hotel --</option>');
        result.data.forEach(hotel => {
          hotelDropdown.append(`<option value="${hotel.hotelId}">${hotel.name}</option>`);
        });

        const pending = JSON.parse(localStorage.getItem('pendingBooking'));
        if (pending?.hotelId) {
          hotelDropdown.val(pending.hotelId).trigger('change');
        }
      },
      error: (err) => console.error("Hotel loading failed:", err)
    });
  }

  function loadRoomTypes(hotelId) {
    console.log("Loading room types for hotel:", hotelId);
    if (!hotelId) return;
    $.ajax({
      url: `http://localhost:8080/api/v1/room/roomTypesByHotel/${hotelId}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${getAuthToken()}` },
      success: function (res) {
        console.log("Room types loaded:", res.data);
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
      error: (err) => console.error("Room types load failed:", err)
    });
  }

  function updateRoomAvailability() {
    const hotelId = hotelDropdown.val();
    const roomTypeId = roomTypeSelect.val();
    const checkinDate = checkinDateInput.val();
    const checkoutDate = checkoutDateInput.val();
    const timeSlot = timeSlotSelect.val();

    console.log("Checking availability with:", { hotelId, roomTypeId, checkinDate, checkoutDate, timeSlot });

    if (!hotelId || !roomTypeId || !checkinDate || !checkoutDate || !timeSlot) {
      roomAvailabilityInfo.text('Please complete booking details.');
      bookRoomButton.prop('disabled', true);
      return;
    }

    $.ajax({
      url: 'http://localhost:8080/api/v1/Booking/availability',
      method: 'GET',
      data: { hotelId, roomTypeId, checkinDate, checkoutDate, time: timeSlot },
      success: function (res) {
        const available = res.data || 0;
        console.log("Available rooms:", available);
        roomAvailabilityInfo.text(`Available Rooms: ${available}`);
        bookRoomButton.prop('disabled', available <= 0);
        roomQtyInput.attr('max', available);
        if (parseInt(roomQtyInput.val()) > available) {
          roomQtyInput.val(available);
        }
      },
      error: (err) => {
        console.error("Availability check failed:", err);
        roomAvailabilityInfo.text('Error checking availability.');
        bookRoomButton.prop('disabled', true);
      }
    });
  }

  bookRoomButton.on('click', function () {
    console.log("Book Room button clicked");

    const bookingInputs = {
      hotelId: hotelDropdown.val(),
      roomTypeId: roomTypeSelect.val(),
      checkinDate: checkinDateInput.val(),
      checkoutDate: checkoutDateInput.val(),
      timeSlot: timeSlotSelect.val(),
      roomQty: parseInt(roomQtyInput.val()) || 1
    };

    if (bookingInputs.roomQty <= 0) {
      return Swal.fire("Invalid Quantity", "Room quantity must be at least 1.", "warning");
    }

    if (Object.values(bookingInputs).some(val => !val)) {
      return Swal.fire("Missing Information", "Please fill in all booking details.", "info");
    }

    localStorage.setItem('pendingBooking', JSON.stringify(bookingInputs));
    console.log("Stored pending booking:", bookingInputs);
    $('#checkUserModal').modal('show');
  });

  $('#checkUserSubmit').on('click', function () {
    const email = $('#checkUserEmail').val().trim();
    const contact = $('#checkUserContact').val().trim();

    if (!email || !contact) {
      return Swal.fire("Required Fields", "Please enter both email and contact number.", "warning");
    }

    localStorage.setItem('userContactInfo', JSON.stringify({ email, contact }));

    $.ajax({
      url: 'http://localhost:8080/api/v1/user/checkUser',
      method: 'GET',
      data: { email, contact },
      success: function (response) {
        console.log("User check response:", response);

        if (response.code === 201 || (response.code === 200 && response.data)) {
          $('#checkUserModal').modal('hide');
          proceedWithBooking(email, contact);
        } else {
          $('#checkUserModal').modal('hide');
          Swal.fire("User Not Found", "Please register for a booking.", "info");
          $('#registerModal').modal('show');
        }
      },
      error: function (xhr) {
        console.error("Error checking user:", xhr);
        Swal.fire("Error", "Error checking user. Please try again.", "error");
      }
    });
  });

  function proceedWithBooking(email, contact) {
    const data = JSON.parse(localStorage.getItem('pendingBooking'));
    if (!data) {
      return Swal.fire("Error", "Booking data not found!", "error");
    }

    const roomQty = parseInt(data.roomQty);
    if (isNaN(roomQty) || roomQty <= 0) {
      return Swal.fire("Invalid Quantity", "Invalid room quantity. Please try again.", "warning");
    }

    const bookingData = {
      hotelId: data.hotelId,
      roomTypeId: data.roomTypeId,
      checkIn: data.checkinDate,
      checkOut: data.checkoutDate,
      time: data.timeSlot,
      roomCount: roomQty,
      email: email,
      contact: contact,
      status: "CONFIRMED"
    };

    console.log("Sending booking data:", bookingData);

    $.ajax({
      url: 'http://localhost:8080/api/v1/Booking/save',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(bookingData),
      success: function (response) {
        console.log("Booking successful:", response);
        localStorage.removeItem('pendingBooking');
        localStorage.removeItem('userContactInfo');
        localStorage.removeItem('redirectAfterLogin');
        Swal.fire("Success", "Booking successful!", "success").then(() => window.location.reload());
      },
      error: function (xhr, status, error) {
        console.error("Booking failed:", xhr.responseText);
        Swal.fire("Booking Failed", xhr.responseJSON?.message || error, "error");
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
      return Swal.fire("Required Fields", "All fields are required!", "warning");
    }
    if (password !== confirmPassword) {
      return Swal.fire("Password Mismatch", "Passwords do not match!", "error");
    }

    const userData = {
      name,
      email,
      contact,
      password,
      role: "USER"
    };

    console.log("Registering user:", userData);

    $.ajax({
      url: 'http://localhost:8080/api/v1/user/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(userData),
      success: function (response) {
        console.log("Registration successful:", response);
        $('#registerModal').modal('hide');
        Swal.fire("Success", "Registration successful!", "success");

        if (!localStorage.getItem('userContactInfo')) {
          localStorage.setItem('userContactInfo', JSON.stringify({
            email: email,
            contact: contact
          }));
        }

        proceedWithBooking(email, contact);
      },
      error: function (error) {
        console.error("Registration error:", error);
        Swal.fire("Registration Failed", error.responseJSON?.message || "Unknown error", "error");
      }
    });
  });

  hotelDropdown.on('change', () => loadRoomTypes(hotelDropdown.val()));
  roomTypeSelect.on('change', updateRoomAvailability);
  checkinDateInput.on('change', updateRoomAvailability);
  checkoutDateInput.on('change', updateRoomAvailability);
  timeSlotSelect.on('change', updateRoomAvailability);
  roomQtyInput.on('change', function () {
    const max = parseInt($(this).attr('max') || 1);
    const value = parseInt($(this).val() || 1);
    if (value > max) $(this).val(max);
    else if (value < 1) $(this).val(1);
  });

  const today = new Date().toISOString().split('T')[0];
  checkinDateInput.attr('min', today);
  checkinDateInput.on('change', function () {
    checkoutDateInput.attr('min', $(this).val());
    if (checkoutDateInput.val() < $(this).val()) {
      checkoutDateInput.val($(this).val());
    }
  });

  const pending = JSON.parse(localStorage.getItem('pendingBooking'));
  if (pending) {
    console.log("Prefilling form from pending booking:", pending);
    checkinDateInput.val(pending.checkinDate);
    checkoutDateInput.val(pending.checkoutDate);
    timeSlotSelect.val(pending.timeSlot);
    roomQtyInput.val(pending.roomQty || 1);
  }

  loadHotels();
  checkRedirect();
});
