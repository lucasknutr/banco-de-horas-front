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
 * @return {string} - The calculated hours and minutes worked in the format "HH:mm".
 */
function calculateHoursWorked(checkInTime, checkOutTime) {
  const checkIn = new Date(checkInTime);
  const checkOut = new Date(checkOutTime);

  // Calculate the difference in milliseconds
  const timeDifference = checkOut - checkIn;

  // Calculate hours and minutes
  const hours = Math.floor(timeDifference / 3600000);
  const minutes = Math.floor((timeDifference % 3600000) / 60000);

  // Format the result as "HH:mm"
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${formattedHours}:${formattedMinutes}`;
}

// Clock In endpoint
app.post("/clockIn", async (req, res) => {
  try {
    const userCheckInRef = db.collection("checkIn").doc();
    const userCheckInId = userCheckInRef.id;
    const date = new Date();
    const dateTimeHours = () => {
      let hours = date.getHours() + "";
      let minutes = date.getMinutes() + "";
      if(minutes.length < 2) {
        minutes = "0" + minutes;
      } else if (hours.length < 2) {
        hours = "0" + hours;
      }
      return hours + ":" + minutes;
    };

    await userCheckInRef.set({
      id: userCheckInId,
      employeeName: req.body.employeeName,
      employeeToken: req.body.employeeToken,
      checkInDateTime: Date.now(),
      checkInDateTimeHours: dateTimeHours()
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
    const date = new Date();
    const dateTimeHours = () => {
      let hours = date.getHours() + "";
      let minutes = date.getMinutes() + "";
      if(minutes.length < 2) {
        minutes = "0" + minutes;
      } else if (hours.length < 2) {
        hours = "0" + hours;
      }
      return hours + ":" + minutes;
    };
    await userCheckOutRef.set({
      id: userCheckOutId,
      employeeName: req.body.employeeName,
      employeeToken: req.body.employeeToken,
      checkOutDateTime: Date.now(),
      checkInDateTimeHours: dateTimeHours()
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
      const [hours, minutes] = hoursWorked.split(':');
      totalHours += parseInt(hours, 10);
      totalMinutes += parseInt(minutes, 10);
    });

    // Adjust total minutes to hours if necessary
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    // Round totalMinutes to the nearest whole number
    totalMinutes = Math.round(totalMinutes);

    return res.status(200).json({
      status: "Success",
      msg: "Time calculated successfully",
      totalHours: totalHours,
      totalMinutes: totalMinutes,
    });
  } catch (error) {
    console.error("Error calculating time:", error);
    return res.status(500).json({ status: "Failed", msg: "Error calculating time" });
  }
});

exports.calculateWeeklyTimeWorked = functions.https.onRequest(async (req, res) => {
  try {
    // Fetch all employee names from the checkIn or checkOut collection, adjust accordingly
    const checkInSnapshot = await db.collection('checkIn').get();
    const checkOutSnapshot = await db.collection('checkOut').get();

    const checkInEmployees = checkInSnapshot.docs.map(doc => doc.data().employeeName);
    const checkOutEmployees = checkOutSnapshot.docs.map(doc => doc.data().employeeName);

    // Combine the employee names from both collections to get a unique list
    const allEmployees = [...new Set([...checkInEmployees, ...checkOutEmployees])];

    for (const employeeName of allEmployees) {
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);

      // Query timeWorked collection for the last week's entries for the current employee
      const weeklyEntries = await db.collection('timeWorked')
        .where('employeeName', '==', employeeName)
        .where('date', '>=', lastWeek.toDateString())
        .where('date', '<=', today.toDateString())
        .get();

      // Calculate total hours worked for the week for the current employee
      let totalMinutesWorked = 0;

      weeklyEntries.forEach(entry => {
        const hoursWorked = entry.data().hoursWorked;
        const [hours, minutes] = hoursWorked.split(':');
        totalMinutesWorked += parseFloat(hours) * 60 + parseFloat(minutes);
      });

      // Calculate total hours and remaining minutes for the current employee
      const totalHours = Math.floor(totalMinutesWorked / 60);
      const remainingMinutes = totalMinutesWorked % 60;

      // Format the result as "HH:mm" for the current employee
      const formattedHours = totalHours < 10 ? `0${totalHours}` : `${totalHours}`;
      const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
      const formattedTotalHoursWorked = `${formattedHours}:${formattedMinutes}`;

      // Store the result in a new Firestore collection (weeklyTimeWorked) for the current employee
      await db.collection('weeklyTimeWorked').add({
        employeeName: employeeName,
        startDate: lastWeek.toDateString(),
        endDate: today.toDateString(),
        totalHoursWorked: formattedTotalHoursWorked,
      });
    }

    return res.status(200).send({ status: 'Success', msg: 'Weekly time worked calculated and stored for all employees' });
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
        const hoursWorked = entry.data().hoursWorked;
        const [hours, minutes] = hoursWorked.split(':');
        totalHoursWorked += parseFloat(hours) + parseFloat(minutes) / 60;
      });
  
      // Store the result in a new Firestore collection (monthlyTimeWorked)
      await db.collection('monthlyTimeWorked').add({
        startDate: lastMonth.toDateString(),
        endDate: today.toDateString(),
        totalHoursWorked: totalHoursWorked.toFixed(2),
      });
  
      return res.status(200).send({ status: 'Success', msg: 'Monthly time worked calculated and stored' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ status: 'Failed', msg: error });
    }
  });  
exports.api = functions.https.onRequest(app);
