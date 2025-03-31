document.addEventListener('DOMContentLoaded', () => {
  const hotelRegisterForm = document.getElementById('hotel-register-form');
  const addHotelButton = document.getElementById('add-hotel');
  const closeButton = document.getElementById('hotel-register-close');
  const hotelForm = document.getElementById('hotel-form');
  const tableBody = document.querySelector('.hotel-table tbody');
  const formTitle = document.querySelector('.hotel-register-title');
  const imageInput = document.getElementById("hotel-image");
  const imagePreview = document.getElementById("hotel-image-preview");
  const imagePreviewContainer = document.getElementById("hotel-image-preview-container");
  const removeImageButton = document.getElementById("hotel-remove-image");
  const managerDropdown = document.getElementById('managerId'); // Corrected ID
  let currentHotelId = null;

  // Image handling setup
  imageInput?.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreviewContainer.style.display = "flex";
      };
      reader.readAsDataURL(file);
    }
  });

  // Remove image functionality
  removeImageButton?.addEventListener("click", () => {
    imageInput.value = "";
    imagePreview.src = "";
    imagePreviewContainer.style.display = "none";
  });

  // Open and close registration form
  const openForm = () => {
    hotelRegisterForm.style.display = "flex";
    formTitle.textContent = "Register Hotel";
    currentHotelId = null;
    clearForm();
  };

  const closeForm = () => {
    hotelRegisterForm.style.display = "none";
    clearForm();
  };

  addHotelButton?.addEventListener("click", openForm);
  closeButton?.addEventListener("click", closeForm);

  window.addEventListener('click', (event) => {
    if (event.target === hotelRegisterForm) closeForm();
  });

  // Function to get the authentication token
  const getAuthToken = () => {
    // Replace with your actual method of retrieving the token
    return localStorage.getItem('authToken');
  };

  // Populate manager dropdown
  const loadManagers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/user/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error(`Failed to load managers. Status: ${response.status}`);

      const result = await response.json();
      managerDropdown.innerHTML = '<option value="">-- Select Manager --</option>';

      if (result.data && Array.isArray(result.data)) {
        result.data.forEach(manager => {
          const option = document.createElement('option');
          option.value = manager.userId;
          option.textContent = manager.username || "Unknown";
          managerDropdown.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error loading managers:", error);
      alert("Unable to fetch managers. Please try again.");
    }
  };

  // Fetch hotels for the table
  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/hotel/getAll', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error(`Failed to fetch hotels. Status: ${response.status}`);

      const result = await response.json();
      tableBody.innerHTML = "";
      (result.data || []).forEach(hotel => addHotelToTable(hotel));
    } catch (error) {
      console.error("Error fetching hotels:", error);
      alert("An error occurred while fetching hotels.");
    }
  };

  // Add hotel data to table
  const addHotelToTable = (hotel) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${hotel.hotelId || "N/A"}</td>
      <td>${hotel.name || "N/A"}</td>
      <td>${hotel.location || "N/A"}</td>
      <td>${hotel.description || "N/A"}</td>
      <td>
        <img src="data:image/png;base64,${hotel.image || ''}" alt="Hotel Image" class="hotel-image-table" />
      </td>
      <td>${hotel.managerId || "N/A"}</td>
      <td><span class="update-button">Update</span></td>
      <td><span class="delete-button">Delete</span></td>
    `;
    row.querySelector('.update-button').addEventListener('click', () => openUpdateForm(hotel));
    row.querySelector('.delete-button').addEventListener('click', () => deleteHotel(hotel.hotelId));
    tableBody.appendChild(row);
  };

  // Open update form
  const openUpdateForm = (hotel) => {
    currentHotelId = hotel.hotelId;
    openForm();
    populateForm(hotel);
  };

  // Populate form fields for updating
  const populateForm = (hotel) => {
    document.getElementById('hotel-name').value = hotel.name || '';
    document.getElementById('hotel-location').value = hotel.location || '';
    document.getElementById('hotel-description').value = hotel.description || '';
    document.getElementById('managerId').value = hotel.managerId || '';
    if (hotel.image) {
      imagePreview.src = `data:image/png;base64,${hotel.image}`;
      imagePreviewContainer.style.display = "flex";
    }
  };

  // Save hotel data
  const saveHotel = async () => {
    const formData = getFormData();

    try {
      const response = await fetch('http://localhost:8080/api/v1/hotel/save', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) throw new Error(`Failed to save hotel: ${response.statusText}`);
      alert('Hotel saved successfully!');
      fetchHotels();
      closeForm();
    } catch (error) {
      console.error("Error saving hotel:", error);
      alert("An error occurred while saving the hotel.");
    }
  };

  // Update hotel data
  const updateHotel = async () => {
    const formData = getFormData();

    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotel/update/${currentHotelId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });

      if (!response.ok) throw new Error(`Failed to update hotel: ${response.statusText}`);
      alert('Hotel updated successfully!');
      fetchHotels();
      closeForm();
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert("An error occurred while updating the hotel.");
    }
  };

  // Get form data
  const getFormData = () => {
    const formData = new FormData();
    formData.append('name', document.getElementById('hotel-name').value);
    formData.append('location', document.getElementById('hotel-location').value);
    formData.append('description', document.getElementById('hotel-description').value);
    formData.append('manager_id', document.getElementById('managerId').value);
    const image = imageInput.files[0];
    if (image) formData.append('image', image);
    return formData;
  };

  // Delete a hotel
  const deleteHotel = async (hotelId) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/hotel/delete/${hotelId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
        if (!response.ok) throw new Error(`Failed to delete hotel: ${response.statusText}`);
        fetchHotels();
      } catch (error) {
        console.error("Error deleting hotel:", error);
        alert("An error occurred while deleting the hotel.");
      }
    }
  };

  // Clear form fields
  const clearForm = () => {
    hotelForm.reset();
    imagePreview.src = '';
    imagePreviewContainer.style.display = 'none';
    currentHotelId = null;
  };

  // Fetch hotels and load managers on page load
  fetchHotels();
  loadManagers();
});
