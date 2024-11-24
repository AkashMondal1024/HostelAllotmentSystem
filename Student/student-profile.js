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

// Initialize Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client); // Storage client for fetching images

// Constants for database and collection IDs
const DATABASE_ID = "66e4b088002534a2ffe1";
const COLLECTION_ID = "66e4b098001d3dd600f9";
const BUCKET_ID = "66edbc16003335ab378a"; // Your bucket ID for images

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
          document.getElementById("roll").textContent = doc.RollNo || "N/A";
          document.getElementById("degree").textContent = doc.Degree || "N/A";
          document.getElementById("stream").textContent = doc.Stream || "N/A";
          document.getElementById("dob").textContent = doc.DOB || "N/A";
          document.getElementById("father-name").textContent =
            doc.FatherName || "N/A";
          document.getElementById("mother-name").textContent =
            doc.MotherName || "N/A";
          document.getElementById("semester").textContent =
            doc.Semester || "N/A";
          document.getElementById("loc-add").textContent =
            doc.LocalAddress || "N/A";
          document.getElementById("per-add").textContent =
            doc.PermanentAddress || "N/A";
          document.getElementById("email").textContent = doc.Email || "N/A";
          document.getElementById("batch").textContent =
            doc.AdmissionBatch || "N/A";
          document.getElementById("exam").textContent =
            doc.EntranceExam || "N/A";
          document.getElementById("rank").textContent =
            doc.EntranceExamRank || "N/A";
          document.getElementById("aadhar").textContent =
            doc.AadharNumber || "N/A";
          document.getElementById("phone").textContent = doc.Phone || "N/A";
          document.getElementById("guardian-mobile").textContent =
            doc.GuardianMobile || "N/A";
          document.getElementById("income").textContent =
            doc.FamilyAnnualIncome || "N/A";
          document.getElementById("marital-status").textContent =
            doc.MaritalStatus || "N/A";
          document.getElementById("gender").textContent = doc.Gender || "N/A";
          document.getElementById("handicapped").textContent =
            doc.PhysicallyHandicapped || "N/A";
          document.getElementById("category").textContent =
            doc.Category || "N/A";

          // Fetch the student's profile photo from Appwrite Storage
          const photoFileId = doc.PhotoFileId; // Assuming `PhotoFileId` stores the image file ID
          if (photoFileId) {
            const imageElement = document.querySelector(".student-image");

            // Fetch the file URL from Appwrite Storage
            const fileUrl = storage.getFileView(BUCKET_ID, photoFileId); // Use getFileView for image files
            imageElement.src = fileUrl; // Set the image source to the URL
            console.log("Image URL:", fileUrl); // Log the URL to verify
          } else {
            // If no photo ID is available, set a default image
            document.querySelector(".student-image").src = "default.jpg";
          }
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
