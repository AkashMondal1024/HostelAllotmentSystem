// Initialize Appwrite SDK
const client = new Appwrite.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client); // Storage client for fetching images

// Constants for database and collection IDs
const DATABASE_ID = "66e4b088002534a2ffe1";
const COLLECTION_ID = "66e4b098001d3dd600f9";
const NEW_COLLECTION_ID = "670257ac0031bc7067ce";
const BUCKET_ID = "67043852000455e53296"; // Your storage bucket ID

// Get user ID from local storage
const userId = localStorage.getItem("userID");

if (!userId) {
  // If no userID is found, redirect to the login page
  window.location.href = "student.html";
} else {
  // Fetch the account details of the logged-in user
  account
    .get()
    .then((response) => {
      // Fetch additional student profile data from the Appwrite database
      databases
        .getDocument(DATABASE_ID, COLLECTION_ID, userId)
        .then((doc) => {
          // Update the input fields with student data
          document.getElementById("name").value = doc.Name || "";
          document.getElementById("father-name").value = doc.FatherName || "";
          document.getElementById("reg-number").value =
            doc.RegistrationNumber || "";
          document.getElementById("roll-number").value = doc.RollNo || "";
          document.getElementById("degree").value = doc.Degree || "BTech";
          document.getElementById("stream").value = doc.Stream || "";
          document.getElementById("semester").value = doc.Semester || "";
          document.getElementById("income").value =
            doc.FamilyAnnualIncome || "";
        })
        .catch((error) => {
          console.error("Failed to fetch student data:", error);
        });
    })
    .catch((error) => {
      console.error("Failed to fetch user details:", error);
    });
}

// Function to submit application data
const submitButton = document.getElementById("submit_button");

submitButton.addEventListener("click", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const fatherName = document.getElementById("father-name").value;
  const degree = document.getElementById("degree").value;
  const stream = document.getElementById("stream").value;
  const semester = document.getElementById("semester").value;
  const regNumber = parseInt(document.getElementById("reg-number").value, 10);
  const rollNumber = parseInt(document.getElementById("roll-number").value, 10);
  const annualIncome = parseInt(document.getElementById("income").value, 10);
  const distance = parseInt(document.getElementById("distance").value, 10);
  const aadharFile = document.getElementById("aadhar").files[0];

  const applicationData = {
    Name: name,
    FatherName: fatherName,
    Degree: degree,
    Stream: stream,
    Semester: semester,
    RegistrationNumber: regNumber,
    RollNo: rollNumber,
    FamilyAnnualIncome: annualIncome,
    Distance: distance,
    Processed: false,
    Status: "Pending",
    Remarks: null,
  };

  // Check if userID exists in the NEW_COLLECTION
  databases
    .getDocument(DATABASE_ID, NEW_COLLECTION_ID, userId)
    .then(() => {
      // If userID exists, upload the Aadhar file
      if (aadharFile) {
        uploadAadhar(userId, applicationData, aadharFile);
      } else {
        // If no Aadhar file is uploaded, save the application data without it
        saveApplicationData(userId, applicationData);
      }
    })
    .catch((error) => {
      if (error.code === 404) {
        // If the user does not exist, create the document and upload the file
        if (aadharFile) {
          createNewDocumentWithFile(userId, applicationData, aadharFile);
        } else {
          // If no Aadhar file is uploaded, save the application data without it
          saveApplicationData(userId, applicationData);
        }
      } else {
        console.error("Failed to fetch document:", error);
        document.getElementById("message").textContent =
          "Failed to fetch document. Please try again.";
      }
    });
});

// Function to upload Aadhar file
function uploadAadhar(userId, applicationData, aadharFile) {
  const bucketId = "67043852000455e53296"; // Storage bucket ID

  // Check if the file already exists in the bucket
  storage
    .listFiles(bucketId, [Appwrite.Query.equal("$id", userId)])
    .then((filesResponse) => {
      if (filesResponse.total > 0) {
        // File exists, delete the existing file
        storage
          .deleteFile(bucketId, filesResponse.files[0].$id)
          .then(() => {
            // After deleting, upload the new file
            createNewAadharFile(userId, applicationData, aadharFile, bucketId);
          })
          .catch((error) => {
            console.error("Failed to delete old Aadhar file:", error);
            document.getElementById("message").textContent =
              "Failed to delete old Aadhar file. Please try again.";
          });
      } else {
        // No existing file, directly upload the new file
        createNewAadharFile(userId, applicationData, aadharFile, bucketId);
      }
    })
    .catch((error) => {
      console.error("Failed to check existing files:", error);
      document.getElementById("message").textContent =
        "Failed to check existing files. Please try again.";
    });
}

