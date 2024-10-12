// Initialize Appwrite SDK (kept as is, though not used for assign room)
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const databases = new Appwrite.Databases(client);

// Constants for database and collection IDs
const DATABASE_ID = "66e4b088002534a2ffe1";
const COLLECTION_ID = "670257ac0031bc7067ce";
const STUDENT_ROOMS_COLLECTION_ID = "6702579e0022444bdf9d";
const ROOMS_COLLECTION_ID = "6702577b00162a4bdd41"; // Rooms collection ID

// Fetch and display accepted applications (kept as is)
function displayAcceptedApplications() {
  const applicationsTableBody = document.getElementById("applications-table-body");
  const messageElement = document.getElementById("message");

  applicationsTableBody.innerHTML = ""; // Clear table before adding new rows

  if (!applicationsTableBody) {
    console.error("Table body not found");
    if (messageElement) {
      messageElement.textContent = "Application table not found.";
    }
    return;
  }

  databases
    .listDocuments(DATABASE_ID, COLLECTION_ID, [
      Appwrite.Query.equal("Status", "Accepted"),
    ])
    .then((response) => {
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
          <td>
            <button class="assign-room-btn btn btn-primary" data-app-id="${app.$id}">
              Assign Room
            </button>
          </td>
        `;

        applicationsTableBody.appendChild(row);
      });

      // Attach event listeners for the "Assign Room" buttons
      attachAssignRoomListeners();
    })
    .catch((error) => {
      console.error("Failed to fetch accepted applications:", error);
      if (messageElement) {
        messageElement.textContent =
          "Failed to fetch applications. Please try again.";
      }
    });
}

// Open room assignment dialog (front-end + backend functionality)
function openRoomDialog(applicationId) {
  const roomDialog = document.getElementById("room-dialog");
  roomDialog.style.display = "block";

  const assignRoomBtn = document.getElementById("assign-room-btn");

  // Clear any previous event listeners
  assignRoomBtn.onclick = null;

  // Assign room button action
  assignRoomBtn.onclick = function () {
    const roomNumber = parseInt(document.getElementById("room-number").value);

    if (!roomNumber || roomNumber < 101 || roomNumber > 450) {
      alert("Invalid Room Number. Please enter a valid room number between 101 and 450.");
      return;
    }

    // Retrieve the student name from the Applications collection
    databases
      .getDocument(DATABASE_ID, COLLECTION_ID, applicationId)
      .then((response) => {
        const studentName = response.Name;
        const floor = Math.floor(roomNumber / 100); // Floor is determined by room number (e.g., 1st floor for 100 series)

        // Check if the room exists in the Rooms collection
        databases
          .getDocument(DATABASE_ID, ROOMS_COLLECTION_ID, roomNumber.toString())
          .then((roomResponse) => {
            const { Student1ID, Student2ID } = roomResponse;

            // Check room availability
            if (Student1ID && Student2ID) {
              alert("Both spots are filled. Cannot assign room.");
              return;
            }

            // Assign student ID to the appropriate Student ID field
            const updates = {};
            if (!Student1ID) {
              updates.Student1ID = applicationId; // Assign to Student1ID
            } else if (!Student2ID) {
              updates.Student2ID = applicationId; // Assign to Student2ID
            }

            // Update the room document with the new student ID
            databases
              .updateDocument(DATABASE_ID, ROOMS_COLLECTION_ID, roomNumber.toString(), updates)
              .then(() => {
                // Create a new document in the Student Rooms Info collection
                databases
                  .createDocument(
                    DATABASE_ID, // Same database
                    STUDENT_ROOMS_COLLECTION_ID, // Student Rooms Info collection ID
                    applicationId, // Auto-generate a unique document ID
                    {
                      Name: studentName,
                      RoomNumber: roomNumber,
                      Floor: floor,
                    }
                  )
                  .then(() => {
                    alert(`Room ${roomNumber} assigned to ${studentName}`);
                    closeRoomDialog(); // Close the dialog after assignment

                    // Update the "Assign Room" button text to "Already Assigned"
                    const assignRoomButton = document.querySelector(`button[data-app-id="${applicationId}"]`);
                    if (assignRoomButton) {
                      assignRoomButton.textContent = "Already Assigned";
                      assignRoomButton.disabled = true;
                    }
                  })
                  .catch((error) => {
                    console.error("Failed to assign room:", error);
                    alert("Failed to assign room. Please try again.");
                  });
              })
              .catch((error) => {
                console.error("Failed to update room:", error);
                alert("Failed to update room. Please try again.");
              });
          })
          .catch((error) => {
            console.error("Failed to retrieve room data:", error);
            alert("Failed to retrieve room information. Please try again.");
          });
      })
      .catch((error) => {
        console.error("Failed to retrieve student data:", error);
        alert("Failed to retrieve student information. Please try again.");
      });
  };
}

// Close the room assignment dialog
function closeRoomDialog() {
  const roomDialog = document.getElementById("room-dialog");
  roomDialog.style.display = "none";
  document.getElementById("room-number").value = ""; // Clear input
}

// Attach listeners to assign room buttons (front-end only)
function attachAssignRoomListeners() {
  const assignRoomButtons = document.querySelectorAll(".assign-room-btn");

  assignRoomButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const applicationId = button.getAttribute("data-app-id");
      openRoomDialog(applicationId); // Open dialog with backend functionality

      // Retrieve the name of the student from the collection
      databases
        .getDocument(DATABASE_ID, COLLECTION_ID, applicationId)
        .then((response) => {
          const studentName = response.Name;
          console.log(`DocumentID of the student: ${applicationId}`);
          console.log(`Name of the student: ${studentName}`);
        })
        .catch((error) => {
          console.error("Failed to retrieve student name:", error);
        });
    });
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  displayAcceptedApplications(); // Fetch applications

  // Close dialog event listener
  document
    .getElementById("close-dialog")
    .addEventListener("click", closeRoomDialog);
});
