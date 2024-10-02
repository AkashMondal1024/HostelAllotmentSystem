// Initialize Appwrite SDK
const client = new Appwrite.Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

// Database constants
const DATABASE_ID = "66e4b088002534a2ffe1"; // Your database ID
const PROFILE_COLLECTION = "66e4b098001d3dd600f9"; // Your collection ID

// Check for active session when the page loads
document.addEventListener("DOMContentLoaded", () => {
  account
    .get() // Get the current session
    .then((response) => {
      // Check if the user is an admin or student
      if (response.labels && response.labels.includes("admin")) {
        console.log("Admin detected. Access denied for students.");
        document.getElementById("message").textContent =
          "Admins cannot log in here.";
        account.deleteSession("current"); // Log out the user if they are an admin
      } else {
        console.log("Student session active. Redirecting to StudentHome.");
        window.location.href = "studentHome.html"; // Redirect to student home if the user is a student
      }
    })
    .catch((error) => {
      // No active session found, continue with the login page
      console.clear();
      console.log("No active session. Proceeding with login.");
    });
});

// Login functionality
const loginButton = document.getElementById("login_button");

loginButton.addEventListener("click", login);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  account
    .createEmailPasswordSession(email, password)
    .then((response) => {
      fetchUserProfile(response.userId);
    })
    .catch((error) => {
      console.error("Login Failed", error);

      if (error.code === 401) {
        document.getElementById("message").textContent = "Invalid Credentials";
      } else {
        document.getElementById("message").textContent =
          "Login Failed: " + error.message;
      }
    });
}

// Function to fetch user profile from the database
function fetchUserProfile(userId) {
  account
    .get() // Get the session to check user label
    .then((session) => {
      console.log("Session Data: ", session);

      // Assuming the session data contains roles or labels for the user
      // Check if the user's label is "admin"
      if (session.labels && session.labels.includes("admin")) {
        document.getElementById("message").textContent = "Invalid Credentials";
        account.deleteSession("current");
        console.log("Invalid Credentials");
      } else {
        localStorage.setItem("userID", userId);
        window.location.href = "StudentHome.html";
      }
    })
    .catch((error) => {
      console.error("Failed to verify label from session data:", error);
      document.getElementById("message").textContent =
        "Error: Unable to verify label.";
      account.deleteSession("current"); // Log out the user if the profile check fails
    });
}
