// Function to fetch hotels and load data into the table
const fetchHotels = function() {
  $.ajax({
    url: 'http://localhost:8080/api/v1/hotel/getAll',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    success: function(result) {
      console.log("Hotels Data:", result); // Debugging output
      const tableBody = $('#hotelTable tbody'); // Ensure the table body exists
      tableBody.html(""); // Clear existing rows

      if (result && result.data && Array.isArray(result.data)) {
        result.data.forEach(function(hotel) {
          addHotelToTable(hotel);
        });
      } else {
        console.error("Invalid data format received:", result);
      }
    },
    error: function(error) {
      console.error("Error fetching hotels:", error);
      alert("An error occurred while fetching hotels.");
    }
  });
};

// Function to add a hotel row to the table
const addHotelToTable = function(hotel) {
  const row = $('<tr></tr>');
  row.html(`
        <td>${hotel.hotelId || "N/A"}</td>
        <td>${hotel.name || "N/A"}</td>
        <td>${hotel.location || "N/A"}</td>
        <td>${hotel.description || "N/A"}</td>
        <td>
            ${hotel.image ? `<img src="data:image/png;base64,${hotel.image}" alt="Hotel Image" class="hotel-image-table" />` : 'No Image'}
        </td>
        <td>${hotel.managerId || "N/A"}</td>
    `);

  $('#hotelTable tbody').append(row); // Append row to table
};

// Call fetchHotels() when the page loads
$(document).ready(function() {
  fetchHotels();
});
