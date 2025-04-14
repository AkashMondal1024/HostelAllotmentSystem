// Initialize Appwrite SDK
const client = new Appwrite.Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client); // Add storage client

const submitButton = document.getElementById("submit_button");

submitButton.addEventListener("click", function(event) {
  event.preventDefault(); // Prevents the default form submission
  const missingFields = validateForm();
  if (missingFields.length === 0) {
    signup(); // Call the signup function if validation passes
  } else {
    document.getElementById("message").textContent = `Missing fields: ${missingFields.join(', ')}`;
  }
});

// Function to validate form inputs
function validateForm() {
  const fields = {
    "Name": "name",
    "Father's Name": "father-name",
    "Mother's Name": "mother-name",
    "Degree": "degree",
    "Stream": "stream",
    "Semester": "semester",
    "Date of Birth": "dob",
    "Registration Number": "reg-number",
    "Roll Number": "roll-number",
    "Local Address": "local-address",
    "Permanent Address": "permanent-address",
    "Email": "email",
    "Admission Batch": "batch",
    "Entrance Exam": "entrance-exam",
    "Entrance Exam Rank": "rank",
    "Aadhar Number": "aadhar",
    "Mobile Number": "mobile",
    "Guardian's Mobile Number": "guardian-mobile",
    "Family Annual Income": "income",
    "Marital Status": "marital-status",
    "Gender": "gender",
    "Physically Handicapped": "handicapped",
    "Category": "category",
    "Password": "password",
    "Photo": "photo"
  };

  const missingFields = [];

  // Check all fields except photo
  for (const [fieldName, fieldId] of Object.entries(fields)) {
    const value = document.getElementById(fieldId).value;
    if (value === "" || value === undefined || value === null) {
      missingFields.push(fieldName);
    }
  }

  // Check the photo file input separately
  const photo = document.getElementById("photo").files[0];
  if (!photo) {
    missingFields.push("Photo");
  }

  return missingFields; // Return an array of missing fields
}

function signup() {
  const name = document.getElementById("name").value;
  const fatherName = document.getElementById("father-name").value;
  const motherName = document.getElementById("mother-name").value;
  const degree = document.getElementById("degree").value;
  const stream = document.getElementById("stream").value;
  const semester = document.getElementById("semester").value;
  const dob = document.getElementById("dob").value;
  const regNumber = parseInt(document.getElementById("reg-number").value, 10);
  const rollNumber = parseInt(document.getElementById("roll-number").value, 10);
  const localAddress = document.getElementById("local-address").value;
  const permanentAddress = document.getElementById("permanent-address").value;
  const email = document.getElementById("email").value;
  const batch = parseInt(document.getElementById("batch").value,10);
  const entranceExam = document.getElementById("entrance-exam").value;
  const rank = parseInt(document.getElementById("rank").value, 10);
  const aadhar = parseInt(document.getElementById("aadhar").value, 10);
  const mobile = parseInt(document.getElementById("mobile").value, 10);
  const guardianMobile = parseInt(document.getElementById("guardian-mobile").value, 10);
  const income = parseInt(document.getElementById("income").value, 10);
  const maritalStatus = document.getElementById("marital-status").value;
  const gender = document.getElementById("gender").value;
  const handicapped = document.getElementById("handicapped").value;
  const category = document.getElementById("category").value;
  const password = document.getElementById("password").value; 
  const photo = document.getElementById("photo").files[0];
  const userId = Appwrite.ID.unique();

  const profileDetails = {
    Name: name,
    FatherName: fatherName,
    MotherName: motherName,
    Degree: degree,
    Stream: stream,
    Semester: semester,
    DOB: dob,
    RegistrationNumber: regNumber,
    RollNo: rollNumber,
    LocalAddress: localAddress,
    PermanentAddress: permanentAddress,
    Email: email,
    AdmissionBatch: batch,
    EntranceExam: entranceExam,
    EntranceExamRank: rank,
    AadharNumber: aadhar,
    Phone: mobile,
    GuardianMobile: guardianMobile,
    FamilyAnnualIncome: income,
    MaritalStatus: maritalStatus,
    Gender: gender,
    PhysicallyHandicapped: handicapped,
    Category: category
  };

  // First, attempt to upload the photo
  uploadPhoto(userId, profileDetails, photo, password);
}

