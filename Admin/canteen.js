const client = new Appwrite.Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("66cfe746002e495cbc84");

const databases = new Appwrite.Databases(client);
const DATABASE_ID = "66e4b088002534a2ffe1";
const MESS_ID = "mess-subscription";
const STUDENT_INFO = "66e4b098001d3dd600f9"; // assuming this is the Student Info collection

document.getElementById("submitQuery").addEventListener("click", async () => {
  const monthYearInput = document.getElementById("monthYearInput").value.trim();
  const selectedOption = document.querySelector('input[name="status"]:checked');

  if (!monthYearInput || !selectedOption) {
    alert("Please enter Month Year and select status.");
    return;
  }

  const isSubscribed = selectedOption.value === "subscribed";

  try {
    const response = await databases.listDocuments(DATABASE_ID, MESS_ID, [
      Appwrite.Query.equal("MonthYear", monthYearInput),
      Appwrite.Query.equal("Subscribed", isSubscribed),
    ]);

    const resultsContainer = document.querySelector(".studentResults");
    resultsContainer.innerHTML = ""; // clear previous results

    if (response.documents.length === 0) {
      resultsContainer.innerHTML = "<p>No students found for the selected criteria.</p>";
      return;
    }

    const table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "text-center", "student-entry");
    table.innerHTML = `
      <thead class="table-dark">
        <tr>
          <th>Name</th>
          <th>Semester</th>
          <th>Month & Year</th>
          <th>Subscribed</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    for (const doc of response.documents) {
      try {
        const studentDoc = await databases.getDocument(DATABASE_ID, STUDENT_INFO, doc.StudentID);
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${studentDoc.Name}</td>
          <td>${studentDoc.Semester}</td>
          <td>${doc.MonthYear}</td>
          <td>${doc.Subscribed ? "Yes" : "No"}</td>
        `;
        tbody.appendChild(row);
      } catch (err) {
        console.error(`Failed to fetch student info for ID: ${doc.StudentID}`, err);
      }
    }

    resultsContainer.appendChild(table);
  } catch (error) {
    console.error("Error fetching mess subscription data:", error);
    alert("An error occurred while fetching data.");
  }
});
