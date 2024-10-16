document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementsByClassName("buttons");
  btn[0].addEventListener("click", function () {
    account
      .deleteSession("current")
      .then(() => {
        localStorage.removeItem("userID");
        window.location.href = "../student.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  });
  btn[1].addEventListener("click", function () {
    window.location.href = "../studentHome.html";
  });
  btn[2].addEventListener("click", function () {
    window.location.href = "student-profile.html";
  });
  btn[3].addEventListener("click", function () {
    window.location.href = "app-status.html";
  });
  btn[4].addEventListener("click", function () {
    window.location.href = "room-details.html";
  });
  btn[5].addEventListener("click", function () {
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
const STUDENT_INFO = "66e4b098001d3dd600f9";
const STUDENT_ROOM_INFO = "6702579e0022444bdf9d";

const userId = localStorage.getItem("userID");

if (!userId) {
  window.location.href = "student.html";
} else {
  account
    .get()
    .then((response) => {
      document.getElementById("name").textContent = response.name;
      databases
        .getDocument(DATABASE_ID, STUDENT_INFO, userId)
        .then((doc) => {
          document.getElementById("regn-no").textContent =
            doc.RegistrationNumber || "N/A";
          document.getElementById("roll").textContent = doc.RollNo || "N/A";
          document.getElementById("degree").textContent = doc.Degree || "N/A";
          document.getElementById("stream").textContent = doc.Stream || "N/A";
          document.getElementById("semester").textContent =
            doc.Semester || "N/A";
        })
        .catch((error) => {
          console.error("Failed to fetch student data:", error);
        });
    })
    .catch((error) => {
      console.error("Failed to fetch user details:", error);
      document.getElementById("name").textContent = "Failed to load name.";
    });

  account
    .get()
    .then((response) => {
      databases
        .getDocument(DATABASE_ID, STUDENT_ROOM_INFO, userId)
        .then((doc) => {
          document.getElementById("room-no").textContent =
            doc.RoomNumber || "N/A";
          document.getElementById("fan").textContent = doc.Fan || "0";
          document.getElementById("cupboard").textContent = doc.Cupboard || "0";
          document.getElementById("bed").textContent = doc.Bed || "0";
          document.getElementById("mattress").textContent = doc.Mattress || "0";
          document.getElementById("chair").textContent = doc.Chair || "0";
          document.getElementById("table").textContent = doc.Table || "0";
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
