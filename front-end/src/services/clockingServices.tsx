import api from "./api";
import { employeePost } from "../interfaces/employeeInterfaces";

function postClockIn(data: employeePost) {
    return api.post("/clockIn", data);
};

const clockingServices = {
    postClockIn,
};

export default clockingServices;