function createNewAadharFile(userId, applicationData, aadharFile, bucketId) {
  storage
    .createFile(bucketId, userId, aadharFile)
    .then((fileResponse) => {
      console.log("Aadhar Uploaded:", fileResponse);

      applicationData.AadharFileID = fileResponse.$id; // Update with new file ID

      // Save or update the application data in the new collection
      saveOrUpdateApplicationData(userId, applicationData);
    })
    .catch((error) => {
      console.error("Aadhar Upload Failed:", error);
      document.getElementById("message").textContent =
        "Aadhar Upload Failed. Please try again.";
    });
}

// Function to create a new document with Aadhar file
function createNewDocumentWithFile(userId, applicationData, aadharFile) {
  storage
    .createFile(BUCKET_ID, userId, aadharFile)
    .then((fileResponse) => {
      console.log("Aadhar Uploaded:", fileResponse);
      applicationData.AadharFileID = fileResponse.$id; // Update with new file ID

      // Create the new document in the NEW_COLLECTION
      databases
        .createDocument(DATABASE_ID, NEW_COLLECTION_ID, userId, applicationData)
        .then((response) => {
          console.log("Application Data Saved:", response);
          document.getElementById("message").textContent =
            "Application Submitted Successfully";

          // Redirect to app-status.html after successful submission
          setTimeout(() => {
            window.location.href = "app-status.html";
          }, 1000); // Redirect after 1 second
        })
        .catch((error) => {
          console.error("Failed to save application data:", error);
          document.getElementById("message").textContent =
            "Failed to submit application. Please try again.";
        });
    })
    .catch((error) => {
      console.error("Aadhar Upload Failed:", error);
      document.getElementById("message").textContent =
        "Aadhar Upload Failed. Please try again.";
    });
}

// Function to save or update application data in the new collection
function saveOrUpdateApplicationData(userId, applicationData) {
  // Check if the document already exists in the collection
  databases
    .getDocument(DATABASE_ID, NEW_COLLECTION_ID, userId)
    .then((existingDocument) => {
      // Document exists, update it
      databases
        .updateDocument(DATABASE_ID, NEW_COLLECTION_ID, userId, applicationData)
        .then((response) => {
          console.log("Application Data Updated:", response);
          document.getElementById("message").textContent =
            "Application Updated Successfully";

          // Redirect to app-status.html after successful submission
          setTimeout(() => {
            window.location.href = "app-status.html";
          }, 1000); // Redirect after 1 second
        })
        .catch((error) => {
          console.error("Failed to update application data:", error);
          document.getElementById("message").textContent =
            "Failed to update application. Please try again.";
        });
    })
    .catch((error) => {
      if (error.code === 404) {
        // Document does not exist, create it
        databases
          .createDocument(DATABASE_ID, NEW_COLLECTION_ID, userId, applicationData)
          .then((response) => {
            console.log("Application Data Saved:", response);
            document.getElementById("message").textContent =
              "Application Submitted Successfully";

            // Redirect to app-status.html after successful submission
            setTimeout(() => {
              window.location.href = "app-status.html";
            }, 1000); // Redirect after 1 second
          })
          .catch((error) => {
            console.error("Failed to save application data:", error);
            document.getElementById("message").textContent =
              "Failed to submit application. Please try again.";
          });
      } else {
        console.error("Failed to fetch document:", error);
        document.getElementById("message").textContent =
          "Failed to fetch document. Please try again.";
      }
    });
}

// Function to save application data to the new collection
function saveApplicationData(userId, applicationData) {
  databases
    .createDocument(DATABASE_ID, NEW_COLLECTION_ID, userId, applicationData)
    .then((response) => {
      console.log("Application Data Saved:", response);
      document.getElementById("message").textContent =
        "Application Submitted Successfully";

      // Redirect to app-status.html after successful submission
      setTimeout(() => {
        window.location.href = "app-status.html";
      }, 1000); // Redirect after 1 second
    })
    .catch((error) => {
      console.error("Failed to save application data:", error);
      document.getElementById("message").textContent =
        "Failed to submit application. Please try again.";
    });
}
