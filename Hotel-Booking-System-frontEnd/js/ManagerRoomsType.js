$(document).ready(function() {
  const roomRegisterForm = $('#room-register-form');
  const addRoomButton = $('#add-room');
  const closeButton = $('#room-register-close');
  const roomForm = $('#room-form');
  const tableBody = $('.room-table tbody');
  const formTitle = $('.room-register-title');
  const imageInput = $('#room-image');
  const imagePreview = $('#room-image-preview');
  const imagePreviewContainer = $('#room-image-preview-container');
  const removeImageButton = $('#room-remove-image');
  let currentRoomId = null;

  const getAuthToken = function() {
    return localStorage.getItem('authToken');
  };

  // Image handling setup
  imageInput.on('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.attr('src', e.target.result);
        imagePreviewContainer.css('display', 'flex');
      };
      reader.readAsDataURL(file);
    }
  });

  // Remove image functionality
  removeImageButton.on('click', function() {
    imageInput.val('');
    imagePreview.attr('src', '');
    imagePreviewContainer.css('display', 'none');
  });

  // Open and close form
  const openForm = function() {
    roomRegisterForm.css('display', 'flex');
    formTitle.text(currentRoomId ? 'Update Room Type' : 'Register Room Type');
    if (!currentRoomId) {
      clearForm();
    }
  };

  const closeForm = function() {
    roomRegisterForm.css('display', 'none');
    clearForm();
  };

  addRoomButton.on('click', openForm);
  closeButton.on('click', closeForm);


  // Fetch room types
  const fetchRooms = function() {
    $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(result) {
        tableBody.html('');
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach(function(room) {
            addRoomToTable(room);
          });
        }
      },
      error: function(error) {
        console.error('Error fetching room types:', error);
        alert('An error occurred while fetching room types.');
      }
    });
  };

  // Add room to table
  const addRoomToTable = function(room) {
    const row = $('<tr></tr>');
    row.html(`
      <td>${room.typeId || 'N/A'}</td>
      <td>${room.name || 'N/A'}</td>
      <td>${room.description || 'N/A'}</td>
      <td>${room.price || 'N/A'}</td>
      <td>${room.qtyOnHand || 'N/A'}</td>
      <td>${room.noOfPersons || 'N/A'}</td>
      <td>
        ${room.image ? `<img src="data:image/png;base64,${room.image}" alt="Room Image" class="room-image-table" />` : 'No Image'}
      </td>
      <td><span class='update-button'>Update</span></td>
      <td><span class='delete-button'>Delete</span></td>
    `);
    row.find('.update-button').on('click', function() {
      openUpdateForm(room);
    });
    row.find('.delete-button').on('click', function() {
      console.log("Room ID before delete:", room.typeId); // Debugging
      deleteRoom(room.typeId || room.id || room.roomId); // Ensure the correct field is used
    });
    row.find('.room-image-table').on('click', function() {
      alert('Image clicked!');
  });
    tableBody.append(row);
  };

  // Open update form
  const openUpdateForm = function(room) {
    currentRoomId = room.roomId;
    formTitle.text('Update Room Type');
    populateForm(room);
    openForm();
  };

  // Populate form fields
  const populateForm = function(room) {
    $('#room-name').val(room.name);
    $('#room-description').val(room.description);
    $('#room-price').val(room.price);
    $('#room-qty').val(room.qtyOnHand);
    $('#room-persons').val(room.noOfPersons);
    if (room.image) {
      imagePreview.attr('src', `data:image/png;base64,${room.image}`);
      imagePreviewContainer.css('display', 'flex');
    } else {
      imagePreviewContainer.css('display', 'none');
    }
  };

  // Submit form
  roomForm.on('submit', function(e) {
    e.preventDefault();
    if (currentRoomId) {
      updateRoom();
    } else {
      saveRoom();
    }
  });

  // Save room
  const saveRoom = function() {
    const formData = getFormData();

    console.log("Submitting FormData:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/save',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        console.log("Save Response:", response);
        alert('Room type saved successfully!');
        fetchRooms();
        closeForm();
      },
      error: function(error) {
        console.error('Error saving room type:', error);
        alert('An error occurred while saving the room type.');
      }
    });
  };

  // Update hotel data
  const updateRoom = function() {
    const formData = getFormData();

    $.ajax({
      url: `http://localhost:8080/api/v1/roomType/update/${currentRoomId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        console.log('Update response:', response);
        alert('Hotel updated successfully!');
        fetchRooms();
        closeForm();
      },
      error: function(error) {
        console.error("Error updating hotel:", error);
        alert("An error occurred while updating the hotel: " + (error.responseJSON?.message || error.statusText));
      }
    });
  };

// Get form data
  const getFormData = function() {
    const formData = new FormData();
    formData.append('typeId', currentRoomId || '');
    formData.append('name', $('#room-name').val());
    formData.append('description', $('#room-description').val());
    formData.append('price', $('#room-price').val());
    formData.append('qtyOnHand', $('#room-qty').val());
    formData.append('noOfPersons', $('#room-persons').val());



    const image = imageInput[0].files[0];
    if (image) formData.append('image', image);

    return formData;
  };

  function deleteRoom(roomId) {
    if (!roomId) {
      console.error("Room ID is undefined! Cannot proceed with deletion.");
      alert("Error: Room ID is missing!");
      return;
    }

    console.log("Deleting Room ID:", roomId);

    $.ajax({
      url: `http://localhost:8080/api/v1/roomType/delete/${roomId}`, // FIXED: Use roomId
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(response) {
        console.log("Delete Success:", response);
        alert("Room deleted successfully!");
        fetchRooms(); // Refresh table
      },
      error: function(error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room.");
      }
    });
  }


  // Clear form fields
  const clearForm = function() {
    roomForm[0].reset();
    imagePreview.attr("src", '');
    imagePreviewContainer.css("display", 'none');
  };

  // Fetch room types on load
  fetchRooms();
});
