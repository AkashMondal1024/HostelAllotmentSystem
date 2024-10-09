// accepted.js
// Initialize Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const databases = new Appwrite.Databases(client);

// Constants for database and collection IDs
const DATABASE_ID = "66e4b088002534a2ffe1";
const COLLECTION_ID = "670257ac0031bc7067ce";

// Function to fetch and display accepted applications
function displayAcceptedApplications() {
  const applicationsTableBody = document.getElementById("applications-table-body");
  const messageElement = document.getElementById("message");

  // Clear the table body before adding new rows
  applicationsTableBody.innerHTML = "";

  if (!applicationsTableBody) {
    console.error("Table body not found");
    if (messageElement) {
      messageElement.textContent = "Application table not found.";
    }
    return;
  }

  // Only fetch applications where Status is 'Accepted'
  databases
    .listDocuments(DATABASE_ID, COLLECTION_ID, [
      Appwrite.Query.equal("Status", "Accepted"),
    ])
    .then((response) => {
      console.log(response.documents); // Log the fetched documents

      const applications = response.documents;

      if (applications.length === 0) {
        messageElement.textContent = "No accepted applications found.";
        return;
      }

      applications.forEach((app) => {
        const row = document.createElement("tr");

        // Create cells for each application field
        row.innerHTML = `
              <td>${app.Name || "N/A"}</td>
              <td>${app.RegistrationNumber || "N/A"}</td>
              <td>${app.RollNo || "N/A"}</td>
              <td>${app.Degree || "N/A"}</td>
              <td>${app.Stream || "N/A"}</td>
              <td>${app.Semester || "N/A"}</td>
            `;

        // Append the row to the table body
        applicationsTableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Failed to fetch accepted applications:", error);
      if (messageElement) {
        messageElement.textContent = "Failed to fetch applications. Please try again.";
      }
    });
}

// Ensure the DOM is fully loaded before running the display function
document.addEventListener("DOMContentLoaded", function () {
  if (typeof displayAcceptedApplications === "function") {
    displayAcceptedApplications();
  }
});
