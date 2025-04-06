let bookingValues;
let seatidentify;
let id =1;


function createSeatMap() {


  // Do something with currentSeat

  const container = document.getElementById('seat-container');

  rowLetters.forEach(row => {
    const rowElement = document.createElement('div');
    rowElement.className = 'seat-row';

    const rowLabel = document.createElement('div');
    rowLabel.className = 'seat-label';
    rowLabel.textContent = row;
    rowElement.appendChild(rowLabel);

    // Determine which seats to use based on the row
    const rowSeats = rowLettersWithFullColumns.includes(row) ? seats[row] : seats['default'];

    rowSeats.forEach((seat, index) => {
      // Add aisle space after the 3rd seat
      if (index === 3) {
        const aisleSpace = document.createElement('div');
        aisleSpace.className = 'aisle-space';
        rowElement.appendChild(aisleSpace);
      }

      const seatElement = document.createElement('div');
      seatElement.className = 'seat';
      seatElement.textContent = seat;

      const seatId = row + seat;

      if (reservedSeats.includes(seatId)) {
        seatElement.classList.add('reserved');
      } else {
        seatElement.classList.add('available');

        // Add click event to toggle selection
        seatElement.addEventListener('click', function() {
          if (this.classList.contains('available')) {
            if (this.classList.contains('selected')) {
              this.classList.remove('selected');
              // Remove from selected seats array
              const index = selectedSeats.indexOf(seatId);
              if (index > -1) {
                selectedSeats.splice(index, 1);
              }
            } else {
              this.classList.add('selected');
              // Add to selected seats array
              selectedSeats.push(seatId);
            }

            // Print the row letter and seat number
            console.log("Selected seat:", row + seat);
            console.log("Row Letter:", row);
            console.log("Seat Number:", seat);
            seatidentify =seatId;

          }
        });
      }

      rowElement.appendChild(seatElement);
    });

    container.appendChild(rowElement);
  });

  console.log("create")

}




function getAllDivValues() {
  // Get all divs inside the container
  const divs = bookingInfoContainer.querySelectorAll('.booking-info-item');

  // Map through the div elements to get their values
  const values = Array.from(divs).map(div => {
    return {
      textValue: div.textContent,
      dataValue: div.getAttribute('data-value')

    };
  });
  console.log(values)
  bookingValues= values;
  return values;

}
$(document).ready(function() {
  getAllDivValues()
  colouringSeats()


});




function booking() {


  console.log("===================")
  console.log(bookingValues);
  console.log(seatidentify);


  const film =  bookingValues[0].textValue.substring(14);
  const filmHall = bookingValues[1].textValue.substring(15);
  const date =   bookingValues[2].textValue.substring(15);
  const time =  bookingValues[3].textValue.substring(14);



  const seat = seatidentify



  const customerData ={
    id: id,

    bookingDate: date,
    film:  film,
    filmHall:  filmHall,
    time:  time,
    seat: seat
  };



  $.ajax({
    url:'http://localhost:8080/api/v1/booking/save',
    type:"POST",
    data:JSON.stringify(
      customerData
    ),
    contentType:"application/json",
    success:(res) =>{
      id++;
      console.log(res)
    },
    errors:(err) =>{
      console.log(err)
    }

  })



}


function colouringSeats() {
  $.ajax({
    url: 'http://localhost:8080/api/v1/booking/getAll',
    type: "GET",
    success: (res) => {
      console.log(res);

      res.data.forEach(customer => {
        const Id = customer.id;
        const bookingDate = customer.bookingDate;
        const films = customer.film;
        const filmHalls = customer.filmHall;
        const times = customer.time;
        const seats = customer.seat;

        console.log("Customer Seats: " + seats);
        console.log("Customer Time: " + times);
        console.log("Customer Booking Date: " + bookingDate);

        const film = bookingValues[0].textValue.substring(14);
        const filmHall = bookingValues[1].textValue.substring(15);
        const date = bookingValues[2].textValue.substring(14);
        const time = bookingValues[3].textValue.substring(13);

        console.log("Film: " + film);
        console.log("Film Hall: " + filmHall);
        console.log("Date: " + date);
        console.log("Time: " + time);

        if ((film === films) &&
          (filmHall === filmHalls) &&
          (time.trim() === times.trim()) &&
          (date.trim() === bookingDate.trim())) {
          console.log("Match found! Adding seats: " + seats);
          reservedSeats.push(seats);

        }
      });
      createSeatMap()


    }
  });
}
