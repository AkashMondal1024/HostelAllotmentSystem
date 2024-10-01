document.addEventListener("DOMContentLoaded",function(){
  var btn=document.getElementsByClassName("buttons");
  btn[0].addEventListener("click",function(){
    account
    .deleteSession("current")
    .then(() => {
      // Clear local storage (if needed)
      localStorage.removeItem("userID");
      
      // Redirect to the login page
      window.location.href = "../student.html";
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
  });
  btn[1].addEventListener("click",function(){
      window.location.href="../studentHome.html";
  });
  btn[2].addEventListener("click",function(){
      window.location.href="student-profile.html";
  });
  btn[3].addEventListener("click",function(){
      window.location.href="app-status.html";
  });
  btn[4].addEventListener("click",function(){
      window.location.href="room-details.html";
  });
  btn[5].addEventListener("click",function(){
      window.location.href="canteen.html";
  });
  // btn[6].addEventListener("click",function(){
  //     window.location.href="student.html";
  // });
  // btn[7].addEventListener("click",function(){
  //     window.location.href="student.html";
  // });
});

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
    databases.getDocument(DATABASE_ID, COLLECTION_ID, userId)
      .then((doc) => {
        // Update the fields with student data
        document.getElementById("regn-no").textContent = doc.RegistrationNumber || "N/A";
        document.getElementById("father-name").textContent = doc.FatherName || "N/A";
        document.getElementById("degree").textContent = doc.Degree || "N/A";
        document.getElementById("stream").textContent = doc.Stream || "N/A";
        document.getElementById("semester").textContent = doc.Semester || "N/A";
        document.getElementById("roll").textContent = doc.RollNo || "N/A";
        // document.getElementById("ack-no").textContent = doc. || "N/A";
        // document.getElementById("status").textContent = doc. || "N/A";
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