const tableBody = document.querySelector('.booking-table tbody');

const fetchBookings = () => {
  $.ajax({
    url: "http://localhost:8080/api/v1/Booking/getAll",
    type: "GET",
    success: function (res) {
      console.log("Response from Backend:", res);
      const bookings = res.data || [];
      tableBody.innerHTML = "";
      bookings.forEach(addBookingToTable);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching bookings:", error);
      alert("An error occurred while fetching bookings.");
    }
  });
}

// Function to dynamically add a booking to the table
const addBookingToTable = (booking) => {
  console.log("Booking Data:", booking);

  const row = document.createElement("tr");
  row.id = `booking-${booking.bookingId}`;

  // Extract data with fallbacks
  const userName = booking.user?.name || "N/A";
  const userPhone = booking.contact || booking.user?.contact || "N/A";
  const userEmail = booking.email || booking.user?.email || "N/A";
  const hotelName = booking.hotel?.name || "N/A";
  const roomTypeName = booking.roomType?.name || "N/A";

  row.innerHTML = `
    <td>${booking.bookingId}</td>
    <td>${userName}</td>
    <td>${userPhone}</td>
    <td>${userEmail}</td>
    <td>${hotelName}</td>
    <td>${roomTypeName}</td>
    <td>${booking.roomCount}</td>
    <td>${booking.checkIn}</td>
    <td>${booking.checkOut}</td>
    <td>${booking.time}</td>
    <td>${booking.status}</td>
  `;

  tableBody.appendChild(row);
};

// Call fetchBookings when the page loads
document.addEventListener('DOMContentLoaded', fetchBookings);
