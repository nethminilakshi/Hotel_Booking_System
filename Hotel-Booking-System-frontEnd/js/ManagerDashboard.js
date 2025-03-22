document.addEventListener('DOMContentLoaded', function() {
  // Visitors Chart
  const visitorsCtx = document.getElementById('visitorsChart').getContext('2d');
  new Chart(visitorsCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: '#37B7A4',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    }
  });

  // Patients Chart
  const patientsCtx = document.getElementById('patientsChart').getContext('2d');
  new Chart(patientsCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [45, 52, 38, 45, 19, 23, 25],
        borderColor: '#37B7A4',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    }
  });

  // Patient Statistics Chart
  const patientStatsCtx = document.getElementById('patientStatsChart').getContext('2d');
  new Chart(patientStatsCtx, {
    type: 'bar',
    data: {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
        {
          label: 'Booking',
          data: [950, 792, 490, 810, 485, 320, 205],
          backgroundColor: '#37B7A4',
          borderRadius: 5,
          barPercentage: 0.6,
          categoryPercentage: 0.7
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            borderDash: [5, 5]
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  });

  // Initialize all dropdowns
  var dropdowns = document.querySelectorAll('.dropdown-toggle');
  dropdowns.forEach(function(dropdown) {
    new bootstrap.Dropdown(dropdown);
  });

  // Simple Calendar Implementation
  function createCalendar() {
    const calendarWidget = document.querySelector('.calendar-widget');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Create days header
    let headerHtml = '<div class="calendar-header d-flex justify-content-between">';
    days.forEach(day => {
      headerHtml += `<div class="calendar-day-name">${day}</div>`;
    });
    headerHtml += '</div>';

    // Create calendar grid
    let gridHtml = '<div class="calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">';
    for(let i = 1; i <= 31; i++) {
      gridHtml += `
                <div class="calendar-day text-center" style="${i === 10 ? 'background: #e8f5ff; border-radius: 5px; color: #0d6efd;' : ''}">
                    ${i}
                </div>
            `;
    }
    gridHtml += '</div>';

    calendarWidget.innerHTML = headerHtml + gridHtml;
  }

  createCalendar();
});
