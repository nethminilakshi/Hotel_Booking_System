$(document).ready(function() {
  const userRegisterForm = $('#user-register-form');
  const addUserButton = $('#add-user');
  const closeButton = $('#user-register-close');
  const userForm = $('#user-form');
  const tableBody = $('.user-table tbody');
  const formTitle = $('.user-register-title');
  let currentUserId = null;
  let currentEmail = null;

// Open and close registration form
  const openForm = function() {
    userRegisterForm.css("display", "flex");
    formTitle.text(currentUserId ? "Update User" : "Register User");
    if (!currentUserId) {
      clearForm();
    }
  };

  const closeForm = function() {
    userRegisterForm.css("display", "none");
    clearForm();
  };
  addUserButton .on("click", openForm);
  closeButton.on("click", closeForm);

  $(window).on('click', function(event) {
    if (event.target === userRegisterForm[0]) closeForm();
  });

  // Function to get the authentication token
  const getAuthToken = function() {
    // Replace with your actual method of retrieving the token
    return localStorage.getItem('authToken');
  };

// Submit form handler
  userForm.on('submit', function(e) {
    e.preventDefault();
    if (currentUserId) {
      updateUsers
    } else {
      saveUsers();
    }
  });

    // Collect user data from form fields
    const userData = {
      name: $("#user-name").val().trim(),
      email: $("#user-email").val().trim(),
      contact: $("#user-contact").val().trim(),
      password: $("#user-password").val(),
      role: "ADMIN"
    };
    console.log("Sending Data: ", userData);

  const saveUsers = function() {
    $.ajax({
      url: "http://localhost:8080/api/v1/admin/register",
      method: "POST",
      contentType: "application/json",
      Accept: "application/json",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      },
      data: JSON.stringify(userData),
      success: function (response) {
        alert("User added successfully!");
        $("#user-form")[0].reset();
        fetchUsers();
      },
      error: function (error) {
        console.error("Error adding user:", error);
        if (error.status === 406) {
          alert("Error 406: Invalid request format. Check your data.");
        } else {
          alert("Failed to add user. Please try again.");
        }
      }
    });
  }



  // Fetch users and populate the table
    const fetchUsers = function() {
      $.ajax({
        url: 'http://localhost:8080/api/v1/user/getAll',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        success: function(result) {
          tableBody.html("");
          if (result && result.data && Array.isArray(result.data)) {
            result.data.forEach(function(user) {
              addUserToTable(user);
            });
          } else {
            console.error("Invalid data format received:", result);
          }
        },
        error: function(error) {
          console.error("Error fetching users:", error);
          alert("An error occurred while fetching users.");
        }
      });
    };

  // Add hotel data to table
  const addUserToTable = function(user) {
    const row = $('<tr></tr>');
    row.html(`
      <td>${user.userId || "N/A"}</td>
      <td>${user.name || "N/A"}</td>
      <td>${user.email || "N/A"}</td>
      <td>${user.contact || "N/A"}</td>
      <td>${user.password || "N/A"}</td>
      <td>${user.role || "N/A"}</td>
      <td><span class="update-button">Update</span></td>
      <td><span class="delete-button">Delete</span></td>

    `);
    row.find('.update-button').on('click', function() {
      openUpdateForm(user);
    });
    row.find('.delete-button').on('click', function() {
      deleteUser(user.email);
    });
    tableBody.append(row);
  };
  // Open update form
  const openUpdateForm = function(user) {
    currentUserId = user.email; // Use email as the unique identifier
    formTitle.text("Update User");
    populateForm(user);
    openForm();
  };

// Update user
  const updateUsers = function() {
    const userData = {
      name: $("#user-name").val().trim(),
      contact: $("#user-contact").val().trim(),
      email: $("#user-email").val().trim(),
      password: $("#user-password").val() // Keeping the password field as is
    };

    $.ajax({
      url: `http://localhost:8080/api/v1/user/update/${currentUserId}`, // Use email in the URL
      method: 'PUT',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      },
      data: JSON.stringify(userData),
      success: function(response) {
        alert('User updated successfully!');
        fetchUsers();
        closeForm();
      },
      error: function(error) {
        console.error("Error updating user:", error);
        alert("An error occurred while updating the user.");
      }
    });
  };

  // Populate form fields with user data
  const populateForm = function(user) {
    $("#user-name").val(user.name);
    $("#user-email").val(user.email);
    $("#user-contact").val(user.contact);
    $("#user-password").val(user.password);
  };


  // Delete user
  const deleteUser = function(email) {
    if (!confirm("Are you sure you want to delete this user?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/user/delete/${email}`,
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${getAuthToken()}`
      },
      success: function(response) {
        alert("User deleted successfully!");
        fetchUsers();
      },
      error: function(error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    });
  };

  const clearForm = function() {
    userForm[0].reset();

  };
  // Load users when the page is ready
  fetchUsers();

});


