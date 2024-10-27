// Initialize Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client); // Initialize storage client

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
                <button onclick="submitApplication('${app.$id}', '${
          app.AadharFileID || "N/A"
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
function submitApplication(applicationId, AadharFileID) {
  const status = document.getElementById(`status-${applicationId}`).value;
  const remarks = document.getElementById(`remarks-${applicationId}`).value;

  // Update the application status and remarks
  databases
    .updateDocument(DATABASE_ID, COLLECTION_ID, applicationId, {
      Status: status,
      Remarks: remarks,
      Processed: true, // Mark the application as processed
    })
    .then(() => {
      // If the application is rejected, delete the Aadhar file
      if (status === "Rejected" && AadharFileID !== "N/A") {
        deleteAadharFile(AadharFileID);
      } else {
        alert("Application updated successfully!");
      }

      // Remove the corresponding row from the table
      const row = document
        .querySelector(
          `button[onclick="submitApplication('${applicationId}', '${AadharFileID}')"]`
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

// Function to delete Aadhar file from the bucket
function deleteAadharFile(AadharFileID) {
  const bucketId = "67043852000455e53296"; // Your bucket ID

  storage
    .deleteFile(bucketId, AadharFileID)
    .then(() => {
      console.log("Aadhar file deleted successfully.");
      alert("Aadhar file deleted successfully.");
    })
    .catch((error) => {
      console.error("Failed to delete Aadhar file:", error);
      alert("Failed to delete Aadhar file.");
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
});
