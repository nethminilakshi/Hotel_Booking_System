document.addEventListener('DOMContentLoaded', function() {
  fetchHotels();
});

function fetchHotels() {
  fetch('http://localhost:8080/api/v1/hotel/getAll')
    .then(response => response.json())
    .then(data => {
      const hotelContainer = document.getElementById('hotelGallery');
      hotelContainer.innerHTML = '';
      data.data.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4 hotel-card';

        const imageUrl = hotel.image
          ? `data:image/png;base64,${hotel.image}`
          : 'https://via.placeholder.com/350x250';

        card.innerHTML = `
          <div class="card hotel-card-inner border-0 shadow-sm h-100">
            <h3 class="hotel-title text-center py-3">${hotel.name}</h3>
            <div class="hotel-image-container">
              <img src="${imageUrl}" class="card-img-top hotel-img" alt="${hotel.name}">
            </div>
            <div class="card-body px-0">
              <div class="hotel-description-container">
                <p class="card-text hotel-description text-muted text-center px-3">
                  ${hotel.description}
                </p>
              </div>
              <div class="text-center">
                <button class="btn btn-primary view-details"
                        data-hotel-id="${hotel.hotel_id}"> <a href="UserRoomTypes.html">Check Details</a>
                </button>
              </div>
            </div>

          </div>
        `;

        // Adding event listener for view details
        card.querySelector('.view-details')?.addEventListener('click', () => {
          // You can implement navigation or modal to show hotel details
          console.log(`View details for hotel: ${hotel.hotel_id}`);
        });

        hotelContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching hotels:', error));
}

// Optional: Add some dynamic styling
const style = document.createElement('style');
style.textContent = `
  .hotel-card-inner {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
    margin: 15px 10px;
    padding: 20px;
    height: auto;
  }

  .hotel-card-inner:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.12) !important;
  }

  .hotel-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #6c757d;
    margin-bottom: 15px;
    background: linear-gradient(45deg, #6c757d, #495057);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .hotel-image-container {
    width: 60%;
    position: relative;
    overflow: hidden;
  }

  .hotel-img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    transition: transform 0.3s ease;
    padding: 10px;
  }

  .hotel-card-inner:hover .hotel-img {
    transform: scale(1.1);
  }

  .hotel-description-container {
    max-height: 150px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
  }

  .hotel-description-container::-webkit-scrollbar {
    width: 8px;
  }

  .hotel-description-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .hotel-description-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .hotel-description {
    font-size: 0.9rem;
    color: #555;
    text-align: left;
    padding: 0 15px;
  }

  .view-details {
    margin-top: 10px;
  }
`;
document.head.appendChild(style);
