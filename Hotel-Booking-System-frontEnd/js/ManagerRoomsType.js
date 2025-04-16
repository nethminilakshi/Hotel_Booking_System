$(document).ready(function () {
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
  const imageInputWrapper = $('#image-input-wrapper');
  let currentRoomId = null;

  const getAuthToken = () => localStorage.getItem('authToken');

  imageInput.on('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.attr('src', e.target.result);
        imagePreviewContainer.css('display', 'flex');
      };
      reader.readAsDataURL(file);
    }
  });

  removeImageButton.on('click', function () {
    imageInput.val('');
    imagePreview.attr('src', '');
    imagePreviewContainer.css('display', 'none');
  });

  const openForm = function () {
    roomRegisterForm.css('display', 'flex');
    formTitle.text(currentRoomId ? 'Update Room Type' : 'Register Room Type');
    if (currentRoomId) {
      imageInputWrapper.hide();
      removeImageButton.hide();
    } else {
      imageInputWrapper.show();
      removeImageButton.show();
      clearForm();
    }
  };

  const closeForm = function () {
    roomRegisterForm.css('display', 'none');
    clearForm();
  };

  addRoomButton.on('click', openForm);
  closeButton.on('click', closeForm);

  const fetchRooms = function () {
    $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function (result) {
        tableBody.html('');
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach(function (room) {
            addRoomToTable(room);
          });
        }
      },
      error: function (error) {
        console.error('Error fetching room types:', error);
        alert('An error occurred while fetching room types.');
      }
    });
  };

  const addRoomToTable = function (room) {
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

    row.find('.update-button').on('click', function () {
      console.log('Update clicked for room:', room.typeId);
      openUpdateForm(room);
    });

    row.find('.delete-button').on('click', function () {
      deleteRoom(room.typeId);
    });

    row.find('.room-image-table').on('click', function () {
      alert('Image clicked!');
    });

    tableBody.append(row);
  };

  const openUpdateForm = function (room) {
    currentRoomId = room.typeId;
    console.log('Opening form for update:', currentRoomId);
    formTitle.text('Update Room Type');
    populateForm(room);
    imageInput.val('');
    openForm();
  };

  const populateForm = function (room) {
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

  roomForm.on('submit', function (e) {
    e.preventDefault();
    console.log('Form submitted. CurrentRoomId:', currentRoomId);
    if (currentRoomId) {
      updateRoom();
    } else {
      saveRoom();
    }
  });

  const saveRoom = function () {
    const formData = getFormData();

    $.ajax({
      url: 'http://localhost:8080/api/v1/roomType/save',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        alert('Room type saved successfully!');
        fetchRooms();
        closeForm();
      },
      error: function (error) {
        console.error('Error saving room type:', error);
        alert('An error occurred while saving the room type.');
      }
    });
  };

  const updateRoom = function () {
    const formData = getFormData();
    console.log('Updating room with ID:', currentRoomId);

    fetch(`http://localhost:8080/api/v1/roomType/update/${currentRoomId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
        // DO NOT set 'Content-Type', let browser handle it with FormData
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err });
        }
        return response.json();
      })
      .then(data => {
        console.log('Update successful:', data);
        alert('RoomType updated successfully!');
        fetchRooms();
        closeForm();
      })
      .catch(error => {
        console.error("Error updating room:", error);
        alert("An error occurred while updating the room: " + (error.message || 'Unknown Error'));
      });
  };

  const getFormData = function () {
    const formData = new FormData();
    // Remove typeId; not needed for update
    formData.append('name', $('#room-name').val());
    formData.append('description', $('#room-description').val());
    formData.append('price', $('#room-price').val());
    formData.append('qtyOnHand', $('#room-qty').val());
    formData.append('noOfPersons', $('#room-persons').val());

    const image = imageInput[0].files[0];
    if (image) {
      formData.append('image', image);
    }

    // Debug: print all keys
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    return formData;
  };

  const deleteRoom = function (roomId) {
    if (!confirm("Are you sure you want to delete this room type?")) return;
    if (!roomId) {
      alert("Room ID is missing!");
      return;
    }

    $.ajax({
      url: `http://localhost:8080/api/v1/roomType/delete/${roomId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function () {
        alert("Room deleted successfully!");
        fetchRooms();
      },
      error: function (error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room.");
      }
    });
  };

  const clearForm = function () {
    roomForm[0].reset();
    imagePreview.attr("src", '');
    imagePreviewContainer.css("display", 'none');
    imagePreview.removeData('existing');
    currentRoomId = null;
  };

  fetchRooms();
});
