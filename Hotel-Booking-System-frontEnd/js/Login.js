// Function to handle successful login
function handleSuccessfulLogin(token, userId, role) {
  localStorage.setItem('authToken', token);
  localStorage.setItem('role', role);

  console.log("Role received:", role);
  console.log("Role type:", typeof role);

  if (role === "ADMIN") {
    window.location.href = "AdminDashboard.html";
  } else if (role === "MANAGER") {
    window.location.href = "ManagerDashboard.html";
  } else {
    if (localStorage.getItem('redirectAfterLogin') === 'booking') {
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = "booking.html";
    } else {
      window.location.href = "index.html";
    }
  }
}

// Document ready function
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.querySelector(".login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("emailSignIn").value;
      const password = document.getElementById("passwordSignIn").value;

      if (!email || !password) {
        Swal.fire({
          icon: 'warning',
          title: 'Missing Fields',
          text: 'Please fill in all fields',
          width: '400px',
          customClass: { popup: 'custom-swal' }
        });
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/v1/auth/authenticate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You are being redirected...',
            timer: 2000,
            showConfirmButton: false,
            width: '400px',
            customClass: { popup: 'custom-swal' }
          });

          setTimeout(() => {
            handleSuccessfulLogin(data.data.token, data.data.userId || null, data.data.role);
          }, 2000);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: data.message || "Invalid email or password!",
            width: '400px',
            customClass: { popup: 'custom-swal' }
          });
        }
      } catch (error) {
        console.log('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Login Error',
          text: error.message || 'Something went wrong!',
          width: '400px',
          customClass: { popup: 'custom-swal' }
        });
      }
    });
  }

  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function (e) {
      e.preventDefault();

      Swal.fire({
        title: 'Enter your email',
        input: 'email',
        inputPlaceholder: 'Enter your email to reset password',
        showCancelButton: true,
        confirmButtonText: 'Send Reset Link',
        width: '400px',
        customClass: { popup: 'custom-swal' }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          Swal.fire({
            icon: 'success',
            title: 'Email Sent!',
            text: 'Reset link sent! Please check your email.',
            width: '400px',
            customClass: { popup: 'custom-swal' }
          });
        }
      });
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get('message');

  if (message === 'logout') {
    Swal.fire({
      icon: 'success',
      title: 'Logout Successful',
      text: 'You have been logged out successfully.',
      width: '400px',
      customClass: { popup: 'custom-swal' }
    });
  } else if (message === 'session_expired') {
    Swal.fire({
      icon: 'info',
      title: 'Session Expired',
      text: 'Your session has expired. Please log in again.',
      width: '400px',
      customClass: { popup: 'custom-swal' }
    });
  }
});

// Function to toggle password visibility
function togglePasswordVisibility() {
  const passwordField = document.getElementById("passwordSignIn");
  const toggleIcon = document.querySelector(".toggle-password i");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    if (toggleIcon) {
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
    }
  } else {
    passwordField.type = "password";
    if (toggleIcon) {
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    }
  }
}

// Initialize password toggle if element exists
document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.querySelector(".toggle-password");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", togglePasswordVisibility);
  }
});
