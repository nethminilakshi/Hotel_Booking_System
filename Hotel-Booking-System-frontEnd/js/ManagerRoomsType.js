document.addEventListener("DOMContentLoaded", () => {
  const roomRegisterForm = document.getElementById("room-register-form");
  const addRoomButton = document.getElementById("add-room");
  const closeButton = document.getElementById("room-register-close");
  const roomForm = document.getElementById("room-form");
  const formTitle = document.querySelector(".room-register-title");
  const imageInput = document.getElementById("room-image");
  const imagePreview = document.getElementById("room-image-preview");
  const imagePreviewContainer = document.getElementById("room-image-preview-container");
  const removeImageButton = document.getElementById("room-remove-image");
  const tableBody = document.querySelector(".room-table tbody");
  let currentRoomId = null;

  // Open Room Form (Create)
  const openForm = () => {
    console.log("Opening Room Form...");
    roomRegisterForm.style.display = "flex";
    formTitle.textContent = "Register Room Type";
    currentRoomId = null;
    clearForm();
  };

  // Close Room Form
  const closeForm = () => {
    console.log("Closing Room Form...");
    roomRegisterForm.style.display = "none";
    clearForm();
  };

  addRoomButton?.addEventListener("click", openForm);
  closeButton?.addEventListener("click", closeForm);

  // Close form when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === roomRegisterForm) {
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

  // Fetch Room Types
  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/roomType/getAll");
      if (!response.ok) throw new Error("Failed to fetch room types");

      const result = await response.json();
      const rooms = result.data || []; // Ensure it's an array
      tableBody.innerHTML = "";
      rooms.forEach(addRoomToTable);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("An error occurred while fetching room types.");
    }
  };

  // Add Room Type to Table
  const addRoomToTable = (room) => {
    console.log("Room Data:", room); // Debugging line

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${room.roomId || room.typeId || "N/A"}</td>
        <td>${room.description || "N/A"}</td>
        <td>${room.price || "N/A"}</td>
        <td>${room.qtyOnHand || "N/A"}</td>
        <td>
            <img src="data:image/png;base64,${room.image || ''}"
                 alt="Room Image"
                 class="room-image-table" />
        </td>
        <td><span class="update-button"><i class="fas fa-edit">update</i></span></td>
        <td><span class="delete-button"><i class="fas fa-trash">delete</i></span></td>
    `;

    row.querySelector(".update-button").addEventListener("click", () => openUpdateForm(room));
    row.querySelector(".delete-button").addEventListener("click", () => deleteRoom(room.roomId || room.typeId));

    tableBody.appendChild(row);
  };

  // Open Update Form
  const openUpdateForm = (room) => {
    currentRoomId = room.roomId || room.typeId;  // Use typeId or roomId to identify
    openForm();
    populateRoomForm(room);
  };

  // Populate Room Form with existing data (for update)
  const populateRoomForm = (room) => {
    document.getElementById("room-description").value = room.description;
    document.getElementById("room-price").value = room.price;
    document.getElementById("room-qty").value = room.qtyOnHand;

    if (room.image) {
      imagePreview.src = `data:image/png;base64,${room.image}`;
      imagePreviewContainer.style.display = "flex";
    }
  };

  // Save Room Type (Create or Update)
  roomForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const description = document.getElementById("room-description").value;
    const price = document.getElementById("room-price").value;
    const quantity = document.getElementById("room-qty").value;
    const roomImage = imageInput.files[0];

    const formData = new FormData();
    formData.append("description", description);
    formData.append("price", price);
    formData.append("qtyOnHand", quantity);
    if (roomImage) {
      formData.append("image", roomImage);
    }

    try {
      const url = currentRoomId ? `http://localhost:8080/api/v1/roomType/update/${currentRoomId}` : "http://localhost:8080/api/v1/roomType/save";
      const method = currentRoomId ? "PATCH" : "POST"; // PATCH for updating, POST for creating

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to save room type: ${response.statusText}`);

      fetchRooms(); // Refresh room list
      closeForm();  // Close the form
      currentRoomId = null; // Reset room ID after saving
    } catch (error) {
      console.error("Error saving room type:", error);
      alert(error.message);
    }
  });

  // Delete Room Type
  const deleteRoom = async (roomId) => {
    if (!confirm("Are you sure you want to delete this room type?")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/roomType/delete/${roomId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete room type");

      fetchRooms();
    } catch (error) {
      console.error("Error deleting room type:", error);
      alert("An error occurred while deleting the room type.");
    }
  };

  // Clear Form
  const clearForm = () => {
    roomForm.reset();
    imagePreview.src = "";
    imagePreviewContainer.style.display = "none";
    currentRoomId = null;
  };

  // Fetch Initial Data
  fetchRooms();
});
