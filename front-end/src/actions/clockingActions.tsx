import clockingServices from "../services/clockingServices"
import { employeePost } from "../interfaces/employeeInterfaces";

export async function postClockIn(data: employeePost) {
    const response = await clockingServices.postClockIn(data);
    return response;
}