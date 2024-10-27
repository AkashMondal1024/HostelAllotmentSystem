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
  document.getElementById("complaints").addEventListener("click", function () {
    window.location.href = "complaints.html";
  });

  // Appwrite setup
  const client = new Appwrite.Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66cfe746002e495cbc84");

  const databases = new Appwrite.Databases(client);

  const DATABASE_ID = "66e4b088002534a2ffe1";
  const NOTICE_COLLECTION_ID = "6713e5b4003851327d19";

  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Form submission handler
  document
    .getElementById("noticeForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const date = getCurrentDate();

      // Create a new notice in the Appwrite database
      databases
        .createDocument(DATABASE_ID, NOTICE_COLLECTION_ID, "unique()", {
          Title: title,
          Content: content,
          Date: date,
        })
        .then(function (response) {
          alert("Notice created successfully!");
          // Optionally clear the form after submission
          document.getElementById("noticeForm").reset();
        })
        .catch(function (error) {
          console.error(error);
          alert("Error creating notice. Please try again.");
        });
    });
});
