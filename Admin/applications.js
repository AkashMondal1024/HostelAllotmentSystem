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

function displayApplications() {
  const applicationsTableBody = document.getElementById(
    "applications-table-body"
  );
  const messageElement = document.getElementById("message");

  // Clear the table body before adding new rows
  if (applicationsTableBody) {
    applicationsTableBody.innerHTML = "";
  }

  // Only fetch applications where Processed is false
  databases
    .listDocuments(DATABASE_ID, COLLECTION_ID, [
      Appwrite.Query.equal("Processed", false),
    ])
    .then((response) => {
      const applications = response.documents;

      if (applications.length === 0) {
        console.log("No applications found where Processed is false.");
        if (messageElement) {
          messageElement.textContent = "No applications found.";
        }
        return;
      }

      // Extract incomes and distances for score calculation
      const incomes = applications
        .map((app) => app.FamilyAnnualIncome)
        .filter((income) => !isNaN(income));

      const distances = applications
        .map((app) => app.Distance)
        .filter((distance) => !isNaN(distance));

      const maxIncome = Math.max(...incomes);
      const minIncome = Math.min(...incomes);
      const maxDistance = Math.max(...distances);
      const minDistance = Math.min(...distances);

      console.log("Max Income:", maxIncome);
      console.log("Min Income:", minIncome);
      console.log("Max Distance:", maxDistance);
      console.log("Min Distance:", minDistance);

      // Add scores to applications
      const scoredApplications = applications.map((app) => ({
        ...app,
        score:
          (maxIncome - app.FamilyAnnualIncome) / (maxIncome - minIncome) +
          (app.Distance - minDistance) / (maxDistance - minDistance),
      }));

      // Sort by score in descending order
      scoredApplications.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Higher score first
        }
        return new Date(a.$createdAt) - new Date(b.$createdAt); // Earlier application first
      });

      // Group applications by semester
      const groupedBySemester = {};
      scoredApplications.forEach((app) => {
        const semester = app.Semester || "Unknown";
        if (!groupedBySemester[semester]) {
          groupedBySemester[semester] = [];
        }
        groupedBySemester[semester].push(app);
      });

      // Render grouped applications
      Object.keys(groupedBySemester)
        .sort((a, b) => a - b) // Sort semesters numerically
        .forEach((semester) => {
          // Create a heading for each semester
          const semesterHeading = document.createElement("tr");
          semesterHeading.innerHTML = `<th colspan="12" style="text-align:left;">Semester ${semester}</th>`;
          applicationsTableBody.appendChild(semesterHeading);

          // Render applications for this semester
          groupedBySemester[semester].forEach((app) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${app.Name || "N/A"}</td>
                <td>${app.RegistrationNumber || "N/A"}</td>
                <td>${app.RollNo || "N/A"}</td>
                <td>${app.Degree || "N/A"}</td>
                <td>${app.Stream || "N/A"}</td>
                <td>${app.Semester || "N/A"}</td>
                <td>${app.FamilyAnnualIncome || "N/A"}</td>
                <td>${app.Distance || "N/A"}</td>
                <td>${app.score.toFixed(2) || "N/A"}</td>
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
            applicationsTableBody.appendChild(row);
          });
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

// Function to view Aadhar
function viewAadhar(aadharFileId) {
  if (aadharFileId === "N/A") {
    alert("Aadhar file not available.");
    return;
  }

  const aadharUrl = storage.getFilePreview(
    "67043852000455e53296",
    aadharFileId
  );
  window.open(aadharUrl.href, "_blank");
}

// Function to submit application status and remarks
function submitApplication(applicationId, aadharFileId) {
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
      if (status === "Rejected" && aadharFileId !== "N/A") {
        deleteAadharFile(aadharFileId);
      } else {
        alert("Application updated successfully.");
      }

      // Refresh the applications list
      displayApplications();
    })
    .catch((error) => {
      console.error("Failed to update application:", error);
      alert("Failed to update application. Please try again.");
    });
}

// Function to delete Aadhar file
function deleteAadharFile(aadharFileId) {
  storage
    .deleteFile("67043852000455e53296", aadharFileId)
    .then(() => {
      alert("Aadhar file deleted successfully.");
    })
    .catch((error) => {
      console.error("Failed to delete Aadhar file:", error);
      alert("Failed to delete Aadhar file. Please try again.");
    });
}

// Initialize display on page load
document.addEventListener("DOMContentLoaded", displayApplications);

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
