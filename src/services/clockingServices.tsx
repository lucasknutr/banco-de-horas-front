import api from "./api";
import { employeePost } from "../interfaces/employeeInterfaces";

function postClockIn(data: employeePost) {
    return api.post("/clockIn", data);
};

function postClockOut(data: any) {
    return api.post("/clockOut", data);
};

function getMonthlyTimeById(id: any) {
    return api.get("/monthlyTimeWorked", id);
};

function getWeeklyTimeById(id: any){
    return api.get("/weeklyTimeWorked", id);
};

function getDailyTimeById(id: any) {
    return api.get("/timeWorked", id);
};

function getNameByEmail(data: any) {
    return api.get("/getNameByEmail", data);
}

const clockingServices = {
    postClockIn,
    postClockOut,
    getMonthlyTimeById,
    getWeeklyTimeById,
    getDailyTimeById,
    getNameByEmail
};

export default clockingServices;