
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwPBdrGbMJQsjh7ySfK3dVcPxLbNX7W8c",
  authDomain: "tem-que-funcionar.firebaseapp.com",
  projectId: "tem-que-funcionar",
  storageBucket: "tem-que-funcionar.appspot.com",
  messagingSenderId: "186437249319",
  appId: "1:186437249319:web:52e2cc9e7874947eb3a102"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Cloud Function URLs
const clockInFunctionURL = "https://us-central1-tem-que-funcionar.cloudfunctions.net/api/clockIn";
const clockOutFunctionURL = "https://us-central1-tem-que-funcionar.cloudfunctions.net/api/clockOut";
const calculateTimeFunctionURL = `https://us-central1-tem-que-funcionar.cloudfunctions.net/api/calculateTime/${employeeName}`;

// Clock In
function clockIn() {
  const employeeName = document.getElementById("clockInEmployeeName").value;
  const employeeToken = document.getElementById("clockInEmployeeToken").value;

  // Make a POST request to the Cloud Function
  fetch(clockInFunctionURL, {
      method: "POST",
      body: JSON.stringify({
          employeeName: employeeName,
          employeeToken: employeeToken,
      }),
      headers: {
          "Content-Type": "application/json",
      },
  })
  .then((response) => response.json())
  .then((data) => {
      document.getElementById("result").innerHTML = data.msg;
  })
  .catch((error) => {
      console.error("Clock In Error: ", error);
  });
}

// Clock Out
function clockOut() {
  const employeeName = document.getElementById("clockOutEmployeeName").value;
  const employeeToken = document.getElementById("clockOutEmployeeToken").value;

  // Make a POST request to the Cloud Function
  fetch(clockOutFunctionURL, {
      method: "POST",
      body: JSON.stringify({
          employeeName: employeeName,
          employeeToken: employeeToken,
      }),
      headers: {
          "Content-Type": "application/json",
      },
  })
  .then((response) => response.json())
  .then((data) => {
      document.getElementById("result").innerHTML = data.msg;
  })
  .catch((error) => {
      console.error("Clock Out Error: ", error);
  });
}

// Calculate Time Worked
function calculateTime() {
  const employeeName = document.getElementById("calculateTimeEmployeeName").value;

  // Make a GET request to the Cloud Function
  fetch(`${calculateTimeFunctionURL}/${employeeName}`)
  .then((response) => response.json())
  .then((data) => {
      const totalHours = data.totalHours;
      const totalMinutes = data.totalMinutes;
      document.getElementById("result").innerHTML = `Total Time Worked: ${totalHours} hours and ${totalMinutes} minutes`;
  })
  .catch((error) => {
      console.error("Calculate Time Error: ", error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const result = document.getElementById("result");

  const handleResult = (data) => {
    result.textContent = data.msg;
  };

  const sendRequest = async (functionName, data) => {
    try {
      const response = await fetch(`https://us-central1-tem-que-funcionar.cloudfunctions.net/api/${functionName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.status === 200) {
        const resultData = await response.json();
        handleResult(resultData);
      } else {
        handleResult({ msg: "Request failed" });
      }
    } catch (error) {
      console.error("Request failed:", error);
      handleResult({ msg: "Request failed" });
    }
  };
  

  const clockInButton = document.getElementById("clock-in-button");
  clockInButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const employeeName = document.getElementById("clockInEmployeeName").value;
    const employeeToken = document.getElementById("clockInEmployeeToken").value;

    sendRequest('clockIn', { employeeName, employeeToken });
  });

  const clockOutForm = document.getElementById("clockOutForm");
  clockOutForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const employeeName = document.getElementById("employeeNameOut").value;
    const employeeToken = document.getElementById("employeeTokenOut").value;

    sendRequest('clockOut', { employeeName, employeeToken });
  });

  const calculateTimeForm = document.getElementById("calculateTimeForm");
  calculateTimeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const employeeName = document.getElementById("employeeNameCalculate").value;

    sendRequest('calculateTime', { employeeName });
  });
});

const myButton = document.getElementById("myButton");