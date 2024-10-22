const client = new Appwrite.Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

// Database constants
const DATABASE_ID = "66e4b088002534a2ffe1"; // Your database ID
const PROFILE_COLLECTION = "66edb843001cb200659b"; // Your collection ID

// Check for active session when the page loads
document.addEventListener("DOMContentLoaded", () => {
  account
    .get() // Get the current session
    .then((response) => {
      console.log("Session active. Checking for admin role.");
      fetchUserProfile(response.$id);
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
      localStorage.setItem("userID", response.userId);
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

// Function to fetch user profile from the database and check the label
// Function to check if the user has the "admin" label in Auth
function fetchUserProfile(userId) {
  account
    .get() // Get the session to check user label
    .then((session) => {
      console.log("Session Data: ", session);

      // Assuming the session data contains roles or labels for the user
      // Check if the user's label is "admin"
      if (session.labels && session.labels.includes("admin")) {
        console.log("User is an admin. Redirecting to adminHome.");
        document.getElementById("message").textContent = "Login Successful";
        localStorage.setItem("userID", userId);
        window.location.href = "adminHome.html";
      } else {
        console.log("User is not an admin.");
        document.getElementById("message").textContent =
          "Access Denied. Only admins can log in.";
        account.deleteSession("current"); // Log out the user if they are not an admin
      }
    })
    .catch((error) => {
      console.error("Failed to verify label from session data:", error);
      document.getElementById("message").textContent =
        "Error: Unable to verify label.";
      account.deleteSession("current"); // Log out the user if the profile check fails
    });
}
