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
  document.getElementById("complaints").addEventListener("click", function () {
    window.location.href = "Admin/complaints.html";
  });

  const client = new Appwrite.Client();
  client
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject("66cfe746002e495cbc84");

  const account = new Appwrite.Account(client);

  document.getElementById("logout").addEventListener("click", function () {
    account
      .deleteSession("current")
      .then(() => {
        localStorage.removeItem("userID");
        window.location.href = "admin.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  });

  const databases = new Appwrite.Databases(client);
  const DATABASE_ID = "66e4b088002534a2ffe1";
  const NOTICE_COLLECTION_ID = "6713e5b4003851327d19";
  const ADMIN_INFO = "66edb843001cb200659b";
  const userId = localStorage.getItem("userID");
  const STUDENT_ROOM_INFO = "6702579e0022444bdf9d";
  const APPLICATIONS = "670257ac0031bc7067ce";

  let activeStudents = 0;

  databases
    .listDocuments(DATABASE_ID, STUDENT_ROOM_INFO)
    .then((response) => {
      activeStudents = response.total;
      document.getElementById("active-residents").textContent = activeStudents;
      document.getElementById("available-accomodations").textContent = 400-activeStudents;
    })
    .catch((error) => {
      console.error("Error counting documents:", error);
    });

    databases
    .listDocuments(DATABASE_ID, APPLICATIONS, [Appwrite.Query.equal("Status", "Pending")])
    .then((response) => {
      document.getElementById("pending-applications").textContent = response.total;
    })
    .catch((error) => {
      console.error("Error counting documents:", error);
    });

  if (!userId) {
    window.location.href = "admin.html";
  } else {
    account
      .get()
      .then((response) => {
        document.getElementById("name").textContent = response.name;
        databases
          .getDocument(DATABASE_ID, ADMIN_INFO, userId)
          .then((doc) => {
            document.getElementById("eid").textContent =
              doc.EmployeeID || "N/A";
            document.getElementById("role").textContent =
              doc.AdminRole || "N/A";
            document.getElementById("dept").textContent =
              doc.Department || "N/A";
            document.getElementById("location").textContent =
              doc.OfficeLocation || "N/A";
          })
          .catch((error) => {
            console.error("Failed to fetch student data:", error);
          });
      })
      .catch((error) => {
        console.error("Failed to fetch user details:", error);
        document.getElementById("name").textContent = "Failed to load name.";
      });
  }

  databases
    .listDocuments(DATABASE_ID, NOTICE_COLLECTION_ID)
    .then(function (response) {
      const notices = response.documents;
      notices.reverse();
      const noticeArea = document.getElementById("notice-area");
      noticeArea.innerHTML = "";

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
