document.addEventListener('DOMContentLoaded', () => {
  const hotelRegisterForm = document.getElementById('hotel-register-form');
  const addHotelButton = document.getElementById('add-hotel');
  const closeButton = document.getElementById('hotel-register-close');
  const hotelForm = document.getElementById('hotel-form');
  const tableBody = document.querySelector('.hotel-table tbody');
  const formTitle = document.querySelector('.hotel-register-title');
  const managerDropdown = document.getElementById('hotel-manager');
  let currentHotelId = null;

  // Image input and preview mapping
  const imageHandler = {
    input: document.getElementById('hotel-image'),
    previewContainer: document.getElementById('hotel-image-preview-container'),
    preview: document.getElementById('hotel-image-preview'),
    removeButton: document.getElementById('hotel-remove-image'),
  };

  // Open the registration form
  const openForm = () => {
    hotelRegisterForm?.classList.add('active');
    formTitle.textContent = currentHotelId ? 'Update Hotel' : 'Register Hotel';
    fetchManagers();
  };

  // Close the registration form
  const closeForm = () => {
    hotelRegisterForm?.classList.remove('active');
    clearForm();
  };

  // Initialize image preview and removal functionality
  const initializeImageHandler = ({ input, previewContainer, preview, removeButton }) => {
    if (!input || !previewContainer || !preview || !removeButton) {
      console.error('Missing elements for image handling.');
      return;
    }

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

  // Add event listeners for opening and closing the form
  addHotelButton?.addEventListener('click', openForm);
  closeButton?.addEventListener('click', closeForm);

  // Close the form when clicking outside it
  window.addEventListener('click', (event) => {
    if (event.target === hotelRegisterForm) {
      closeForm();
    }
  });

  // Initialize image handler
  initializeImageHandler(imageHandler);

  // Fetch hotels and display in the table
  const fetchHotels = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/hotel/getAll');

      if (response.ok) {
        const hotels = await response.json();
        tableBody.innerHTML = '';
        hotels.forEach(addHotelToTable);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch hotels:', response.status, errorText);
        alert('Failed to fetch hotels. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      alert('An error occurred while fetching hotels.');
    }
  };

  // Fetch managers and populate dropdown
  const fetchManagers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/manager');

      if (!response.ok) {
        console.error('Failed to fetch managers with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        alert('Failed to fetch managers. Please try again later.');
        return;
      }

      const managers = await response.json();
      if (managers.length === 0) {
        console.log('No managers available.');
        return;
      }

      // Clear the dropdown before adding new options
      managerDropdown.innerHTML = '<option value="">Select Manager</option>';

      // Add managers to the dropdown
      managers.forEach(manager => {
        const option = document.createElement('option');
        option.value = manager.managerId;
        option.textContent = manager.name || manager.managerId;
        managerDropdown.appendChild(option);
      });
    } catch (error) {
      console.error('Error fetching managers:', error);
      alert('An error occurred while fetching managers.');
    }
  };

  // Save or update hotel
  hotelForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const hotelId = document.getElementById('hotel-id').value;
    const hotelName = document.getElementById('hotel-name').value;
    const location = document.getElementById('hotel-location').value;
    const description = document.getElementById('hotel-description').value;
    const hotelImage = document.getElementById('hotel-image');
    const managerId = document.getElementById('hotel-manager').value;

    const formdata = new FormData();

    formdata.append("hotelId", hotelId);
    formdata.append("name", hotelName);
    formdata.append("location", location);
    formdata.append("description", description);
    if (hotelImage.files[0]) {
      formdata.append("image", hotelImage.files[0], hotelImage.files[0].name);
    }
    formdata.append("managerId", managerId);

    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotel/save/${currentHotelId ? `/${currentHotelId}` : ''}`, {
        method: currentHotelId ? 'PATCH' : 'POST',
        body: formdata,
      });

      if (response.ok) {
        fetchHotels();
        closeForm();
        currentHotelId = null;
      } else {
        const errorText = await response.text();
        alert(`Failed to save hotel: ${response.statusText} (${response.status})`);
      }
    } catch (error) {
      console.error('Error saving hotel:', error);
      alert('An error occurred while saving the hotel.');
    }
  });

  // Function to add a hotel to the table
  const addHotelToTable = (hotel) => {
    const row = document.createElement('tr');

    row.innerHTML = `
            <td>${hotel.hotelId || 'N/A'}</td>
            <td>${hotel.name || 'N/A'}</td>
            <td>${hotel.location || 'N/A'}</td>
            <td>${hotel.description ? (hotel.description.length > 50 ? hotel.description.substring(0, 50) + '...' : hotel.description) : 'N/A'}</td>
            <td><img src="data:image/png;base64,${hotel.image || ''}" alt="Hotel Image" class="hotel-image-table" /></td>
            <td>${hotel.managerName || hotel.managerId || 'N/A'}</td>
            <td><button class="hotel-update-button">Update</button></td>
            <td><button class="hotel-delete-button">Delete</button></td>
        `;

    row.querySelector('.hotel-update-button').addEventListener('click', () => openUpdateForm(hotel));
    row.querySelector('.hotel-delete-button').addEventListener('click', () => deleteHotel(hotel.hotelId));

    tableBody.appendChild(row);
  };

  // Clear the form
  const clearForm = () => {
    hotelForm.reset();
    imageHandler.previewContainer.style.display = 'none';
    currentHotelId = null;
  };

  // Open the form to update a hotel
  const openUpdateForm = (hotel) => {
    currentHotelId = hotel.hotelId; // Set the current hotel ID for updating
    openForm();
    populateHotelForm(hotel);
  };

  // Populate the hotel form with the existing hotel data
  const populateHotelForm = (hotel) => {
    document.getElementById('hotel-id').value = hotel.hotelId;
    document.getElementById('hotel-name').value = hotel.name || '';
    document.getElementById('hotel-location').value = hotel.location || '';
    document.getElementById('hotel-description').value = hotel.description || '';
    managerDropdown.value = hotel.managerId || '';

    // If there's an image, we can't directly set it in the file input,
    // but we can show it in the preview
    if (hotel.image) {
      imageHandler.preview.src = `data:image/png;base64,${hotel.image}`;
      imageHandler.previewContainer.style.display = 'flex';
    }
  };

  // Delete a hotel
  const deleteHotel = async (hotelId) => {
    const confirmDelete = confirm('Are you sure you want to delete this hotel?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/hotel/delete/${hotelId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchHotels();
        } else {
          const errorText = await response.text();
          console.error('Failed to delete hotel:', response.status, errorText);
          alert('Failed to delete hotel. Please try again later.');
        }
      } catch (error) {
        console.error('Error deleting hotel:', error);
        alert('An error occurred while deleting the hotel.');
      }
    }
  };

  // Fetch initial hotels when the page loads
  fetchHotels();
});
