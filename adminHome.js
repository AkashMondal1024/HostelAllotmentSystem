document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dashboard").addEventListener("click", function () {
    window.location.href = "adminHome.html";
  });
  document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "Admin/admin-profile.html";
  });
  document.getElementById("applications").addEventListener("click", function () {
    window.location.href = "Admin/applications.html";
  });
  document.getElementById("accepted").addEventListener("click", function () {
    window.location.href = "Admin/accepted.html";
  });
  document.getElementById("database").addEventListener("click", function () {
    window.location.href = "Admin/hostel-database.html";
  });
  document.getElementById("student-info").addEventListener("click", function () {
    window.location.href = "Admin/student-info.html";
  });
  document.getElementById("gen-notice").addEventListener("click", function () {
    window.location.href = "Admin/notice.html";
  });

  // Appwrite setup
  const client = new Appwrite.Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66cfe746002e495cbc84");

  const databases = new Appwrite.Databases(client);

  const DATABASE_ID = "66e4b088002534a2ffe1";
  const NOTICE_COLLECTION_ID = "6713e5b4003851327d19";

  databases.listDocuments(DATABASE_ID, NOTICE_COLLECTION_ID)
    .then(function (response) {
      const notices = response.documents;
      const noticeArea = document.getElementById("notice-area");
      noticeArea.innerHTML = '';

      notices.forEach(function (notice) {

        const noticeDiv = document.createElement("div");
        noticeDiv.className = "notice";

        const noticeTitle = document.createElement("h4");
        noticeTitle.textContent = notice.Title;
        noticeTitle.style.textAlign = "center";

        const noticeDate = document.createElement("small");
        noticeDate.style.fontSize = "0.86em";
        noticeDate.style.display = "block";
        noticeDate.textContent = notice.Date; 
        noticeDate.style.fontWeight = "bold";

        const noticeContent = document.createElement("p");
        noticeContent.textContent = notice.Content;
        noticeContent.style.fontSize = "1.05em";
        noticeContent.style.textAlign = "justify";

        noticeDiv.appendChild(noticeTitle);
        noticeDiv.appendChild(noticeDate);
        noticeDiv.appendChild(noticeContent);

        noticeArea.appendChild(noticeDiv);
        const hr = document.createElement("hr");
        noticeArea.appendChild(hr);
      });
    })
    .catch(function (error) {
      console.error("Error fetching notices:", error);
    });
});
