// Initialize Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const databases = new Appwrite.Databases(client);

// Constants for database and collection IDs
const DATABASE_ID = "66e4b088002534a2ffe1";
const COLLECTION_ID = "670257ac0031bc7067ce";

// Function to fetch and display applications
function displayApplications() {
  const applicationsTableBody = document.getElementById(
    "applications-table-body"
  );
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

  // Only fetch applications where Processed is false
  databases
    .listDocuments(DATABASE_ID, COLLECTION_ID, [
      Appwrite.Query.equal("Processed", false),
    ])
    .then((response) => {
      console.log(response.documents); // Log the fetched documents

      const applications = response.documents;

      if (applications.length === 0) {
        messageElement.textContent = "No applications found.";
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
              <td>${app.FamilyAnnualIncome || "N/A"}</td>
              <td>${app.Distance || "N/A"}</td>
              <td><a href="#" onclick="viewAadhar('${
                app.AadharFileID || "N/A"
              }')" target="_blank">View Aadhar</a></td>
              <td>
                <select id="status-${app.$id}">
                  <option value="Pending" ${
                    app.Status === "Pending" ? "selected" : ""
                  }>Pending</option>
                  <option value="Accepted" ${
                    app.Status === "Accepted" ? "selected" : ""
                  }>Accepted</option>
                  <option value="Rejected" ${
                    app.Status === "Rejected" ? "selected" : ""
                  }>Rejected</option>
                </select>
              </td>
              <td>
                <input type="text" id="remarks-${app.$id}" value="${
          app.Remarks || ""
        }" placeholder="Add remarks" />
              </td>
              <td>
                <button onclick="submitApplication('${
                  app.$id
                }')">Submit</button>
              </td>
            `;

        // Append the row to the table body
        applicationsTableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Failed to fetch applications:", error);
      if (messageElement) {
        messageElement.textContent =
          "Failed to fetch applications. Please try again.";
      }
    });
}

// Function to submit application status and remarks
function submitApplication(applicationId) {
  const status = document.getElementById(`status-${applicationId}`).value;
  const remarks = document.getElementById(`remarks-${applicationId}`).value;

  databases
    .updateDocument(DATABASE_ID, COLLECTION_ID, applicationId, {
      Status: status,
      Remarks: remarks,
      Processed: true, // Mark the application as processed
    })
    .then(() => {
      alert("Application updated successfully!");

      // Remove the corresponding row from the table
      const row = document
        .querySelector(
          `button[onclick="submitApplication('${applicationId}')"]`
        )
        .closest("tr");
      if (row) {
        row.remove(); // Remove the row from the table
      }
    })
    .catch((error) => {
      console.error("Failed to update application:", error);
      alert("Failed to update application.");
    });
}

// Function to view Aadhar file
function viewAadhar(AadharFileID) {
  if (AadharFileID === "N/A") {
    console.error("No AadharFileID available.");
    alert("Aadhar File ID is not available.");
    return;
  }

  const bucketId = "67043852000455e53296"; // Your bucket ID
  const projectId = "66cfe746002e495cbc84"; // Your project ID
  console.log("Viewing Aadhar file with ID:", AadharFileID); // Debugging line
  const url = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${AadharFileID}/view?project=${projectId}&mode=admin`;

  window.open(url, "_blank"); // Opens the Aadhar file in a new tab
}

// Ensure the DOM is fully loaded before running the display function
document.addEventListener("DOMContentLoaded", function () {
  // Ensure that displayApplications is only called once
  if (typeof displayApplications === "function") {
    displayApplications();
  }
});
