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
  const managerDropdown = document.getElementById('hotel-manager');
  let currentHotelId = null;

  // Image input and preview
  const imageHandlers = [
    {
      input: document.getElementById('hotel-image'),
      previewContainer: document.getElementById('hotel-image-preview-container'),
      preview: document.getElementById('hotel-image-preview'),
      removeButton: document.getElementById('hotel-remove-image'),
    }
  ];
  // Open the registration form
  const openForm = () => {
    console.log("Opening Hotel Form...");
    hotelRegisterForm.style.display = "flex";
    formTitle.textContent = "Register Hotel ";
    currentHotelId = null;
    clearForm();
  };

  // Close the registration form
  const closeForm = () => {
    console.log("Closing Hotel Form...");
    hotelRegisterForm.style.display = "none";
    clearForm();
  };

  // Add event listeners for opening and closing the form
  addHotelButton?.addEventListener("click", openForm);
  closeButton?.addEventListener("click", closeForm);


  // Close the form when clicking outside it
  window.addEventListener('click', (event) => {
    if (event.target === hotelRegisterForm) {
      closeForm();
    }
  });


  // Image preview handling
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



  // load hotel details to dropdown
  $(document).ready(() => {
    $('#load-hotel-ids').click((e) => {
      e.preventDefault();

      $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAll',
        type: 'GET',
        success: (res) => {
          console.log("Response from server:", res);

          $('#managerId').empty();

          $('#managerId').append('<option value="">-- Select Manager --</option>');

          if (res.data && Array.isArray(res.data) && res.data.length > 0) {
            res.data.forEach(manager => {
              $('#managerId').append(
                `<option value="${manager.userId}">${manager.username}</option>`
              );
            });
          } else {
            console.log("No managers found.");
          }
        },
        error: (err) => {
          console.error("Error fetching manager IDs:", err);
        }
      });
    });

    // Capture the selected hotel ID
    $('#managerId').change(function () {
      const selectedId = $(this).val();
      const selectedName = $(this).find("option:selected").text();
      console.log("Selected manager ID:", selectedId);
      console.log("Selected manager Name:", selectedName);
    });
  });



  // Fetch Hotel
  const fetchHotel = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/hotel/getAll");
      if (!response.ok) throw new Error("Failed to fetch hotels");

      const result = await response.json();
      const rooms = result.data || []; // Ensure it's an array
      tableBody.innerHTML = "";
      rooms.forEach(addRoomToTable);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      alert("An error occurred while fetching hotels.");
    }
  };

  // Add Hotel to Table
  const addRoomToTable = (hotel) => {
    console.log("Room Data:", hotel); // Debugging line

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${hotel.hotelId  || "N/A"}</td>
        <td>${hotel.name || "N/A"}</td>
        <td>${hotel.location || "N/A"}</td>
        <td>${hotel.description || "N/A"}</td>
        <td>
            <img src="data:image/png;base64,${hotel.image || ''}"
                 alt="Hotel Image"
                 class="hotel-image-table" />
        </td>
        <td>${hotel.managerId || "N/A"}</td>
        <td><span class="update-button"><i class="fas fa-edit">update</i></span></td>
        <td><span class="delete-button"><i class="fas fa-trash">delete</i></span></td>
    `;

    row.querySelector(".update-button").addEventListener("click", () => openUpdateForm(hotel));
    row.querySelector(".delete-button").addEventListener("click", () => deleteHotel(hotel.hotelId));

    tableBody.appendChild(row);
  };

// Open Update Form
  const openUpdateForm = (hotel) => {
    currentHotelId = hotel.hotelId; // Set the ID for update
    openForm();
    populateHotelForm(hotel);
  };

// Populate form fields with existing data
  const populateHotelForm = (hotel) => {
    document.getElementById('hotel-name').value = hotel.name;
    document.getElementById('hotel-location').value = hotel.location;
    document.getElementById('hotel-description').value = hotel.description;
    document.getElementById('managerId').value = hotel.managerId || '';

    if (hotel.image) {
      document.getElementById('hotel-image-preview').src = `data:image/png;base64,${hotel.image}`;
      document.getElementById('hotel-image-preview-container').style.display = "flex";
    }
  };

// Handle form submission (Detects Save or Update)
  hotelForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    currentHotelId ? updateHotel() : saveHotel();
  });

// Function to save a new hotel
  const saveHotel = async () => {
    const formData = getFormData();

    try {
      const response = await fetch("http://localhost:8080/api/v1/hotel/save", {
        method: "POST",
        body: formData
      });

      const result = await response.text();
      console.log("Server Response:", result);

      if (!response.ok) throw new Error(`Failed to save hotel: ${response.statusText}`);

      alert("Hotel saved successfully!");
      fetchHotel(); // Refresh hotel list
      closeForm();
    } catch (error) {
      console.error("Error saving hotel:", error);
      alert(error.message);
    }
  };

// Function to update an existing hotel
  const updateHotel = async () => {
    const formData = new FormData();
    formData.append("hotelName", document.getElementById('hotel-name').value);
    formData.append("location", document.getElementById('hotel-location').value);
    formData.append("description", document.getElementById("hotel-description").value);
    formData.append("manager_id", document.getElementById('managerId').value);

    const image = imageInput.files[0];
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/hotel/update/${currentHotelId}`, {
        method: "PUT",
        body: formData
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (!response.ok) throw new Error(`Failed to update hotel: ${response.statusText}`);

      alert("Hotel updated successfully!");
      fetchHotel();
      closeForm();
      currentHotelId = null;
    } catch (error) {
      console.error("Error updating hotel:", error);
      alert(error.message);
    }
  };


// Function to get form data
  const getFormData = () => {
    const formData = new FormData();
    formData.append("name", document.getElementById('hotel-name').value);
    formData.append("location", document.getElementById('hotel-location').value);
    formData.append("description", document.getElementById("hotel-description").value);
    formData.append("manager_id", document.getElementById('managerId').value);

    const image = imageInput.files[0];
    if (image) {
      formData.append("image", image);
    }

    return formData;
  };




  // Clear Form
  const clearForm = () => {
    hotelForm.reset();
    imagePreview.src = "";
    imagePreviewContainer.style.display = "none";
    currentHotelId = null;
  };



  // Delete a hotel
  const deleteHotel = async (hotelId) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/hotel/delete/${hotelId}`, {
          method: 'DELETE'
        });
        if (response.ok) fetchHotel();
      } catch (error) {
        console.error('Error deleting hotel:', error);
      }
    }
  };

  // Fetch initial hotel list
  fetchHotel();
});
