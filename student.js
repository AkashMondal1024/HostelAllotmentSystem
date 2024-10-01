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
      // If a session exists, redirect to studentHome.html
      console.log("Session active. Redirecting to StudentHome.");
      window.location.href = "studentHome.html";
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
      console.log("Login Successful: ", response);
      document.getElementById("message").textContent = "Login Successful";
      localStorage.setItem("userID", response.userId);

      // Fetch user profile from the database after successful login
      fetchUserProfile(response.userId);

      setTimeout(() => {
        window.location.href = "studentHome.html";
      }, 1000);
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
  databases
    .getDocument(DATABASE_ID, PROFILE_COLLECTION, userId)
    .then((profile) => {
      console.log("User Profile Data: ", profile);
      // You can store this data in localStorage or use it as needed
    })
    .catch((error) => {
      console.error("Failed to fetch user profile data:", error);
    });
}
