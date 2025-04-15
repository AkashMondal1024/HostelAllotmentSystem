document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementsByClassName('buttons');
  btn[0].addEventListener('click', function () {
    window.location.href = '../studentHome.html';
  });
  btn[1].addEventListener('click', function () {
    window.location.href = 'student-profile.html';
  });
  btn[2].addEventListener('click', function () {
    window.location.href = 'app-status.html';
  });
  btn[3].addEventListener('click', function () {
    window.location.href = 'room-details.html';
  });
  btn[4].addEventListener('click', function () {
    window.location.href = 'canteen.html';
  });
  // btn[4].addEventListener("click",function(){
  //   window.location.href="canteen.html";
  // });
  btn[6].addEventListener('click', function () {
    window.location.href = 'complaint.html';
  });
});

const client = new Appwrite.Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('66cfe746002e495cbc84');

const account = new Appwrite.Account(client);
const databases = new Appwrite.Databases(client);
const storage = new Appwrite.Storage(client);

const DATABASE_ID = '66e4b088002534a2ffe1';
const STUDENT_INFO = '66e4b098001d3dd600f9';
const MESS_ID = 'mess-subscription';

const userId = localStorage.getItem('userID');

if (!userId) {
  window.location.href = 'student.html';
} else {
  account
    .get()
    .then((response) => {
      document.getElementById('name').textContent = response.name;
      databases
        .getDocument(DATABASE_ID, STUDENT_INFO, userId)
        .then((doc) => {
          document.getElementById('semester').textContent =
            doc.Semester || 'N/A';
          document.getElementById('regn').textContent =
            doc.RegistrationNumber || 'N/A';
          document.getElementById('roll').textContent = doc.RollNo || 'N/A';
        })
        .catch((error) => {
          console.error('Failed to fetch student data:', error);
        });
    })
    .catch((error) => {
      console.error('Failed to fetch user details:', error);
      document.getElementById('name').textContent = 'Failed to load name.';
    });
}

function updateDateTime() {
  const datetimeDisplay = document.getElementById('datetime-display');
  const now = new Date();

  const day = now.toLocaleString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
  const time = now.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const dateParts = date.split('/');
  const monthNumber = dateParts[1];
  const year = dateParts[2];

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = monthNames[parseInt(monthNumber) - 1];

  const monthYear = monthName + ' ' + year;

  document.getElementById('month-year').textContent = monthYear;
  datetimeDisplay.innerHTML = `${day}<br>${date}<br>${time}`;
}

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();

document.getElementById('submit-btn').addEventListener('click', async () => {
  try {
    const user = await account.get();
    const studentID = user.$id;

    const doc = await databases.getDocument(
      DATABASE_ID,
      STUDENT_INFO,
      studentID
    );

    const name = doc.Name || 'N/A';
    const semester = doc.Semester || 'N/A';
    const regn = doc.RegistrationNumber || 'N/A';

    const now = new Date();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthYear = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

    const option = document.getElementById('canteenOption').value.toLowerCase();
    const subscribed = option === 'yes';
    const messUniqueID = regn + monthYear.replace(/\s+/g, '');
    await databases.createDocument(DATABASE_ID, MESS_ID, messUniqueID, {
      StudentID: studentID,
      Name: name,
      Semester: semester,
      MonthYear: monthYear,
      Subscribed: subscribed,
    });

    alert('Mess subscription data recorded successfully!');
  } catch (err) {
    console.error('Error submitting mess data:', err);
    alert('Failed to record mess data. Please try again.');
  }
});
