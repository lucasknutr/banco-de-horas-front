const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../key.json"); // Download from Firebase Console
const functions = require("firebase-functions");
const bodyParser = require("body-parser");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());
/**
 * Calculate hours worked between check-in and check-out times.
 * @param {number} checkInTime - The timestamp of check-in.
 * @param {number} checkOutTime - The timestamp of check-out.
 * @return {number} - The calculated hours worked.
 */
function calculateHoursWorked(checkInTime, checkOutTime) {
  const checkIn = new Date(checkInTime);
  const checkOut = new Date(checkOutTime);
  const hoursWorked = (checkOut - checkIn) / 3600000;
  return hoursWorked;
}

// Clock In endpoint
app.post("/clockIn", async (req, res) => {
  try {
    const userCheckInRef = db.collection("checkIn").doc();
    const userCheckInId = userCheckInRef.id;

    await userCheckInRef.set({
      id: userCheckInId,
      employeeName: req.body.employeeName,
      employeeToken: req.body.employeeToken,
      checkInDateTime: Date.now(),
    });

    return res.status(200).send({status: "Success",
      msg: "Clock In Data Saved"});
  } catch (error) {
    console.log(error);
    res.status(500).send({status: "Failed", msg: error});
  }
});

// Clock Out endpoint
app.post("/clockOut", async (req, res) => {
  try {
    const userCheckOutRef = db.collection("checkOut").doc();
    const userCheckOutId = userCheckOutRef.id;

    await userCheckOutRef.set({
      id: userCheckOutId,
      employeeName: req.body.employeeName,
      employeeToken: req.body.employeeToken,
      checkOutDateTime: Date.now(),
    });

    // Calculate daily hours worked
    const checkInSnap = await db.collection("checkIn")
        .where("employeeName", "==", req.body.employeeName)
        .orderBy("checkInDateTime", "desc")
        .limit(1)
        .get();

    if (!checkInSnap.empty) {
      const checkInTime = checkInSnap.docs[0].data().checkInDateTime;
      const checkOutTime = Date.now();
      const hoursWorked = calculateHoursWorked(checkInTime, checkOutTime);

      // Store the calculated hours in the "timeWorked" collection
      await db.collection("timeWorked").add({
        date: new Date(checkOutTime).toDateString(),
        employeeName: req.body.employeeName,
        hoursWorked: hoursWorked,
      });
    }

    return res.status(200).send({status: "Success",
      msg: "Clock Out Data Saved"});
  } catch (error) {
    console.log(error);
    res.status(500).send({status: "Failed", msg: error});
  }
});

exports.api = functions.https.onRequest(app);
