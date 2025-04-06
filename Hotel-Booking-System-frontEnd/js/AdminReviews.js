const tableBody = document.querySelector('.review-table tbody');

const fetchReviews = () => {
  $.ajax({
    url: "http://localhost:8080/api/v1/review/getAll",
    type: "GET",
    success: function (res) {
      console.log("Response from Backend:", res);
      const review = res.data || [];
      tableBody.innerHTML = "";
      review.forEach(addReviewToTable);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching reviews:", error);
      alert("An error occurred while fetching reviews.");
    }
  });

  // Function to dynamically add a room to the table
  const addReviewToTable = (review) => {
    console.log("Review Data:", review);

    const row = document.createElement("tr");
    row.id = `room-${review.reviewId}`; //  Add ID to the row for easy deletion

    row.innerHTML = `
        <td>${review.reviewId || "N/A"}</td>
        <td>${review.rating || "N/A"}</td>
        <td>${review.comment || "N/A"}</td>
        <td>${review.userId || "N/A"}</td>
        <td>${review.userName || "N/A"}</td>
        <td>${review.hotelId || "N/A"}</td>
        <td>${review.location || "N/A"}</td>
        <td>${review.reviewDate || "N/A"}</td>



    `;

    tableBody.appendChild(row);
  };
};
fetchReviews()
