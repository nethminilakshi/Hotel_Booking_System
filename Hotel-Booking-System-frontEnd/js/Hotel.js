document.addEventListener('DOMContentLoaded', () => {
  const hotelRegisterForm = document.getElementById('hotel-register-form');
  const addHotelButton = document.getElementById('add-hotel');
  const closeButton = document.getElementById('hotel-register-close');
  const hotelForm = document.getElementById('hotel-form');
  document.getElementById("hotelForm").reset(); // Clear previous values
  const tableBody = document.querySelector('.hotel-table tbody');
  const formTitle = document.querySelector('.hotel-register-title');
  const managerDropdown = document.getElementById('hotel-manager');
  let currentHotelId = null;

  // Image input and preview
  const imageHandlers = [
    {
      input: document.getElementById('hotel-image'),
      previewContainer: document.getElementById('hotel-image-preview-container'),
      preview: document.getElementById('hotel-image-preview'),
      removeButton: document.getElementById('hotel-remove-image'),
    },
  ].filter(handler => handler.input && handler.previewContainer && handler.preview && handler.removeButton); // ✅ Remove null handlers

  // Initialize image preview and removal functionality
  const initializeImageHandlers = ({ input, previewContainer, preview, removeButton }) => {
    input.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
          previewContainer.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });

    removeButton.addEventListener('click', () => {
      input.value = '';
      preview.src = '';
      previewContainer.style.display = 'none';
    });
  };

  // Initialize all image handlers
  imageHandlers.forEach(handler => initializeImageHandlers(handler));

  // Open the registration form
  const openForm = () => {
    hotelRegisterForm?.classList.add('active');
    formTitle.textContent = currentHotelId ? 'Update Hotel' : 'Register Hotel';
    fetchManagers();
  };

  // Close the registration form
  const closeForm = () => {
    hotelRegisterForm.classList.remove('active');
    clearForm();
  };

  // Add event listeners for opening and closing the form
  addHotelButton?.addEventListener('click', openForm);
  closeButton?.addEventListener('click', closeForm);

  // Close the form when clicking outside it
  window.addEventListener('click', (event) => {
    if (event.target === hotelRegisterForm) {
      closeForm();
    }
  });

  // Fetch managers and populate dropdown
  const fetchManagers = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotel/getAllUserIds`);
      const responseData = await response.json();

      if (!responseData || !Array.isArray(responseData.data)) {
        console.error('Unexpected response format:', responseData);
        alert('Unexpected response from server.');
        return;
      }

      const managers = responseData.data;
      managerDropdown.innerHTML = '<option value="">Select ManagerId</option>';
      const uniqueManagerId = new Set(managers.map(hotel => hotel.managerId));
      uniqueManagerId.forEach(managerId => {
        const option = document.createElement('option');
        option.value = managerId;
        option.textContent = managerId;
        managerDropdown.appendChild(option);
      });

    } catch (error) {
      console.error('Error fetching managers:', error);
      alert('An error occurred while fetching managers.');
    }
  };

  // Fetch hotels and display in the table
  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/hotel/getAll');
      const responseData = await response.json();

      if (!responseData || !Array.isArray(responseData.data)) {
        console.error('Unexpected response format:', responseData);
        alert('Unexpected response from server.');
        return;
      }

      const hotels = responseData.data;
      tableBody.innerHTML = ''; // Clear table before adding new data
      hotels.forEach(addHotelToTable);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      alert('An error occurred while fetching hotels.');
    }
  };

  // Save or update hotel
  // hotelForm.addEventListener('submit', async (e) => {
  //   e.preventDefault();
  //
  //   const hotelName = document.getElementById('hotel-name').value;
  //   const location = document.getElementById('hotel-location').value;
  //   const image = document.getElementById('hotel-image');
  //   const description = document.getElementById('hotel-description').value;
  //   const managerId = document.getElementById('hotel-manager').value;
  //
  //   const formData = new FormData();
  //   formData.append("hotelName", hotelName);
  //   formData.append("location", location);
  //   if (image.files[0]) {
  //     formData.append("image", image.files[0], image.files[0].name);
  //   }
  //   formData.append("description", description);
  //   formData.append("managerId", managerId);
  //
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/v1/hotel/save${currentHotelId ? `/${currentHotelId}` : ''}`, {
  //       method: currentHotelId ? 'PATCH' : 'POST',
  //       body: formData,
  //     });
  //
  //     if (response.ok) {
  //       fetchHotels();
  //       closeForm();
  //       currentHotelId = null;
  //     } else {
  //       const errorText = await response.text();
  //       alert(`Failed to save hotel: ${errorText}`);
  //     }
  //   } catch (error) {
  //     console.error('Error saving hotel:', error);
  //     alert('An error occurred while saving the hotel.');
  //   }
  // });


  //save a hotel


  const updateHotel = async (hotelId) => {
    const hotelName = document.getElementById('hotel-name').value;
    const location = document.getElementById('hotel-location').value;
    const image = document.getElementById('hotel-image');
    const description = document.getElementById('hotel-description').value;
    const managerId = document.getElementById('hotel-manager').value;

    if (!managerId) {
      alert("Please select a Manager ID!");
      return;
    }

    const formData = new FormData();
    formData.append("hotelName", hotelName);
    formData.append("location", location);
    if (image.files[0]) {
      formData.append("image", image.files[0], image.files[0].name);
    }
    formData.append("description", description);
    formData.append("managerId", managerId);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotel/update/${hotelId}`, {
        method: "PATCH",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Hotel updated successfully!");
        fetchHotels();
        closeForm();
      } else {
        alert(`Failed to update hotel: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert("An error occurred while updating the hotel.");
    }
  };


  // Add a hotel to the table
  const addHotelToTable = (hotel) => {
    console.log("Hotel Data:", hotel); // Debugging: Check actual API response structure

    const row = document.createElement('tr');
    row.innerHTML = `
       <td>${hotel.id || hotel.hotelId || 'N/A'}</td>
      <td>${hotel.name || 'N/A'}</td>
      <td>${hotel.location || 'N/A'}</td>
      <td>${hotel.description || 'N/A'}</td>
      <td>
        <img src="data:image/png;base64,${hotel.image || ''}"
             alt="Hotel Image"
             class="hotel-image-table" />
      </td>
      <td>${hotel.managerId || 'N/A'}</td>
      <td><button class="update-button">Update</button></td>
      <td><button class="delete-button">Delete</button></td>
    `;

    row.querySelector('.update-button').addEventListener('click', () => openUpdateForm(hotel));
    row.querySelector('.delete-button').addEventListener('click', () => deleteHotel(hotel.id));
    tableBody.appendChild(row);
  };

  // Clear the form
  const clearForm = () => {
    hotelForm.reset();
    currentHotelId = null;
  };

  // Open the form to update a hotel
  const openUpdateForm = (hotel) => {
    currentHotelId = hotel.id;
    openForm();
    populateHotelForm(hotel);
  };

  const populateHotelForm = (hotel) => {
    document.getElementById('hotel-name').value = hotel.name;
    document.getElementById('hotel-location').value = hotel.location;
    document.getElementById('hotel-description').value = hotel.description;
    managerDropdown.value = hotel.managerId || '';

    if (hotel.image) {
      document.getElementById('hotel-image-preview').src = `data:image/png;base64,${hotel.image}`;
      document.getElementById('hotel-image-preview-container').style.display = "flex";
    }
  };

  // Delete a hotel
  const deleteHotel = async (hotelId) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/hotel/delete/${hotelId}`, { method: 'DELETE' });
        if (response.ok) fetchHotels();
      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  // Fetch initial hotel list
  fetchHotels();
});
