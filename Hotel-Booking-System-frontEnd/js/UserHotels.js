document.addEventListener('DOMContentLoaded', function() {
  fetchHotels();
});

function fetchHotels() {
  $.ajax({
    url: 'http://localhost:8080/api/v1/hotel/getAll',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
      const hotelContainer = $('#hotelGallery');
      hotelContainer.empty();

      // Make sure the container takes full width
      hotelContainer.addClass('row w-100');

      if (data && data.data && Array.isArray(data.data)) {
        data.data.forEach(function(hotel) {
          // Each card takes half the screen width
          const card = $('<div>').addClass('col-md-6 mb-4 hotel-card');

          const imageUrl = hotel.image
            ? `data:image/png;base64,${hotel.image}`
            : 'https://via.placeholder.com/800x400';

          card.html(`
            <div class="hotel-card-inner">
              <div class="hotel-image-container">
                <img src="${imageUrl}" class="hotel-img" alt="${hotel.name}">
                <div class="hotel-overlay">
                  <h3 class="hotel-title">${hotel.name}</h3>
                  <p class="hotel-location">${hotel.location || 'Location not available'}</p>

                  <div class="hotel-amenities">
                    <ul>
                      <li>Free WiFi</li>
                      <li>Private bathroom</li>
                      <li>Air conditioning</li>
                    </ul>
                  </div>

                  <p class="hotel-description">
                    ${hotel.description?.substring(0, 100)}${hotel.description?.length > 100 ? '...' : ''}
                  </p>

                  <div class="text-center mt-3">
                    <button class="btn btn-light view-details">
                      <a href="UserRoomTypes.html" class="text-decoration-none"
                         data-hotel-id="${hotel.hotel_id}">View Details</a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `);

          // Adding event listener for view details
          card.find('.view-details').on('click', function(e) {
            localStorage.setItem('selectedHotelId', hotel.hotel_id);
          });

          hotelContainer.append(card);
        });
      } else {
        console.error("Invalid data format received:", data);
        hotelContainer.html('<div class="col-12 text-center"><p>No hotels available at the moment.</p></div>');
      }
    },
    error: function(error) {
      console.error("Error fetching hotels:", error);
      $('#hotelGallery').html('<div class="col-12 text-center"><p>Error loading hotels. Please try again later.</p></div>');
    }
  });
}

// CSS styling
const style = document.createElement('style');
style.textContent = `
  .hotel-card {
    padding: 10px;
    width: 60%
  }

  .hotel-card-inner {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    width:60%
    height: 450px;
  }

  .hotel-image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .hotel-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .hotel-overlay {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .hotel-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 10px;
    color: white;
  }

  .hotel-location {
    font-size: 1rem;
    font-style: italic;
    margin-bottom: 15px;
    color: #f0f0f0;
  }

  .hotel-amenities {
    margin-bottom: 15px;
  }

  .hotel-amenities ul {
    list-style-type: none;
    padding-left: 0;
  }

  .hotel-amenities li {
    padding: 4px 0;
    position: relative;
    font-size: 0.9rem;
  }

  .hotel-amenities li:before {
    content: '•';
    position: relative;
    margin-right: 8px;
    color: #f0f0f0;
  }

  .hotel-description {
    font-size: 0.9rem;
    margin-top: auto;
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .view-details {
    background-color: white;
    color: black;
    border: none;
    padding: 8px 20px;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .view-details:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
  }

  .view-details a {
    color: #333;
  }

  /* Make sure the container row has no extra margins that would prevent full-width */
  #hotelGallery {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;
document.head.appendChild(style);
