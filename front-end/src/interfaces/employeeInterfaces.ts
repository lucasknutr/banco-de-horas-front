export interface employee {
    data: {
        employeeName: string,
        employeeToken: string,
    },
};

export interface employeePost extends employee {
    // TODO: add timing information
};