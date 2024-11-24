// app-status.js
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

// Appwrite SDK initialization
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

// Constants for database and collection IDs
const DATABASE_ID = "66e4b088002534a2ffe1";
const COLLECTION_ID = "66e4b098001d3dd600f9";

// Get user ID from local storage
const userId = localStorage.getItem("userID");

if (!userId) {
  // If no userID is found, redirect to the login page
  window.location.href = "student.html";
} else {
  // Fetch the account details of the logged-in user
  account
    .get()
    .then((response) => {
      // Display the user's name on the dashboard
      document.getElementById("name").textContent = response.name;

      // Fetch additional student profile data from the Appwrite database
      databases
        .getDocument(DATABASE_ID, COLLECTION_ID, userId)
        .then((doc) => {
          // Update the fields with student data
          document.getElementById("regn-no").textContent =
            doc.RegistrationNumber || "N/A";
          document.getElementById("father-name").textContent =
            doc.FatherName || "N/A";
          document.getElementById("degree").textContent = doc.Degree || "N/A";
          document.getElementById("stream").textContent = doc.Stream || "N/A";
          document.getElementById("semester").textContent =
            doc.Semester || "N/A";
          document.getElementById("roll").textContent = doc.RollNo || "N/A";
          document.getElementById("dob").textContent = doc.DOB || "N/A";

          // Fetch application status
          databases
            .getDocument(DATABASE_ID, "670257ac0031bc7067ce", userId)
            .then((appDoc) => {
              document.getElementById("status").textContent =
                appDoc.Status || "-";
              document.getElementById("remarks").textContent =
                appDoc.Remarks || "-";

              // Disable New Application button if status is pending or accepted
              const newAppButton = document.getElementById("submit_button");
              if (appDoc.Status === "Pending") {
                newAppButton.disabled = true;
                newAppButton.textContent = "Application Pending";
              } else if (appDoc.Status === "Accepted") {
                newAppButton.disabled = true;
                newAppButton.textContent = "Application Accepted";
              } else {
                newAppButton.addEventListener("click", function () {
                  window.location.href = "app-form.html"; // Redirect to application form
                });
              }
            })
            .catch((error) => {
              console.error("Failed to fetch application data:", error);
              // Enable the New Application button if the appDoc doesn't exist
              const newAppButton = document.getElementById("submit_button");
              newAppButton.addEventListener("click", function () {
                window.location.href = "app-form.html"; // Redirect to application form
              });
            });
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

function updateDateTime() {
  const datetimeDisplay = document.getElementById("datetime-display");
  const now = new Date();

  const day = now.toLocaleString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const time = now.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  datetimeDisplay.innerHTML = `${day}<br>${date}<br>${time}`;
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();
