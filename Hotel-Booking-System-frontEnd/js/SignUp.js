$(document).ready(function () {
  $("#signUpBtn").click(function (event) {
    event.preventDefault();

    let username = $("#nameSignUp").val().trim();
    let email = $("#emailSignUp").val().trim();
    let contact = $("#contactSignUp").val().trim();
    let password = $("#passwordSignUp").val().trim();
    let confirmPassword = $("#confPasswordSignUp").val().trim();

    if (!username || !email || !contact || !password || !confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'All fields are required!',
        customClass: { popup: 'custom-swal' }
      });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match!',
        customClass: { popup: 'custom-swal' }
      });
      return;
    }

    let userData = {
      name: username,
      email: email,
      contact: contact,
      password: password,
      role: "USER"
    };

    $.ajax({
      url: "http://localhost:8080/api/v1/user/register",
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(userData),
      success: function (res) {
        if (res.code === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Registered successfully!',
            text: 'Redirecting to login...',
            customClass: { popup: 'custom-swal' },
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            window.location.href = "login.html";
          });
        } else if (res.code === 406) {
          Swal.fire({
            icon: 'info',
            title: 'Email already used!',
            customClass: { popup: 'custom-swal' }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Something went wrong.',
            text: 'Please try again.',
            customClass: { popup: 'custom-swal' }
          });
        }
      },
      error: function (xhr, status, error) {
        try {
          let errorResponse = JSON.parse(xhr.responseText);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: errorResponse.message || error,
            customClass: { popup: 'custom-swal' }
          });
        } catch (e) {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: xhr.responseText,
            customClass: { popup: 'custom-swal' }
          });
        }
      }
    });
  });
});
