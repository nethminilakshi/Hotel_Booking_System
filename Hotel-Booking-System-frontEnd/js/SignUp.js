$(document).ready(function () {
  $("#signUpBtn").click(function () {

    let username = $("#nameSignUp").val().trim();
    let email = $("#emailSignUp").val().trim();
    let contact = $("#contactSignUp").val().trim();
    let password = $("#passwordSignUp").val().trim();
    let confirmPassword = $("#confPasswordSignUp").val().trim();

    if (!username || !email || !contact || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }

    let userData = {
      username: username,
      email: email,
      contact: contact,
      password: password,
      role: "USER"
    };

    console.log(" Sending Data: ", userData); // Debugging

    $.ajax({
      url: "http://localhost:8080/api/v1/user/register",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(userData),
      success: function (res) {
        console.log(" Success Response: ", res);
        alert("Registration successful");
      },
      error: function (xhr) {
        console.error(" Error Response: ", xhr.responseText);
        alert("Failed: " + xhr.responseText);
      }
    });
  });
});
