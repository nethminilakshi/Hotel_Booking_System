// Fetch All Hotels
const getAllHotels = () => {
  $.ajax({
    url: `http://localhost:8080/api/v1/hotel/getAll`, // Adjust the URL to your backend endpoint
    type: 'GET',
    success: (res) => {
      console.log("API Response:", res);
      $('#hotelTableBody').empty();

      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(hotel => {
          $('#hotelTableBody').append(`
            <tr>
              <td>${hotel.hotelId || 'N/A'}</td>
              <td><img src="${hotel.image || 'https://via.placeholder.com/50'}" alt="Hotel Image" width="50" height="50"></td>
              <td>${hotel.name || 'N/A'}</td>
              <td>${hotel.location || 'N/A'}</td>
              <td>${hotel.description || 'N/A'}</td>
              <td>${hotel.managerId || 'N/A'}</td>
              <td>
                <button class="btn btn-warning btn-sm" onclick="openEditModal(${hotel.hotelId}, '${hotel.name}', '${hotel.location}', '${hotel.description}', '${hotel.managerId}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteHotel(${hotel.hotelId})">Delete</button>
              </td>
            </tr>
          `);
        });
      }
    },
    error: (err) => console.error('Error fetching hotels:', err)
  });
};

// Open Add Hotel Modal
const openAddModal = () => {
  $('#hotelForm')[0].reset(); // Reset the form
  $('#hotelModal').modal('show'); // Show the modal
};

// Add Hotel
$('#hotelForm').submit((e) => {
  e.preventDefault(); // Prevent default form submission

  const formData = new FormData(); // Create FormData object to handle file uploads

  // Get form values
  const hotelId = $("#hotel_id").val();
  const name = $('#name').val();
  const location = $('#location').val();
  const description = $('#description').val();
  const managerId = $('#manager_id').val();
  const imageFile = $('#image')[0].files[0];

  // Append all form data including the image
  formData.append('hotelId', hotelId);
  formData.append('name', name);
  formData.append('location', location);
  formData.append('description', description);
  formData.append('managerId', managerId);
  formData.append('image', imageFile); // Append image

  // Perform the AJAX request for POST
  $.ajax({
    url: 'http://localhost:8080/api/v1/hotel/save', // Endpoint for saving hotel
    type: 'POST',
    data: formData, // Send the FormData with image
    contentType: false, // Do not set contentType, as FormData will automatically set it
    processData: false, // Do not process data, let FormData handle it
    success: (res) => {
      $('#hotelModal').modal('hide'); // Hide the modal
      getAllHotels(); // Reload the hotel data
      console.log(res); // Log the response for debugging
    },
    error: (err) => {
      console.log(err); // Log any errors
    }
  });
});

// Delete Hotel
const deleteHotel = (hotelId) => {
  $.ajax({
    url: `http://localhost:8080/api/v1/hotel/delete/${hotelId}`, // Adjust the URL to your backend endpoint
    type: 'DELETE',
    success: () => getAllHotels(), // Reload the hotel data after deletion
    error: (err) => console.error('Error deleting hotel:', err)
  });
};

// Load hotels when page loads
$(document).ready(() => getAllHotels()); // Fetch all hotels on page load

// Open Edit Modal
const openEditModal = (hotelId, name, location, description, managerId) => {
  // Fill form values
  $('#edit_hotel_id').val(hotelId);
  $('#edit_name').val(name);
  $('#edit_location').val(location);
  $('#edit_description').val(description);
  $('#edit_manager_id').val(managerId);

  // Show the modal
  $('#editHotelModal').modal('show');
}

// Update Hotel Form Submit
$('#editHotelForm').submit((e) => {
  e.preventDefault(); // Prevent default form submission

  const hotelId = $('#edit_hotel_id').val();
  const name = $('#edit_name').val();
  const location = $('#edit_location').val();
  const description = $('#edit_description').val();
  const managerId = $('#edit_manager_id').val();
  const imageFile = $('#edit_image')[0].files[0];

  const formData = new FormData();
  formData.append('hotelId', hotelId);
  formData.append('name', name);
  formData.append('location', location);
  formData.append('description', description);
  formData.append('managerId', managerId);

  // Only append image if a new one is selected
  if (imageFile) {
    formData.append('image', imageFile);
  }

  $.ajax({
    url: 'http://localhost:8080/api/v1/hotel/update', // Adjust the URL to your backend endpoint
    type: 'PUT',
    data: formData,
    contentType: false,
    processData: false,
    success: (res) => {
      $('#editHotelModal').modal('hide'); // Hide the modal
      getAllHotels(); // Reload the hotel data
      console.log(res); // Log the response for debugging
    },
    error: (err) => {
      console.log(err); // Log any errors
    }
  });
});
