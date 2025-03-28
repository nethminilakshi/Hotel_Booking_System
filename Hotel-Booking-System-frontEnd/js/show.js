document.addEventListener('DOMContentLoaded', function() {
  fetchSpices();
});

function fetchSpices() {
  fetch('http://localhost:8080/api/v1/hotel/getAll')
    .then(response => response.json())
    .then(data => {
      const spiceContainer = document.getElementById('spiceContainer');
      spiceContainer.innerHTML = '';
      data.data.forEach(spice => {
        const card = document.createElement('div');
        card.className = 'col-md-4 spice-card';
        const imageUrl = spice.image
          ? `data:image/png;base64,${spice.image}`
          : 'https://via.placeholder.com/150';
        card.innerHTML = `
                    <div class="card mb-4">
                        <img src="${imageUrl}" class="card-img-top" alt="Spice Image">
                        <div class="card-body">
                            <h5 class="card-title">${spice.name}</h5>
                            <p class="card-text">${spice.description}</p>


                        </div>
                    </div>
                `;
        spiceContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching spices:', error));
}

function filterSpices() {
  const filter = document.getElementById('filterInput').value.toLowerCase();
  const cards = document.getElementsByClassName('spice-card');
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const name = card.getElementsByClassName('card-title')[0].innerText.toLowerCase();
    if (name.includes(filter)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  }
}
