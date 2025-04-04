document.addEventListener('DOMContentLoaded', function () {
  fetchRooms();
});

function fetchRooms() {
  $.ajax({
    url: `http://localhost:8080/api/v1/roomType/getAll`,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      const roomContainer = $('#roomItems');
      roomContainer.empty();
      roomContainer.addClass('room-container'); // Use CSS Grid

      if (data && data.data && Array.isArray(data.data)) {
        data.data.forEach(function (room) {
          const card = $('<div>').addClass('room-card');

          const imageUrl = room.image
            ? `data:image/png;base64,${room.image}`
            : 'https://via.placeholder.com/400x250';

          card.html(`
                    <div class="room-card-inner">
        <div class="room-image-container">
            <img src="${imageUrl}" class="room-img" alt="${room.name}">
            <div class="room-details">
            <div class="room-overlay">
                <p class="room-title">${room.name}</p>
                <h2 class="room-price">$${room.price}<span>/Pernight</span></h2>
            </div>
                <table>
                    <tbody>
                        <tr>
                            <td class="r-o">Capacity:</td>
                            <td>Max person ${room.noOfPersons}</td>
                        </tr>
                        <tr>
                            <td class="r-o">Available:</td>
                            <td>${room.qtyOnHand} rooms</td>
                        </tr>
                        <tr>
                            <td class="r-o">Services:</td>
                            <td>Wifi, Television, Bathroom,...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <p class="room-description">
            ${room.description || 'No description available.'}
        </p>
        <a href="booking.html" class="book-now-btn" data-room-id="${room.room_type_id}">
            Book Now
        </a>
    </div>
                    `);

          // Add event listener for book now button
          card.find('.book-now-btn').on('click', function (e) {
            localStorage.setItem('selectedRoomTypeId', room.roomTypeId);
          });

          roomContainer.append(card);
        });
      } else {
        console.error("Invalid data format received:", data);
        roomContainer.html('<div class="col-12 text-center"><p>No rooms available at the moment.</p></div>');
      }
    },
    error: function (error) {
      console.error("Error fetching rooms:", error);
      $('#roomGallery').html('<div class="col-12 text-center"><p>Error loading rooms. Please try again later.</p></div>');
    }
  });
}


// CSS Styling
const style = document.createElement('style');
style.textContent = `
.room-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
    padding: 20px;
    margin: 0 auto;
}

.room-image-container {
    position: relative;
    width: 100%;
    height: 500px;
    overflow: hidden;
    border-radius: 10px;
}

.room-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease-in-out;
}

.room-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 15px;
    transition: transform 0.6s ease-in-out;
    z-index: 2;
}

.room-details {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 15px;
    opacity: 0;
    transform: translateY(100%);
    transition: transform 0.6s ease-in-out, opacity 0.6s ease-in-out;
    z-index: 1;
}

/* Hover effect - Move overlay up and show details */
.room-card:hover .room-overlay {
    transform: translateY(-100%);
}

.room-card:hover .room-details {
    transform: translateY(0);
    opacity: 1;
}

/* Room description below the image */
.room-description {
    padding: 10px;
    font-size: 1rem;
    color: #333;
    background: white;
    margin-top: 5px;
    text-align: center;
}

`;
document.head.appendChild(style);
