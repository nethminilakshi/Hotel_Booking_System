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

    <!-- Main overlay -->
    <div class="room-overlay">
      <div class="room-summary">
        <p class="room-title">${room.name}</p>
        <h2 class="room-price">$${room.price}<span>/Pernight</span></h2>
      </div>

      <div class="room-extra-details">
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
        <!-- View Details Link (Opens Modal) -->
        <a href="#" class="view-details-link" data-room='${JSON.stringify(room)}'>VIEW DETAILS</a>
      </div>
    </div>
  </div>

  <!-- Room Description -->
  <p class="room-description">${room.description || 'No description available.'}</p>

  <!-- Book Now Button -->
  <div class="room-buttons">
    <a href="booking.html" class="room-btn book-now-btn" data-room-id="${room.roomTypeId}">Book Now</a>
  </div>
</div>
   `);

          // Add event listener for book now button
          card.find('.book-now-btn').on('click', function () {
            localStorage.setItem('selectedRoomTypeId', room.roomTypeId);
          });

          // Add event listener to "View Details" to open modal
          card.find('.view-details-link').on('click', function (event) {
            event.preventDefault();
            openRoomDetailsModal(JSON.parse($(this).attr('data-room')));
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

function openRoomDetailsModal(room) {
  $('#modal-room-title').text(room.name);
  $('#modal-room-price').text(`Price: $${room.price} / Per Night`);
  $('#modal-room-capacity').text(`Capacity: Max person ${room.noOfPersons}`);
  $('#modal-room-available').text(`Available: ${room.qtyOnHand} rooms`);
  $('#modal-room-description').text(room.description || 'No description available.');

  const imageUrl = room.image
    ? `data:image/png;base64,${room.image}`
    : 'https://via.placeholder.com/500x300';
  $('#modal-room-img').attr('src', imageUrl);

  $('#roomDetailsModal').fadeIn();
}


// Close modal function
function closeModal() {
  $('#roomDetailsModal').fadeOut();
}

// Event listener for closing modal when clicking outside or pressing close button
$(document).ready(function () {
  $('#closeModal').on('click', closeModal);
  $('#roomDetailsModal').on('click', function (event) {
    if ($(event.target).is('#roomDetailsModal')) closeModal();
  });
});


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

.room-card-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.room-image-container {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    border-radius: 10px;
}

.room-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease-in-out;
}

.room-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 20px;
    box-sizing: border-box;
    transition: all 0.4s ease-in-out;
}

.room-summary {
    display: block;
}
.room-title {
    font-size: 22px;
    font-weight: bold;
    color: #fff;
}
.room-price {
    font-size: 20px;
    font-weight: bold;
    color: #a37905;
}

.room-extra-details {
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: all 0.4s ease-in-out;
}

/* Room description: Full length & aligned */
.room-description {
    padding: 6px;
    margin: 0;
    font-size: 1rem;
    color: #333;
    background: #f8f8f8;
    width: 100%;
    text-align: center;
    border-radius: 5px;
    min-height: 50px;
    max-height: none;
    overflow-wrap: break-word;
}

/* Buttons container */
.room-buttons {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    width: 100%;
}

/* Book Now button */
.book-now-btn {
    text-decoration: none;
    padding: 10px 15px;
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    transition: background 0.3s ease-in-out;
    text-align: center;
    background: #363534;
    color: white;
}

.book-now-btn:hover {
    background: #807f7e;
}

/* View Details link (Hidden by default) */
.view-details-link {
    display: none;
    color: #a6a5a2;
    text-decoration: underline;
    font-size: 1rem;
    font-weight: bold;
    margin-top: 10px;

}

/* Hover effect: Expand overlay & show extra details + View Details link */
.room-card:hover .room-overlay {
    background-color: rgba(0, 0, 0, 0.9);
    padding-bottom: 30px;
}

.room-card:hover .room-extra-details {
    max-height: 300px;
    opacity: 1;
}

/* Show "View Details" link on hover */
.room-card:hover .view-details-link {
    display: block;
    text-align: center;
    margin-top: 15px;
}
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 16%;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}


.modal-content {
  background-color: #fff;
  margin: 0 auto;
  padding: 20px;
  width: 50%;
  text-align: center;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-content img {
  width: 80%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
}

/* Style for room details */
.modal-content h2 {
  font-size: 22px;
  margin-bottom: 10px;
  color: #333;
}

.modal-content p {
  font-size: 16px;
  margin: 5px 0;
  color: #666;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #555;
}

.close:hover {
  color: red;
}

`;
document.head.appendChild(style);
