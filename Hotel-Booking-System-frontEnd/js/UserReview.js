
<!-- Testimonial HTML container -->

<!-- JavaScript to Load Reviews -->
  const getStarsHTML = (rating) => {
  let html = '';
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';

  return html;
};

  const loadTestimonials = async () => {
  const container = $('#testimonial-carousel');
  const hotelId = 1; // Replace with dynamic hotel ID if needed

  try {
  const res = await fetch(`http://localhost:8080/api/v1/review/getAll`);
  const data = await res.json();
  const reviews = data.data;

  // Clear existing carousel items if any
  container.trigger('destroy.owl.carousel').html('').removeClass('owl-loaded');

  reviews.forEach(review => {
  const slide = `
          <div class="ts-item">
            <p>${review.comment}</p>
            <div class="ti-author">
              <div class="rating">${getStarsHTML(review.rating)}</div>
              <h5>- ${review.userName}</h5>
            </div>
          </div>
        `;
  container.append(slide);
});

  container.owlCarousel({
  loop: true,
  margin: 10,
  items: 1,
  autoplay: true,
  autoplayTimeout: 4000,
  autoplayHoverPause: true
});

} catch (err) {
  console.error("Error loading reviews", err);
}
};

  $(document).ready(loadTestimonials);
