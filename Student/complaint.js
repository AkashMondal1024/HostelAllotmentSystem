document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementsByClassName("buttons");
  btn[0].addEventListener("click", function () {
    window.location.href = "../studentHome.html";
  });
  btn[1].addEventListener("click", function () {
    window.location.href = "student-profile.html";
  });
  btn[2].addEventListener("click", function () {
    window.location.href = "app-status.html";
  });
  btn[3].addEventListener("click", function () {
    window.location.href = "room-details.html";
  });
  btn[4].addEventListener("click", function () {
    window.location.href = "canteen.html";
  });
});

const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66cfe746002e495cbc84");

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

const DATABASE_ID = "66e4b088002534a2ffe1";
const STUDENT_ROOM_INFO = "6702579e0022444bdf9d";
const COMPLAINTS = "671aaa100038eaca599e";
const userId = localStorage.getItem("userID");

const today = new Date();
const dateString = `${today.getDate().toString().padStart(2, "0")}-${(
  today.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}-${today.getFullYear()}`;
document.getElementById("date").value = dateString;

if (!userId) {
  window.location.href = "student.html";
} else {
  account
    .get()
    .then((response) => {
      databases
        .getDocument(DATABASE_ID, STUDENT_ROOM_INFO, userId)
        .then((doc) => {
          document.getElementById("roomNumber").value = doc.RoomNumber || "N/A";
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

document
  .getElementById("complaintForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const complaintType = document.getElementById("complaintType").value;
    const description = document.getElementById("description").value;
    const roomNo = parseInt(document.getElementById("roomNumber").value, 10);
    const date = document.getElementById("date").value;

    const Complaint = {
      ComplaintType: complaintType,
      Description: description,
      RoomNumber: roomNo,
      Date: date,
      StudentID: userId,
    };

    databases
      .createDocument(DATABASE_ID, COMPLAINTS, Appwrite.ID.unique(), Complaint)
      .then((response) => {
        alert("Complaint lodged successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.log("Complaint Upload Failed", error);
      });
  });
