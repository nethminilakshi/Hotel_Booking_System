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

    $.ajax({
      url: "http://localhost:8080/api/v1/user/register",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        "username": username,
        "email": email,
        "contact": contact,
        "password": password,
        "confirmPassword": confirmPassword,
        "role": "USER"
      }),
      success: (res) => {
        localStorage.setItem("email", email);
        console.log(res);
        if (res.message === "Success") {
          console.log("Registration successful");
          alert("Registration successful");
        } else {
          alert("Failed: " + (res.message || "Unknown error"));
        }
      },
      error: (error) => {
        console.error(error);
        alert("Something went wrong");
      }
    });
  });
});
