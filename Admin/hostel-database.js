// Initialize Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('66cfe746002e495cbc84'); // Your project ID

const databases = new Appwrite.Databases(client);

const DATABASE_ID = '66e4b088002534a2ffe1'; // Your Database ID
const COLLECTION_ID = '6702577b00162a4bdd41'; // Your Rooms Collection ID

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
function populateRoomTable(roomData) {
  const roomTableBody = document.getElementById('room-data');
  roomTableBody.innerHTML = '';

  let currentFloor = null;

  // Loop through the room data and create table rows
  roomData.forEach(room => {
    if (room.Floor !== currentFloor) {
      // Create a floor heading
      const floorHeading = document.createElement('tr');
      floorHeading.innerHTML = `<td colspan="4" style="padding-top: 20px; font-weight: bold; font-size: 1.2em;">Floor ${room.Floor}</td>`;
      roomTableBody.appendChild(floorHeading);

      // Update currentFloor to the new floor
      currentFloor = room.Floor;
    }

    // Create the row for the room data
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${room.RoomNumber}</td>
      <td>${room.Floor}</td>
      <td>${room.Student1ID ? room.Student1ID : 'Vacant'}</td>
      <td>${room.Student2ID ? room.Student2ID : 'Vacant'}</td>
    `;

    roomTableBody.appendChild(row);
  });
}

document.getElementById('accepted-applications').addEventListener('click', () => {
  window.location.href = 'accepted.html'; 
});

// Run the fetch function on page load
window.onload = fetchRoomData;
