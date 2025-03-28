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


//
// async function login() {
//   try {
//     const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         email: 'user@example.com',
//         password: 'password123'
//       })
//     });
//
//     const data = await response.json();
//
//     if (response.status === 201) {
//       // Successful login
//       localStorage.setItem('authToken', data.data.token);
//       localStorage.setItem('userEmail', data.data.email);
//
//       // Redirect or perform next action
//       window.location.href = '/dashboard';
//     } else {
//       // Login failed
//       alert(data.message || 'Login failed');
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//   }
// }
