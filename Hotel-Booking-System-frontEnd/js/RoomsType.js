// Fetch All Rooms
const getAllRooms = () => {
  $.ajax({
    url: `http://localhost:8080/api/v1/roomType/getAll`,
    type: 'GET',
    success: (res) => {
      console.log("API Response:", res);
      $('#roomTableBody').empty();

      if (res.data && Array.isArray(res.data)) {
        res.data.forEach(room => {
          $('#roomTableBody').append(`
            <tr>
              <td>${room.typeId || 'N/A'}</td>
              <td><img src="${room.image || 'https://via.placeholder.com/50'}" alt="Room Image" width="50" height="50"></td>
              <td>${room.description || 'N/A'}</td>
              <td>${room.price || 'N/A'}</td>
              <td>${room.qtyOnHand || 'N/A'}</td>
              <td>
                <button id="edit_roomType" class="btn btn-warning btn-sm" onclick="editRoom(${room.typeId}, '${room.description}', ${room.price}, ${room.qtyOnHand})">Edit</button>
                <button id="delete_roomType" class="btn btn-danger btn-sm" onclick="deleteRoom(${room.typeId})">Delete</button>
              </td>
            </tr>
          `);
        });
      }
    },
    error: (err) => console.error('Error fetching rooms:', err)
  });
};

// Open Add Room Modal
const openAddModal = () => {
  $('#roomForm')[0].reset();
  $('#roomModal').modal('show');
};


//add
$('#roomForm').submit((e) => {
  e.preventDefault();  // Prevent default form submission

  const formData = new FormData();  // Create FormData object to handle file uploads

  const roomId = $("#roomId").val();  // Get the room ID
  const roomType = $('#roomType').val();  // Get the room type (description)
  const price = $('#price').val();  // Get the room price
  const qtyOnHand = $('#qtyOnHand').val();  // Get the quantity on hand
  const imageFile = $('#image')[0].files[0];  // Get the image file from the input field

  // Append all form data including the image
  formData.append('typeId', roomId);
  formData.append('description', roomType);
  formData.append('price', price);
  formData.append('qtyOnHand', qtyOnHand);
  formData.append('image', imageFile);  // Append image

  // Perform the AJAX request for POST
  $.ajax({
    url: 'http://localhost:8080/api/v1/roomType/save',  // Endpoint for saving room
    type: 'POST',
    data: formData,  // Send the FormData with image
    contentType: false,  // Do not set contentType, as FormData will automatically set it
    processData: false,  // Do not process data, let FormData handle it
    success: (res) => {
      $('#roomModal').modal('hide');  // Hide the modal
      getAllRooms();  // Reload the room data
      console.log(res);  // Log the response for debugging
    },
    error: (err) => {
      console.log(err);  // Log any errors
    }
  });
});


// Delete Room
const deleteRoom = (typeId) => {
  $.ajax({
    url: `http://localhost:8080/api/v1/roomType/delete/${typeId}`,
    type: 'DELETE',
    success: () => getAllRooms(),
    error: (err) => console.error('Error deleting room:', err)
  });
};

// Load rooms when page loads
$(document).ready(() => getAllRooms());


// Function to open edit modal for a room
const editRoom = (typeId, description, price, qtyOnHand) => {
  // Fill form values
  $('#edit_roomId').val(typeId);
  $('#edit_roomType').val(description);
  $('#edit_price').val(price);
  $('#edit_qtyOnHand').val(qtyOnHand);

  // Show the modal
  $('#editRoomModal').modal('show');
}

// Update Room Form Submit
$('#editRoomForm').submit((e) => {
  e.preventDefault();

  const typeId = $('#edit_roomId').val();
  const description = $('#edit_roomType').val();
  const price = $('#edit_price').val();
  const qtyOnHand = $('#edit_qtyOnHand').val();
  const imageFile = $('#edit_image')[0].files[0];

  const formData = new FormData();
  formData.append('typeId', typeId);
  formData.append('description', description);
  formData.append('price', price);
  formData.append('qtyOnHand', qtyOnHand);

  // Only append image if a new one is selected
  if (imageFile) {
    formData.append('image', imageFile);
  }

  $.ajax({
    url: 'http://localhost:8080/api/v1/roomType/update',
    type: 'PUT',
    data: formData,
    contentType: false,
    processData: false,
    success: (res) => {
      $('#editRoomModal').modal('hide');
      getAllRooms();
      console.log(res);
    },
    error: (err) => {
      console.log(err);
    }
  });
});
