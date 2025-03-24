const tableBody = document.querySelector('.hotel-table tbody');
const imageInput = document.getElementById("hotel-image");
const imagePreview = document.getElementById("hotel-image-preview");
const imagePreviewContainer = document.getElementById("hotel-image-preview-container");
let currentHotelId = null;



// Fetch Hotel
const fetchHotel = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/hotelController/getAll");
    if (!response.ok) throw new Error("Failed to fetch hotels");

    const result = await response.json();
    const rooms = result.data || []; // Ensure it's an array
    tableBody.innerHTML = "";
    rooms.forEach(addHotelToTable);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    alert("An error occurred while fetching hotels.");
  }
};

// Add Hotel to Table
const addHotelToTable = (hotel) => {
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

    `;

  tableBody.appendChild(row);
};
// Fetch initial hotel list
fetchHotel();
