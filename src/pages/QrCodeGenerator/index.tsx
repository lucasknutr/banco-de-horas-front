import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code";
import { getNameByEmail } from '../../actions/clockingActions';

const QrCodeGenerator = ({email} : {email:string}) => {
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    async function getName(){
      try {
        const { data } = await getNameByEmail({
          data:{
            email: email,
          }
        });  
        setEmployeeName(JSON.stringify(data.result.employeeName));        
      } catch (error) {
        console.log(error);
      }
    };
    getName();
  }, [employeeName]);

  return (

    <div className="md:w-[25%] md:text-center md:mt-10 md:p-10 bg-slate-400 rounded-lg mx-auto">
        <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={JSON.stringify({
          data: {
            email: email,
            employeeName: employeeName
          }
        })}
        viewBox={`0 0 256 256`}
        />
    <button className=' px-10 py-2 mt-10 font-bold bg-pink-400 text-white rounded-md hover:bg-slate-300 hover:text-slate-800 hover:scale-105'>Voltar</button>
    </div>

  )
}

export default QrCodeGenerator