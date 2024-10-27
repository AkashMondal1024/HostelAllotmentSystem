const client = new Appwrite.Client();
const databases = new Appwrite.Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Your Appwrite endpoint
  .setProject("66cfe746002e495cbc84"); // Your project ID

document
  .getElementById("searchButton")
  .addEventListener("click", async function () {
    const registrationNumber = parseInt(
      document.getElementById("searchInput").value
    ); // Convert to integer
    console.log(
      "Searching for student with registration number:",
      registrationNumber
    );

    try {
      const response = await databases.listDocuments(
        "66e4b088002534a2ffe1",
        "66e4b098001d3dd600f9",
        [Appwrite.Query.equal("RegistrationNumber", registrationNumber)] // Use integer here
      );

      if (response.documents.length > 0) {
        const student = response.documents[0];
        console.log("Student found:", student);
        document.getElementById("studentDetails").style.display = "block";
        document.getElementById("studentName").innerText = student.Name;
        document.getElementById("studentEmail").innerText = student.Email;
        document.getElementById("studentPhone").innerText = student.Phone;
        document.getElementById("studentFatherName").innerText =
          student.FatherName;
        document.getElementById("studentMotherName").innerText =
          student.MotherName;
        document.getElementById("degree").innerText = student.Degree;
        document.getElementById("stream").innerText = student.Stream;
        document.getElementById("semester").innerText = student.Semester;
        document.getElementById("dob").innerText = student.DOB;
        document.getElementById("regn").innerText = student.RegistrationNumber;
        document.getElementById("roll").innerText = student.RollNo;
        document.getElementById("degree").innerText = student.Degree;
      } else {
        console.log("No student found with this registration number.");
        alert("No student found with this registration number.");
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
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
