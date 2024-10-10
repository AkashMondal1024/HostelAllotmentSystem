// Initialize the Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject('66cfe746002e495cbc84'); // Your project ID

const databases = new Appwrite.Databases(client);

const DATABASE_ID = '66e4b088002534a2ffe1'; // Your Database ID
const COLLECTION_ID = '6702577b00162a4bdd41'; // Your Rooms Collection ID

// Function to create rooms with delay
async function createRooms() {
  const totalFloors = 4; // Four floors (First to Fourth Year)
  const roomsPerFloor = 50; // 50 rooms per floor

  // Helper function to introduce a delay of 100ms
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  for (let floor = 1; floor <= totalFloors; floor++) {
    for (let room = 1; room <= roomsPerFloor; room++) {
      const roomNumber = (floor * 100) + room; // Room numbering, e.g., 101, 102... for first floor, 201, 202... for second floor

      // Create a document (room) in the Rooms collection with roomNumber as Document ID
      try {
        const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, roomNumber.toString(), { 
          RoomNumber: roomNumber,
          Floor: floor,
          Student1ID: '', // Initially empty
          Student2ID: ''  // Initially empty
        });
        console.log(`Room ${roomNumber} on floor ${floor} created successfully.`);
      } catch (error) {
        console.error(`Failed to create room ${roomNumber}:`, error);
      }

      // Add a 100ms delay before creating the next room
      await delay(100);
    }
  }
}

// Run the function to create the rooms
createRooms();
