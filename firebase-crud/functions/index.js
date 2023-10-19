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
app.get("/calculateTime/:employeeName", async (req, res) => {
    try {
      const employeeName = req.params.employeeName;
  
      // Query timeWorked collection for the specified employee
      const timeWorkedEntries = await db.collection("timeWorked")
        .where("employeeName", "==", employeeName)
        .get();
  
      // Calculate total hours and minutes worked
      let totalHours = 0;
      let totalMinutes = 0;
  
      timeWorkedEntries.forEach((entry) => {
        const hoursWorked = entry.data().hoursWorked;
        totalHours += Math.floor(hoursWorked);
        totalMinutes += (hoursWorked % 1) * 60; // Convert decimal part to minutes
      });
  
      // Adjust total minutes to hours if necessary
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    // Round totalMinutes to two decimal places
      totalMinutes = totalMinutes.toFixed(2);
      return res.status(200).json({
        status: "Success",
        msg: "Time calculated successfully",
        totalHours: totalHours,
        totalMinutes: totalMinutes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: "Failed", msg: error });
    }
  });
  
exports.calculateWeeklyTimeWorked = functions.https.onRequest(async (req, res) => {
    try {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
  
      // Query timeWorked collection for the last week's entries
      const weeklyEntries = await db.collection('timeWorked')
        .where('date', '>=', lastWeek.toDateString())
        .where('date', '<=', today.toDateString())
        .get();
  
      // Calculate total hours worked for the week
      let totalHoursWorked = 0;
      weeklyEntries.forEach(entry => {
        totalHoursWorked += entry.data().hoursWorked;
      });
  
      // Store the result in a new Firestore collection (weeklyTimeWorked)
      await db.collection('weeklyTimeWorked').add({
        startDate: lastWeek.toDateString(),
        endDate: today.toDateString(),
        totalHoursWorked: totalHoursWorked,
      });
  
      return res.status(200).send({ status: 'Success', msg: 'Weekly time worked calculated and stored' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: 'Failed', msg: error });
    }
  });


  exports.calculateMonthlyTimeWorked = functions.https.onRequest(async (req, res) => {
    try {
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
  
      // Query timeWorked collection for the last month's entries
      const monthlyEntries = await db.collection('timeWorked')
        .where('date', '>=', lastMonth.toDateString())
        .where('date', '<=', today.toDateString())
        .get();
  
      // Calculate total hours worked for the month
      let totalHoursWorked = 0;
      monthlyEntries.forEach(entry => {
        totalHoursWorked += entry.data().hoursWorked;
      });
  
      // Store the result in a new Firestore collection (monthlyTimeWorked)
      await db.collection('monthlyTimeWorked').add({
        startDate: lastMonth.toDateString(),
        endDate: today.toDateString(),
        totalHoursWorked: totalHoursWorked,
      });
  
      return res.status(200).send({ status: 'Success', msg: 'Monthly time worked calculated and stored' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: 'Failed', msg: error });
    }
  });

exports.api = functions.https.onRequest(app);
