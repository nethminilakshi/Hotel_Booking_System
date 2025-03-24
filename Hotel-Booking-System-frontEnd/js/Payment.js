const tableBody = document.querySelector('.payment-table tbody');


// Fetch and display room data
const fetchPayments = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/v1/payment/getAll");
    if (!response.ok) throw new Error("Failed to fetch payment");

    const rawText = await response.text();
    console.log("Raw Response from Backend:", rawText);
    const result = JSON.parse(rawText);
    console.log("Parsed JSON:", result);

    const rooms = result.data || [];
    tableBody.innerHTML = "";
    rooms.forEach(addPaymentToTable);
  } catch (error) {
    console.error("Error fetching payments:", error);
    alert("An error occurred while fetching payments.");
  }
};


// Function to dynamically add a payment to the table
const addPaymentToTable = (payment) => {
  console.log("Payment Data:", payment);

  const row = document.createElement("tr");
  row.id = `payement-${payment.paymentId}`; //  Add ID to the row for easy deletion

  row.innerHTML = `
        <td>${payment.paymentId || "N/A"}</td>
        <td>${payment.amount || "N/A"}</td>
        <td>${payment.paymentDate || "N/A"}</td>
        <td>${payment.paymentMethod || "N/A"}</td>
        <td>${payment.status || "N/A"}</td>
        <td>${payment.bookingId || "N/A"}</td>

    `;

  tableBody.appendChild(row);
};

// Initial Fetch
fetchPayments();
