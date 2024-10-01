document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementsByClassName("buttons");

  // Logout button logic
  btn[0].addEventListener("click", function () {
    account
      .deleteSession("current")
      .then(() => {
        // Clear local storage (if needed)
        localStorage.removeItem("userID");
        
        // Redirect to the login page
        window.location.href = "student.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  });

  // Other navigation buttons
  btn[1].addEventListener("click", function () {
    window.location.href = "studentHomePage.html";
  });
  btn[2].addEventListener("click", function () {
    window.location.href = "Student/student-profile.html";
  });
  btn[3].addEventListener("click", function () {
    window.location.href = "Student/app-status.html";
  });
  btn[4].addEventListener("click", function () {
    window.location.href = "Student/room-details.html";
  });
  btn[5].addEventListener("click", function () {
    window.location.href = "Student/canteen.html";
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
