$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault(); 

    let username = $("#username").val();
    let password = $("#password").val();

    console.log(username, password);

    let data = {
      email: username,
      password: password,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:8080/api/login",
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (response) {
        console.log("Login successful");
        console.log("JWT Token:", response.jwt);
        localStorage.setItem('token', response.jwt);
        window.location.href = "home.html";
      },
      error: function (errorThrown) {
        console.error("Login failed");
        console.error("Error:", errorThrown);
        $("#errorMessage").text("Incorrect username or password").show();
      },
    });
  });
});
