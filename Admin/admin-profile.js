document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dashboard").addEventListener("click", function () {
    window.location.href = "../adminHome.html";
  });
  document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "admin-profile.html";
  });
  document
    .getElementById("applications")
    .addEventListener("click", function () {
      window.location.href = "applications.html";
    });
  document.getElementById("accepted").addEventListener("click", function () {
    window.location.href = "accepted.html";
  });
  document.getElementById("database").addEventListener("click", function () {
    window.location.href = "hostel-database.html";
  });
  document
    .getElementById("student-info")
    .addEventListener("click", function () {
      window.location.href = "student-info.html";
    });
  document.getElementById("gen-notice").addEventListener("click", function () {
    window.location.href = "notice.html";
  });
});
