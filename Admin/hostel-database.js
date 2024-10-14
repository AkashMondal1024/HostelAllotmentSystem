// Initialize Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('66cfe746002e495cbc84'); // Your project ID

const databases = new Appwrite.Databases(client);

const DATABASE_ID = '66e4b088002534a2ffe1'; // Your Database ID
const COLLECTION_ID = '6702577b00162a4bdd41'; // Your Rooms Collection ID
const STUDENT_COLLECTION_ID = '66e4b098001d3dd600f9'; // Replace with your actual student collection ID

// Function to fetch student names by their IDs
async function getStudentNameById(studentId) {
  try {
    const studentDoc = await databases.getDocument(DATABASE_ID, STUDENT_COLLECTION_ID, studentId);
    console.log(`Fetched student document for ID: ${studentId}`, studentDoc); // Debugging log
    return studentDoc.Name; // Check that 'Name' is the correct field in your student collection
  } catch (error) {
    console.error(`Error fetching student name for ID: ${studentId}`, error);
    return 'Unknown'; // Return 'Unknown' if there was an error or the student does not exist
  }
}

// Function to fetch all documents with pagination
async function fetchRoomData() {
  const limit = 100; // Set the limit of documents to fetch in each batch
  let offset = 0; // Track the offset for pagination
  let allRooms = [];

  try {
    // Fetch all documents with pagination
    while (true) {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Appwrite.Query.limit(limit), Appwrite.Query.offset(offset)]);
      
      allRooms = allRooms.concat(response.documents); // Append the documents to the allRooms array

      if (response.documents.length < limit) {
        break; // Exit the loop if there are no more documents
      }

      offset += limit; // Increment offset to fetch the next batch of documents
    }

    // Sort rooms by RoomNumber
    allRooms.sort((a, b) => a.RoomNumber - b.RoomNumber);

    // Populate the table with all the room data
    populateRoomTable(allRooms);
  } catch (error) {
    console.error('Error fetching room data:', error);
  }
}

// Function to populate the table with room data
async function populateRoomTable(roomData) {
  const roomTableBody = document.getElementById('room-data');
  roomTableBody.innerHTML = '';

  let currentFloor = null;

  for (const room of roomData) {
    if (room.Floor !== currentFloor) {
      // Create a floor heading
      const floorHeading = document.createElement('tr');
      floorHeading.innerHTML = `<td colspan="4" style="padding-top: 20px; font-weight: bold; font-size: 1.2em;">Floor ${room.Floor}</td>`;
      roomTableBody.appendChild(floorHeading);

      // Update currentFloor to the new floor
      currentFloor = room.Floor;
    }

    // Fetch student names by their IDs
    const student1Name = room.Student1ID ? await getStudentNameById(room.Student1ID) : 'Vacant';
    const student2Name = room.Student2ID ? await getStudentNameById(room.Student2ID) : 'Vacant';

    // Create the row for the room data
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${room.RoomNumber}</td>
      <td>${room.Floor}</td>
      <td>${student1Name}</td>
      <td>${student2Name}</td>
    `;

    roomTableBody.appendChild(row);
  }
}

document.getElementById('accepted-applications').addEventListener('click', () => {
  window.location.href = 'accepted.html'; 
});

// Run the fetch function on page load
window.onload = fetchRoomData;
