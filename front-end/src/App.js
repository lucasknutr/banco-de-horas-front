import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
// import { userInfo } from 'os';

function App() {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeToken, setEmployeeToken] = useState("");
  let responseData;
  const clockInFunctionURL = "https://us-central1-tem-que-funcionar.cloudfunctions.net/api/clockIn";

  useEffect(() => {
    // const employeeName = document.getElementById("clockInEmployeeName").value;
          // const employeeToken = document.getElementById("clockInEmployeeToken").value;
        
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
        .then((data) => responseData = data + "")
        .catch((error) => {
            console.error("Clock In Error:", error);
        }); 
  }, []);
  
  
  function handleSubmit(){
          return responseData;
        }

  return (
    <div>
        <h1>Time Tracker</h1>
        {/* <!-- Firebase Configuration Scripts --> */}
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-functions.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-remote-config.js"></script>
        <script src="https://www.gstatic.com/firebasejs/10.5.0/firebase-performance.js"></script>
{/* 
        <!-- Firebase Configuration -->
        <!-- Clock In Form --> */}
        <h2>Clock In</h2>
          <input type="text" id="clockInEmployeeName" placeholder="Employee Name" onChange={e => setEmployeeName(e.target.value)} />
          <input type="text" id="clockInEmployeeToken" placeholder="Employee Token" onChange={e => setEmployeeToken(e.target.value)}/>
          <button onclick={() => handleSubmit()} id="clock-in-button">Clock In</button>


        {/* <!-- Clock Out Form --> */}
        <h2>Clock Out</h2>
        <input type="text" id="clockOutEmployeeName" placeholder="Employee Name" />
        <input type="text" id="clockOutEmployeeToken" placeholder="Employee Token" />
        <button onclick="clockOut()">Clock Out</button>

        {/* <!-- Calculate Time Worked Form --> */}
        <h2>Calculate Time Worked</h2>
        <input type="text" id="calculateTimeEmployeeName" placeholder="Employee Name" />
        <button onclick="calculateTime()">Calculate Time</button>
{/* 
        <!-- Display Results --> */}
        <div id="result"></div>
        {responseData}
        <script src="app.js"></script>
    
        </div>
  );
}

export default App;
