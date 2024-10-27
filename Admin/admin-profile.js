document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("dashboard").addEventListener("click", function () {
    window.location.href = "../adminHome.html";
  });
  document.getElementById("profile").addEventListener("click", function () {
    window.location.href = "admin-profile.html";
  });
  document
    .getElementById("applications")
    .addEventListener("click", function () {
      window.location.href = "applications.html";
    });
  document.getElementById("accepted").addEventListener("click", function () {
    window.location.href = "accepted.html";
  });
  document.getElementById("database").addEventListener("click", function () {
    window.location.href = "hostel-database.html";
  });
  document
    .getElementById("student-info")
    .addEventListener("click", function () {
      window.location.href = "student-info.html";
    });
  document.getElementById("gen-notice").addEventListener("click", function () {
    window.location.href = "notice.html";
  });
  document.getElementById("complaints").addEventListener("click", function () {
    window.location.href = "complaints.html";
  });
  document.getElementById("logout").addEventListener("click", function () {
    account
      .deleteSession("current")
      .then(() => {
        localStorage.removeItem("userID");
        window.location.href = "../admin.html";
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  });
});

const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66cfe746002e495cbc84");

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
// const storage = new Appwrite.Storage(client);
const DATABASE_ID = "66e4b088002534a2ffe1";
const ADMIN_INFO = "66edb843001cb200659b";
const userId = localStorage.getItem("userID");

if (!userId) {
  window.location.href = "../admin.html";
} else {
  account
    .get()
    .then((response) => {
      document.getElementById("name").textContent = response.name;
      databases
        .getDocument(DATABASE_ID, ADMIN_INFO, userId)
        .then((doc) => {
          document.getElementById("father-name").textContent =
            doc.FatherName || "N/A";
          document.getElementById("mother-name").textContent =
            doc.MotherName || "N/A";
          document.getElementById("eid").textContent = doc.EmployeeID || "N/A";
          document.getElementById("role").textContent = doc.AdminRole || "N/A";
          document.getElementById("dept").textContent = doc.Department || "N/A";
          document.getElementById("phone").textContent = doc.Phone || "N/A";
          document.getElementById("location").textContent =
            doc.OfficeLocation || "N/A";
          document.getElementById("address").textContent = doc.Address || "N/A";
          document.getElementById("email").textContent = doc.Gmail || "N/A";
          document.getElementById("dob").textContent = doc.DOB || "N/A";
          document.getElementById("join-year").textContent =
            doc.JoiningYear || "N/A";
          document.getElementById("retire-year").textContent =
            doc.RetirementYear || "N/A";
          document.getElementById("aadhar").textContent = doc.Aadhar || "N/A";
          document.getElementById("basic-pay").textContent =
            doc.BasicPay || "N/A";
          document.getElementById("level").textContent = doc.Level || "N/A";
          document.getElementById("pf").textContent = doc.PF || "N/A";
          document.getElementById("gender").textContent = doc.Gender || "N/A";
          document.getElementById("handicapped").textContent =
            doc.PhysicallyHandicapped || "N/A";
          document.getElementById("marital-status").textContent =
            doc.MaritalStatus || "N/A";
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
