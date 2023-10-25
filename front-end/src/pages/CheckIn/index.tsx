import React, { useEffect, useState } from 'react'
import Logo from '../../components/Logo';

const CheckIn = () => {
    const [employeeName, setEmployeeName] = useState("");
    const [employeeToken, setEmployeeToken] = useState("");
    const [result, setResult] = useState("");

    const handleSubmit = () => {
        fetch("https://us-central1-tem-que-funcionar.cloudfunctions.net/clockIn", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: {
                    employeeName: employeeName,
                    employeeToken: employeeToken
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            setEmployeeName("");
            setEmployeeToken("");
        })
    }


  return (
    <>

            <div className="w-[100svw] h-[100svh] flex flex-col justify-center items-center">
                <p className="">
                    EmployeeName:
                    <input type="text" onChange={e => setEmployeeName(e.target.value)} />
                </p>
                <p className="">
                    EmployeeToken:
                    <input type="text" onChange={e => setEmployeeToken(e.target.value)} />
                </p>
                <button onClick={() => handleSubmit()}>Submit</button>
                <p>
                    {result}
                </p>
            </div>
 
    </>
  )
}

export default CheckIn