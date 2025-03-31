$(document).ready(function () {
  $("#signUpBtn").click(function (event) {
    event.preventDefault(); // Prevent the default form submission

    let username = $("#nameSignUp").val().trim();
    let email = $("#emailSignUp").val().trim();
    let contact = $("#contactSignUp").val().trim();
    let password = $("#passwordSignUp").val().trim();
    let confirmPassword = $("#confPasswordSignUp").val().trim();

    if (!username || !email || !contact || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    let userData = {
      name: username, // Ensure the field name matches the expected backend field
      email: email,
      contact: contact,
      password: password,
      role: "ADMIN"
    };

    console.log("Sending Data: ", userData);

    $.ajax({
      url: "http://localhost:8080/api/v1/user/register",
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(userData),
      success: function (res) {
        console.log("Success Response: ", res);
        alert("Registration successful");
      },
      error: function (xhr, status, error) {
        console.error("Full Error: ", xhr);
        console.error("Status: ", status);
        console.error("Error: ", error);
        console.error("Response Text: ", xhr.responseText);

        try {
          let errorResponse = JSON.parse(xhr.responseText);
          alert("Registration failed: " + (errorResponse.message || error));
        } catch (e) {
          alert("Registration failed: " + xhr.responseText);
        }
      }
    });
  });
});
