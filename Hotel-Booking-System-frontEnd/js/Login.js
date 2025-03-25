("#login-btn").click(function () {
  $.ajax({
    url: "http://localhost:8080/api/v1/auth/authenticate",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "email": $("#emailSignIn").val(),
      "password": $("#passwordSignIn").val()
    }),
    success: (res) => {
      console.log(res);
      if (res.message === "Success") {
        console.log("Login successful");
        alert("Login successful");
      } else {
        alert("Failed: " + (res.message || "Unknown error"));
      }
    },
    error: (error) => {
      console.error(error);
      alert("Something went wrong");
    }
  });
})
