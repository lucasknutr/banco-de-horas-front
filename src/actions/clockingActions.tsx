import clockingServices from "../services/clockingServices"
import { employeePost } from "../interfaces/employeeInterfaces";

export async function postClockIn(data: employeePost) {
    const response = await clockingServices.postClockIn(data);
    return response;
}

export async function postClockOut(id: any) {
    const response = await clockingServices.postClockOut(id);
    return response;
}

export async function getMonthlyTimeById(id: string) {
    const response = await clockingServices.getMonthlyTimeById(id);
    return response;
}

export async function getWeeklyTimeById(id: string) {
    const response = await clockingServices.getWeeklyTimeById(id);
    return response;
}

export async function getDailyTimeById(id: string) {
    const response = await clockingServices.getDailyTimeById(id);
    return response;
}

export async function getNameByEmail(data: any) {
    const response = await clockingServices.getNameByEmail(data);
    return response;
}
