document.addEventListener('DOMContentLoaded', function () {
  fetchRooms();
});

function fetchRooms() {
  fetch('http://localhost:8080/api/v1/roomType/getAll')
    .then(response => response.json())
    .then(data => {
      const carouselContainer = document.getElementById('roomCarousel');
      carouselContainer.innerHTML = '';

      data.data.forEach(room => {
        const imageUrl = room.image
          ? `data:image/png;base64,${room.image}`
          : 'https://via.placeholder.com/350x250';

        const roomItem = document.createElement('div');
        roomItem.className = 'items';
        roomItem.innerHTML = `
          <div class="image">
            <img src="${imageUrl}" alt="${room.description}">
          </div>
          <div class="text">
            <h2>${room.description}</h2>
            <div class="rate flex">
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
              <i class="fa fa-star"></i>
            </div>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
            <div class="button flex">
              <button class="primary-btn">BOOK NOW</button>
              <h3>$${room.price} <span> <br> Per Night </span> </h3>
            </div>
          </div>
        `;

        carouselContainer.appendChild(roomItem);
      });

      // Initialize Owl Carousel after dynamically adding items
      $(".owl-carousel1").owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        autoplay: true,
        autoplayTimeout: 3000,
        responsive: {
          0: { items: 1 },
          600: { items: 2 },
          1000: { items: 3 }
        }
      });
    })
    .catch(error => console.error('Error fetching room types:', error));


}


const tableBody = document.querySelector(".room-table tbody");
// Fetch Room Types
const fetchRooms = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/roomTypeController/getAll");
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
        <td>${room.name || room.name || "N/A"}</td>
        <td>${room.description || "N/A"}</td>
        <td>${room.price || "N/A"}</td>
        <td>${room.qtyOnHand || "N/A"}</td>

    `;
  tableBody.appendChild(row);
};
// Fetch Initial Data
fetchRooms();
