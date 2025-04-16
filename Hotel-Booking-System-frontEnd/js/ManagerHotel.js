$(document).ready(function() {
  const hotelRegisterForm = $('#hotel-register-form');
  const addHotelButton = $('#add-hotel');
  const closeButton = $('#hotel-register-close');
  const hotelForm = $('#hotel-form');
  const tableBody = $('.hotel-table tbody');
  const formTitle = $('.hotel-register-title');
  const imageInput = $("#hotel-image");
  const imagePreview = $("#hotel-image-preview");
  const imagePreviewContainer = $("#hotel-image-preview-container");
  const removeImageButton = $("#hotel-remove-image");
  const managerDropdown = $('#managerId');
  const imageInputWrapper = $('#image-input-wrapper');
  let currentHotelId = null;
  let managers = [];

  // Image preview handling
  imageInput.on("change", function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.attr("src", e.target.result);
        imagePreviewContainer.css("display", "flex");
      };
      reader.readAsDataURL(file);
    }
  });

  removeImageButton.on("click", function() {
    imageInput.val("");
    imagePreview.attr("src", "");
    imagePreviewContainer.css("display", "none");
  });

  // Open and close form
  const openForm = function() {
    hotelRegisterForm.css("display", "flex");
    formTitle.text(currentHotelId ? "Update Hotel" : "Register Hotel");

    if (currentHotelId) {
      imageInputWrapper.hide();
      removeImageButton.hide();
    } else {
      imageInputWrapper.show();
      removeImageButton.show();
      clearForm();
    }
  };

  const closeForm = function() {
    hotelRegisterForm.css("display", "none");
    clearForm();
  };

  addHotelButton.on("click", openForm);
  closeButton.on("click", closeForm);

  $(window).on('click', function(event) {
    if (event.target === hotelRegisterForm[0]) closeForm();
  });

  const getAuthToken = function() {
    return localStorage.getItem('authToken');
  };

  // Get manager name
  function getManagerNameById(managerId) {
    if (!managers || managers.length === 0) {
      return "Unknown Manager";
    }
    const manager = managers.find(m => m.userId === managerId);
    return manager ? manager.name : "Unknown Manager";
  }

  // Load managers
  const loadManagers = function() {
    return $.ajax({
      url: 'http://localhost:8080/api/v1/admin/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(result) {
        managerDropdown.html('<option value="">-- Select Manager --</option>');
        if (result.data && Array.isArray(result.data)) {
          managers = result.data;
          result.data.forEach(function(manager) {
            const option = $('<option></option>');
            option.val(manager.userId);
            option.text(manager.name || "Unknown");
            managerDropdown.append(option);
          });
        }
      },
      error: function(error) {
        console.error("Error loading managers:", error);
        alert("Unable to fetch managers. Please try again.");
      }
    });
  };

  // Fetch hotels
  const fetchHotels = function() {
    $.ajax({
      url: 'http://localhost:8080/api/v1/hotel/getAll',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(result) {
        tableBody.html("");
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

  // Add hotel row to table
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
      <td>${getManagerNameById(hotel.managerId) || "N/A"}</td>
      <td><span class="update-button">Update</span></td>
      <td><span class="delete-button">Delete</span></td>
    `);

    row.find('.update-button').on('click', function() {
      openUpdateForm(hotel);
    });
    row.find('.delete-button').on('click', function() {
      deleteHotel(hotel.hotelId);
    });

    tableBody.append(row);
  };

  // Open update form
  const openUpdateForm = function(hotel) {
    currentHotelId = hotel.hotelId;
    formTitle.text("Update Hotel");
    populateForm(hotel);
    imageInput.val('');
    openForm();
  };

  // Populate form fields for updating
  const populateForm = function(hotel) {
    $('#hotel-name').val(hotel.name || '');
    $('#hotel-location').val(hotel.location || '');
    $('#hotel-description').val(hotel.description || '');
    $('#managerId').val(hotel.managerId || '');

    if (hotel.image) {
      imagePreview.attr("src", `data:image/png;base64,${hotel.image}`);
      imagePreviewContainer.css("display", "flex");
    } else {
      imagePreviewContainer.css("display", "none");
    }
  };

  hotelForm.on('submit', function(e) {
    e.preventDefault();
    if (currentHotelId) {
      updateHotel();
    } else {
      saveHotel();
    }
  });

  const saveHotel = function() {
    const formData = getFormData();

    $.ajax({
      url: 'http://localhost:8080/api/v1/hotel/save',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        alert('Hotel saved successfully!');
        fetchHotels();
        closeForm();
      },
      error: function(error) {
        console.error("Error saving hotel:", error);
        alert("An error occurred while saving the hotel: " + (error.responseJSON?.message || error.statusText));
      }
    });
  };

  const updateHotel = function() {
    const formData = getFormData();

    $.ajax({
      url: `http://localhost:8080/api/v1/hotel/update/${currentHotelId}`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        alert('Hotel updated successfully!');
        fetchHotels();
        closeForm();
      },
      error: function(error) {
        console.error("Error updating hotel:", error);
        alert("An error occurred while updating the hotel: " + (error.responseJSON?.message || error.statusText));
      }
    });
  };

  const getFormData = function() {
    const formData = new FormData();
    formData.append('hotelName', $('#hotel-name').val());
    formData.append('location', $('#hotel-location').val());
    formData.append('description', $('#hotel-description').val());
    formData.append('manager_id', $('#managerId').val());

    if (currentHotelId) {
      formData.append('hotelId', currentHotelId);
    }

    const image = imageInput[0].files[0];
    if (image) formData.append('image', image);

    return formData;
  };

  function deleteHotel(hotelId) {
    if (!confirm("Are you sure you want to delete this hotel?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/hotel/delete/${hotelId}`,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      success: function(response) {
        alert("Hotel deleted successfully!");
        fetchHotels();
      },
      error: function(error) {
        console.error("Error deleting hotel:", error);
        alert("Failed to delete hotel.");
      }
    });
  }

  const clearForm = function() {
    hotelForm[0].reset();
    imagePreview.attr("src", '');
    imagePreviewContainer.css("display", 'none');
  };

  // Initial load
  $.when(loadManagers()).done(function() {
    fetchHotels();
  }).fail(function() {
    console.error("Error loading data.");
  });
});
