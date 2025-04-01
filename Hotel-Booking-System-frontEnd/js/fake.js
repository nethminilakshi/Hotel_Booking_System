$(document).ready(function() {
  loadFilms();
  loadFilmsHalls();
  fetchSpices();
  loadTimeTable();
});

// Function to load films into dropdown
function loadFilms() {
  $.ajax({
    url: 'http://localhost:8080/api/v1/film/get',
    type: 'GET',
    success: (res) => {
      console.log(res);

      // Clear existing options
      $('#locationSelect').empty();

      // Add default option
      $('#locationSelect').append('<option value="">select film</option>');

      // Add options from response data
      if (res.data && res.data.length > 0) {
        res.data.forEach(film => {
          $('#locationSelect').append(<option value="${film.title}">${film.title}</option>);
        });
      } else {
        console.log("No data found in response");
      }
    },
    error: (err) => {
      console.log(err);
    }
  });
}

function loadFilmsHalls() {
  $.ajax({
    url: 'http://localhost:8080/api/v1/example/get',
    type: 'GET',
    success: (res) => {
      console.log(res);

      // Clear existing options
      $('#FilmSelect').empty();

      // Add default option
      $('#FilmSelect').append('<option value="">select film</option>');

      // Add options from response data
      if (res.data && res.data.length > 0) {
        res.data.forEach(film => {
          $('#FilmSelect').append(<option value="${film.name}">${film.name}</option>);
        });
      } else {
        console.log("No data found in response");
      }
    },
    error: (err) => {
      console.log(err);
    }
  });
}

function loadTimeTable() {
  $.ajax({
    url: 'http://localhost:8080/api/v1/time-table/getAll',
    type: 'GET',
    success: (res) => {
      console.log(res);

      // Clear existing options
      $('#TimeSelect').empty();

      // Add default option
      $('#TimeSelect').append('<option value="">select film</option>');

      // Add options from response data
      if (res.data && res.data.length > 0) {
        res.data.forEach(film => {
          $('#TimeSelect').append(<option value="${film.description}">${film.description}</option>);
        });
      } else {
        console.log("No data found in response");
      }
    },
    error: (err) => {
      console.log(err);
    }
  });
}

$(document).ready(function() {
  // Function to format date as YYYY-MM-DD
  function formatDate(date) {
    return date.toISOString().split('T')[0];
  }

  // Function to generate date options
  function populateDateDropdown() {
    const $select = $('#DateSelect');

    // Clear existing options except the first one
    $select.find('option:not(:first)').remove();

    // Get current date
    const today = new Date();

    // Generate options for today and next 5 days
    for (let i = 0; i < 6; i++) {
      // Create a new date by adding days to the current date
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Format for display and value
      const formattedDate = formatDate(currentDate);

      // Create readable date string
      const displayDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      // Add option to dropdown
      $select.append(
        `<option value="${formattedDate}" ${i === 0 ? 'selected' : ''}>
          ${i === 0 ? 'Today - ' : ''} ${displayDate}
        </option>`
      );
    }
  }

  // Call the function to populate dropdown
  populateDateDropdown();

  // Optional: Refresh dates daily at midnight
  setInterval(populateDateDropdown, 24 * 60 * 60 * 1000);
});

function fetchSpices() {
  fetch('http://localhost:8080/api/v1/film-registration/getAll')
    .then(response => response.json())
    .then(data => {
      const spiceContainer = document.getElementById('spiceContainer');
      spiceContainer.innerHTML = '';
      data.data.forEach(spice => {
        const card = document.createElement('div');
        card.className = 'col-md-4 spice-card';

        card.innerHTML = `
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">${spice.hallName}</h5>
              <h5 class="card-title">${spice.filmTitle}</h5>
              <h5 class="card-title">${spice.timeDescription}</h5>
            </div>
          </div>
        `;
        spiceContainer.appendChild(card);
      });
    })
    .catch(error => console.error('Error fetching spices:', error));
}

function navigateToNextPage() {
  // Store the selected values in localStorage before navigating
  const selectedFilm = $('#locationSelect').val() || '';
  const selectedHall = $('#FilmSelect').val() || '';
  const selectedDate = $('#DateSelect').val() || '';
  const selectedTime = $('#TimeSelect').val() || '';

  // Save to localStorage
  localStorage.setItem('selectedFilm', selectedFilm);
  localStorage.setItem('selectedHall', selectedHall);
  localStorage.setItem('selectedDate', selectedDate);
  localStorage.setItem('selectedTime', selectedTime);

  $.ajax({
    url: 'http://localhost:8080/api/v1/film-registration/getAll',
    type: "GET",
    success: (res) => {
      let matchFound = false;

      res.data.forEach(customer => {
        let hall = customer.hallName;
        let film = customer.filmTitle;
        let time = customer.timeDescription;

        // Get values from dropdowns
        let selectedHallValue = $('#FilmSelect').val();
        let selectedFilmValue = $('#locationSelect').val();
        let selectedTimeValue = $('#TimeSelect').val();

        // Check if the selected values match the current customer's details
        if ((film === selectedFilmValue) &&
          (hall === selectedHallValue) &&
          (time === selectedTimeValue)) {
          matchFound = true;

          if(hall === "SCOPE CINEMAS MULTIPLEX - Colombo City Centre") {
            window.location.href = hh.html;
            return false;
          }

          if(hall === "SCOPE CINEMAS MULTIPLEX - Havelock City Mall") {
            window.location.href = ss.html;
            return false;
          }
        }
      });
    }
  });
}
