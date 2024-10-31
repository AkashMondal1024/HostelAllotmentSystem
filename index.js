document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".student-login")
    .addEventListener("click", function () {
      window.location.href = "student.html";
    });

  document.querySelector(".admin-login").addEventListener("click", function () {
    window.location.href = "admin.html";
  });
});
