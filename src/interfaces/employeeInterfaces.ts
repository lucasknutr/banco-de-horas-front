export interface employee {
    data: {
        employeeName: string,
        email: string,
    },
};

export interface employeePost extends employee {
    // TODO: add timing information
};

export interface employeeResponse extends employee {
    data: {
        checkoutDateTime: number,
        checkoutDateTimeHours: number,
        id: string,
    } & employee['data']
};