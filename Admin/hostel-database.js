(function () {
  // Initialize Appwrite SDK
  const client = new Appwrite.Client();

  client
    .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
    .setProject("66cfe746002e495cbc84"); // Your project ID

  const databases = new Appwrite.Databases(client);

  const DATABASE_ID = "66e4b088002534a2ffe1"; // Your Database ID
  const COLLECTION_ID = "6702577b00162a4bdd41"; // Your Rooms Collection ID
  const STUDENT_COLLECTION_ID = "66e4b098001d3dd600f9"; // Your Student Info Collection ID
  const STUDENT_ROOM_INFO_COLLECTION_ID = "6702579e0022444bdf9d"; // Your Student Room Info Collection ID

  let currentStudentId = null; // To store the selected student ID

  // Function to fetch student names by their IDs
  async function getStudentNameById(studentId) {
    try {
      const studentDoc = await databases.getDocument(
        DATABASE_ID,
        STUDENT_COLLECTION_ID,
        studentId
      );
      return studentDoc.Name;
    } catch (error) {
      console.error(`Error fetching student name for ID: ${studentId}`, error);
      return "Unknown"; // Return 'Unknown' if there was an error
    }
  }

  // Function to fetch room data
  async function fetchRoomData() {
    const limit = 100;
    let offset = 0;
    let allRooms = [];

    try {
      while (true) {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Appwrite.Query.limit(limit), Appwrite.Query.offset(offset)]
        );
        allRooms = allRooms.concat(response.documents);

        if (response.documents.length < limit) {
          break;
        }
        offset += limit;
      }

      // Sort rooms by RoomNumber
      allRooms.sort((a, b) => a.RoomNumber - b.RoomNumber);

      // Populate room data
      populateRoomTable(allRooms);
    } catch (error) {
      console.error("Error fetching room data:", error);
    }
  }

  // Function to populate room data in the table
  async function populateRoomTable(roomData) {
    const roomTableBody = document.getElementById("room-data");
    roomTableBody.innerHTML = "";

    let currentFloor = null;

    for (const room of roomData) {
      if (room.Floor !== currentFloor) {
        const floorHeading = document.createElement("tr");
        floorHeading.innerHTML = `<td colspan="6" style="padding-top: 20px; font-weight: bold; font-size: 1.2em;">Floor ${room.Floor}</td>`;
        roomTableBody.appendChild(floorHeading);
        currentFloor = room.Floor;
      }

      const student1Name = room.Student1ID
        ? await getStudentNameById(room.Student1ID)
        : "Vacant";
      const student2Name = room.Student2ID
        ? await getStudentNameById(room.Student2ID)
        : "Vacant";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${room.RoomNumber}</td>
        <td>${room.Floor}</td>
        <td>${student1Name}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="openAccessoryModal('${room.Student1ID}')">
            Update
          </button>
        </td>
        <td>${student2Name}</td>
        <td>
          <button class="btn btn-sm btn-info" onclick="openAccessoryModal('${room.Student2ID}')">
            Update
          </button>
        </td>
      `;

      roomTableBody.appendChild(row);
    }
  }

  // Open modal for accessory selection and pre-fill checkboxes
  async function openAccessoryModal(studentId) {
    currentStudentId = studentId;

    // Fetch the current accessory data for the student
    try {
      const accessoryData = await databases.getDocument(
        DATABASE_ID,
        STUDENT_ROOM_INFO_COLLECTION_ID,
        studentId
      );

      // Pre-fill checkboxes based on accessory data (1 = checked, 0 = unchecked)
      document.getElementById("fan").checked = accessoryData.Fan === 1;
      document.getElementById("cupboard").checked =
        accessoryData.Cupboard === 1;
      document.getElementById("bed").checked = accessoryData.Bed === 1;
      document.getElementById("mattress").checked =
        accessoryData.Mattress === 1;
      document.getElementById("table").checked = accessoryData.Table === 1;
      document.getElementById("chair").checked = accessoryData.Chair === 1;
    } catch (error) {
      console.error("Error fetching accessory data:", error);

      // Set checkboxes to unchecked by default if there's an error or no data
      document.getElementById("fan").checked = false;
      document.getElementById("cupboard").checked = false;
      document.getElementById("bed").checked = false;
      document.getElementById("mattress").checked = false;
      document.getElementById("table").checked = false;
      document.getElementById("chair").checked = false;
    }

    const accessoryModal = new bootstrap.Modal(
      document.getElementById("accessoryModal")
    );
    accessoryModal.show();
  }

  // Expose the function to the global scope
  window.openAccessoryModal = openAccessoryModal;

  // Submit selected accessories and refresh the page
  async function submitAccessories() {
    const accessoryData = {
      Fan: document.getElementById("fan").checked ? 1 : 0,
      Cupboard: document.getElementById("cupboard").checked ? 1 : 0,
      Bed: document.getElementById("bed").checked ? 1 : 0,
      Mattress: document.getElementById("mattress").checked ? 1 : 0,
      Table: document.getElementById("table").checked ? 1 : 0,
      Chair: document.getElementById("chair").checked ? 1 : 0,
    };

    try {
      await databases.updateDocument(
        DATABASE_ID,
        STUDENT_ROOM_INFO_COLLECTION_ID,
        currentStudentId,
        accessoryData
      );
      alert("Accessories updated successfully!");

      // Refresh the page after updating accessories
      location.reload(); // This will refresh the page
    } catch (error) {
      if (error.message && error.message.includes("404")) {
        alert("Student Data Not Found");
      } else {
        console.error("Error updating accessories:", error);
      }
    }
  }

  // Expose the submit function to the global scope
  window.submitAccessories = submitAccessories;

  // Show the spinner on page load and hide when content is ready
  window.onload = function () {
    fetchRoomData();
    setTimeout(() => {
      const spinner = document.getElementById("loadingSpinner");
      spinner.style.display = "none"; // Hide spinner when page is loaded
    }, 2000); // Adjust time as needed
  };
})();

document.getElementById("accepted-applications").addEventListener("click", function () {
  window.location.href = "accepted.html";
});
