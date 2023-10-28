import { useState } from 'react'
import QrCodeReader from '../../components/QrCodeReader';
import Switch from '@mui/material/Switch';

const CheckIn = () => {
    const [employeeName, setEmployeeName] = useState<string>("");
    const [employeeToken, setEmployeeToken] = useState<string>("");
    const [checkingOption, setCheckingOption] = useState<string>("checkIn");
    const label = { inputProps: { 'aria-label': 'Switch demo' } };


  return (
    <>

            <div className="w-[100svw] h-[100svh] flex justify-center items-center text-slate-200">
                <div className="w-[15%] h-[53%] flex flex-col justify-center gap-3 px-7 shadow-2xl rounded-xl" style={{background: 'rgba(0, 0, 0, 0.8)', border: '1px'}}>
                    <p className='flex justify-between'>
                        Entrada <Switch {...label} defaultChecked />     
                    </p>              
                    <p className='flex justify-between'>
                        Saída <Switch {...label} />     
                    </p>
                    <p className='text-center font-extrabold'>
                                Verificação (horas):              
                    </p>
                    <p className='flex justify-between'>
                        Diário <Switch {...label} />     
                    </p>              
                    <p className='flex justify-between'>
                        Mensal <Switch {...label} />     
                    </p>              
                </div>      
                <div className='rounded-xl shadow-2xl'>
                    <QrCodeReader checkingOption={checkingOption} />
                </div>
            </div>
 
    </>
  )
}

export default CheckIn