// Function to upload the photo first
function uploadPhoto(userId, profileDetails, photo, password) {
  const bucketId = '66edbc16003335ab378a'; // Replace with your Appwrite storage bucket ID

  storage.createFile(bucketId, userId, photo)
    .then((fileResponse) => {
      console.log('Image Uploaded:', fileResponse);

      // Add the PhotoFileId to the profile details
      profileDetails.PhotoFileId = fileResponse.$id;

      // Now save the profile details in the database
      saveProfileDetails(userId, profileDetails, password);
    })
    .catch((error) => {
      console.error("Image Upload Failed:", error);
      document.getElementById("message").textContent = "Image Upload Failed. Please upload a valid image.";
    });
}

// Function to save user details in the Appwrite collection
function saveProfileDetails(userId, profileDetails, password) {
  const databaseId = "66e4b088002534a2ffe1"; // Replace with your database ID
  const collectionId = "66e4b098001d3dd600f9"; // Replace with your collection ID

  databases.createDocument(databaseId, collectionId, userId, profileDetails)
    .then((response) => {
      console.log("Profile details saved:", response);

      // If the database document is created successfully, proceed to create the user account
      createUserAccount(userId, profileDetails.Email, password, profileDetails.Name);
    })
    .catch((error) => {
      let errorMessage="";
      console.error("Failed to save profile details:", error);
      if(error.message.includes("Invalid document structure")){
        if(error.message.includes("RegistrationNumber")){
          errorMessage+="Invalid Registration Number";
        }
        else if(error.message.includes("RollNo")){
          errorMessage+="Invalid Roll Number";
        }
        else if(error.message.includes("Stream")){
          errorMessage+="Invalid Stream";
        }
        else if(error.message.includes("Semester")){
          errorMessage+="Invalid Semester";
        }
        else if(error.message.includes("RollNo")){
          errorMessage+="Invalid Roll Number";
        }
        else if(error.message.includes("AdmissionBatch")){
          errorMessage+="Invalid Admission Batch";
        }
        else if(error.message.includes("EntranceExamRank")){
          errorMessage+="Invalid Rank";
        }
        else if(error.message.includes("AadharNumber")){
          errorMessage+="Invalid Aadhar Number";
        }
        else if(error.message.includes("Phone")){
          errorMessage+="Invalid Phone Number";
        }
        else if(error.message.includes("GuardianMobile")){
          errorMessage+="Invalid Guardian Mobile Number";
        }
        else if(error.message.includes("FamilyAnnualIncome")){
          errorMessage+="Invalid Annual Income";
        }
      }
      document.getElementById("message").textContent = "Profile creation failed: " + errorMessage;

      // If document creation fails, delete the uploaded image to avoid orphaned images
      deletePhoto(userId);
    });
}

// Function to create the user account
function createUserAccount(userId, email, password, name) {
  account.create(userId, email, password, name)
    .then((response) => {
      console.log("Signup Successful:", response);

      // Display success message
      document.getElementById("message").textContent = "Signup Successful";

      // Redirect to a confirmation page after 1 second
      setTimeout(() => {
        window.location.href = "student.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Signup Failed:", error);
      document.getElementById("message").textContent = "Signup Failed: " + error.message;

      // If signup fails, clean up by deleting the uploaded photo and the database record
      deletePhoto(userId);
      deleteDatabaseRecord(userId);
    });
}

// Function to delete the uploaded photo if signup fails
function deletePhoto(userId) {
  const bucketId = '66edbc16003335ab378a';

  storage.deleteFile(bucketId, userId)
    .then(() => {
      console.log("Uploaded photo deleted due to signup failure.");
    })
    .catch((deleteError) => {
      console.error("Failed to delete uploaded photo:", deleteError);
    });
}

// Function to delete the database document if signup fails
function deleteDatabaseRecord(userId) {
  const databaseId = "66e4b088002534a2ffe1"; 
  const collectionId = "66e4b098001d3dd600f9";

  databases.deleteDocument(databaseId, collectionId, userId)
    .then(() => {
      console.log("Database record deleted due to signup failure.");
    })
    .catch((deleteError) => {
      console.error("Failed to delete database record:", deleteError);
    });
}
