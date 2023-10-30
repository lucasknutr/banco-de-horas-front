import { useState } from 'react'
import QrCodeReader from '../../components/QrCodeReader';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import { Navigate, useNavigate } from 'react-router-dom';

const CheckIn = ({email, setEmail}:{email:string, setEmail: any}) => {
    const [employeeName, setEmployeeName] = useState<string>("");
    const [checkingOption, setCheckingOption] = useState<string>("checkIn");
    const [checked, setChecked] = useState<boolean>(false);
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
      const [open, setOpen] = useState(false);
      const handleOpen = () => setOpen(true);
      const handleClose = () => setOpen(false);
      const navigate = useNavigate();


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
                    <button className='p-2 border-2 rounded-md hover:bg-pink-400 hover:scale-105 transition-all duration-200'
                    onClick={() => navigate("/qrcode")}>Gerar QR Code</button>              
                </div>      
                <div className='rounded-xl shadow-2xl'>
                    <QrCodeReader handleOpen={handleOpen} checkingOption={checkingOption} setEmployeeName={setEmployeeName} employeeName={employeeName} email={email} setEmail={setEmail}/>
                </div>
                <div>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            <CheckCircleSharpIcon />
                            Entrada realizada com sucesso!
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Seja bem-vinda(o), {employeeName}!
                        </Typography>
                        </Box>
                    </Modal>
                </div>
            </div>
 
    </>
  )
}

export default CheckIn