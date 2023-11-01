import { useEffect, useState } from 'react'
import QRCode from "react-qr-code";
import { getNameByEmail } from '../../actions/clockingActions';
import { useNavigate } from 'react-router-dom';

// @ts-ignore
const QrCodeGenerator = ({email} : {email:string}) => {
  // @ts-ignore
  const [employeeName, setEmployeeName] = useState("");
  const [qrCode, setQrCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getName(){
      try {
        const { data } = await getNameByEmail({
          data:{
            email: localStorage.getItem('email'),
          }
        });  
        localStorage.setItem('employeeName', data.result.employeeName);
        setEmployeeName(data.result.employeeName);
        
      } catch (error) {
        console.log(error);
      } finally {
        setQrCode(JSON.stringify({
          data: {
            employeeName: localStorage.getItem('employeeName'),
            email: localStorage.getItem('email')
        }}));        
      }
    };
    getName();
  }, []);

  return (

    <div className="md:w-[25%] md:text-center md:mt-10 md:p-10 w-50% bg-slate-400 rounded-lg mx-auto shadow-2xl">
        <QRCode
        size={256}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={qrCode}
        viewBox={`0 0 256 256`}
        />
    <button onClick={() => navigate("/banco-de-horas-front/checkin")} className=' px-10 py-2 mt-10 font-bold bg-pink-400 text-white rounded-md hover:bg-slate-300 hover:text-slate-800 hover:scale-105'>Voltar</button>
    </div>

  )
}

export default QrCodeGenerator