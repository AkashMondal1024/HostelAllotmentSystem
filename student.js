const client = new Appwrite.Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66cfe746002e495cbc84");

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);

const DATABASE_ID = "66e4b088002534a2ffe1";
const PROFILE_COLLECTION = "66e4b098001d3dd600f9";

document.addEventListener("DOMContentLoaded", () => {
  account
    .get()
    .then((response) => {
      if (response.labels && response.labels.includes("admin")) {
        console.log("Admin detected. Access denied for students.");
        document.getElementById("message").textContent =
          "Admins cannot log in here.";
        account.deleteSession("current");
      } else {
        console.log("Student session active. Redirecting to StudentHome.");
        window.location.href = "studentHome.html";
      }
    })
    .catch((error) => {
      console.clear();
      console.log("No active session. Proceeding with login.");
    });

  const loginButton = document.getElementById("login_button");

  loginButton.addEventListener("click", login);

  function login(event) {
    event.preventDefault();
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
          document.getElementById("message").textContent =
            "Invalid Credentials";
        } else {
          document.getElementById("message").textContent =
            "Login Failed: " + error.message;
        }
      });
  }

  function fetchUserProfile(userId) {
    account
      .get()
      .then((session) => {
        console.log("Session Data: ", session);
        if (session.labels && session.labels.includes("admin")) {
          document.getElementById("message").textContent =
            "Invalid Credentials";
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
        account.deleteSession("current");
      });
  }
});
