document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dashboard").addEventListener("click", function () {
    window.location.href = "adminHome.html";
  });
  document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "Admin/admin-profile.html";
  });
  document
    .getElementById("applications")
    .addEventListener("click", function () {
      window.location.href = "Admin/applications.html";
    });
  document.getElementById("accepted").addEventListener("click", function () {
    window.location.href = "Admin/accepted.html";
  });
  document.getElementById("database").addEventListener("click", function () {
    window.location.href = "Admin/hostel-database.html";
  });
  document
    .getElementById("student-info")
    .addEventListener("click", function () {
      window.location.href = "Admin/student-info.html";
    });
  document.getElementById("gen-notice").addEventListener("click", function () {
    window.location.href = "Admin/notice.html";
  });
});
