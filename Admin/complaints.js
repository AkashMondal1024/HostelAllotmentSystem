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
  document.getElementById("logout").addEventListener("click", function () {
    account
      .deleteSession("current")
      .then(() => {
        localStorage.removeItem("userId");
        window.location.href = "../admin.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  });

  fetchComplaints();
});

const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66cfe746002e495cbc84");

const databases = new Appwrite.Databases(client);
const account = new Appwrite.Account(client);

const DATABASE_ID = "66e4b088002534a2ffe1";
const COMPLAINTS_COLLECTION = "671aaa100038eaca599e";
const STUDENT_ROOM_INFO_COLLECTION = "6702579e0022444bdf9d";
const userId = localStorage.getItem("userID");

async function fetchComplaints() {
  try {
    const complaints = await databases.listDocuments(
      DATABASE_ID,
      COMPLAINTS_COLLECTION
    );
    const tbody = document.getElementById("applications-table-body");
    tbody.innerHTML = "";

    for (const complaint of complaints.documents) {
      const studentID = complaint.StudentID;
      const studentInfo = await databases.getDocument(
        DATABASE_ID,
        STUDENT_ROOM_INFO_COLLECTION,
        studentID
      );

      const row = document.createElement("tr");

      // Name
      const nameCell = document.createElement("td");
      nameCell.textContent = studentInfo.Name;
      row.appendChild(nameCell);

      // Room number
      const roomCell = document.createElement("td");
      roomCell.textContent = studentInfo.RoomNumber;
      row.appendChild(roomCell);

      // Date
      const dateCell = document.createElement("td");
      dateCell.textContent = complaint.Date;
      row.appendChild(dateCell);

      // Complaint
      const complaintCell = document.createElement("td");
      complaintCell.innerHTML = `<div style="font-size: larger;">${complaint.ComplaintType}</div><div>${complaint.Description}</div>`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.marginLeft = "10px";
      deleteButton.classList.add("delete-btn");

      // Event listener to delete complaint document
      deleteButton.addEventListener("click", async () => {
        try {
          await databases.deleteDocument(
            DATABASE_ID,
            COMPLAINTS_COLLECTION,
            complaint.$id
          );
          row.remove(); // Remove the row from the table after deletion
          alert("Complaint deleted successfully.");
        } catch (error) {
          console.error("Error deleting complaint:", error);
          alert("Failed to delete complaint.");
        }
      });

      complaintCell.appendChild(deleteButton);

      row.appendChild(complaintCell);

      tbody.appendChild(row);
    }
  } catch (error) {
    console.error("Error fetching complaints:", error);
    document.getElementById("message").textContent =
      "Error loading complaints.";
  }
}
