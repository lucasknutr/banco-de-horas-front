import { useState } from 'react';
import QrCodeReader from '../../components/QrCodeReader';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
// @ts-ignore
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
// @ts-ignore
import { Navigate, useNavigate } from 'react-router-dom';

const CheckIn = ({ email, setEmail }: { email: string, setEmail: any }) => {
  const [employeeName, setEmployeeName] = useState<string>("");
  const [checkingOption, setCheckingOption] = useState<boolean>(false);
  const [isEntradaOn, setIsEntradaOn] = useState<boolean>(true);
  // @ts-ignore
  const [isSaidaOn, setIsSaidaOn] = useState<boolean>(true);
  // @ts-ignore
  const [isDailyOn, setIsDailyOn] = useState<boolean>(true);
  // @ts-ignore
  const [isMonthlyOn, setIsMonthlyOn] = useState<boolean>(true);
  // @ts-ignore
  const [checkingBox, setCheckingBox] = useState<boolean>(false);
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
  const [openSaida, setOpenSaida] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenSaida = () => setOpenSaida(true);
  const handleCloseSaida = () => setOpenSaida(false);
  const navigate = useNavigate();

  const handleSwitchChange = () => {
    setIsEntradaOn(!isEntradaOn);
  };

//   useEffect(() => {
//     if (checkingOption === true) {
//       setCheckingOption("checkIn");
//     } else {
//       setCheckingOption("checkOut");
//     }
//   }, [isEntradaOn]);

  return (
    <>
    <div className="w-[100svw] h-[100svh] flex justify-center items-center text-slate-200">
      <div className="w-[15%] h-[53%] flex flex-col justify-center gap-3 px-7 shadow-2xl rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.8)', border: '1px' }}>
        {checkingOption === false ? <>
        <p className='flex justify-between'>
          Entrada <Switch {...label} onChange={handleSwitchChange} checked={isEntradaOn} />
        </p>
        <p className='flex justify-between'>
          Saída <Switch {...label} onChange={handleSwitchChange} checked={!isEntradaOn} />
        </p>
        </> :
        <>
                <p className='flex justify-between'>
                Entrada <Switch {...label} onChange={handleSwitchChange} checked={isEntradaOn} disabled />
              </p>
              <p className='flex justify-between'>
                Saída <Switch {...label} onChange={handleSwitchChange} checked={!isEntradaOn} disabled />
              </p>
        </>

        }
        <p className='text-center font-extrabold'>
          Verificação (horas):
        </p>
        <p className='flex justify-between'>
          Diário <Switch {...label} />
        </p>
        <p className='flex justify-between'>
          Mensal <Switch {...label} />
        </p>
        <p className='flex justify-start gap-5'>
            <input type="checkbox" className='w-[8%]' onChange={() =>{
                checkingOption ?
                setCheckingOption(false) :
                setCheckingOption(true)
            }}/> Apenas verificação
        </p>
        <button className='p-2 border-2 rounded-md hover:bg-pink-400 hover:scale-105 transition-all duration-200'
          onClick={() => navigate("/banco-de-horas-front/qrcode")}>Gerar QR Code</button>
      </div>
        <div className='rounded-xl shadow-2xl'>
          <QrCodeReader handleOpen={handleOpen} handleOpenSaida={handleOpenSaida} setEmployeeName={setEmployeeName} employeeName={employeeName} email={email} setEmail={setEmail} isMonthlyOn={isMonthlyOn} isDailyOn={isDailyOn} isEntradaOn={isEntradaOn} isSaidaOn={isSaidaOn} />
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
          <Modal
            open={openSaida}
            onClose={handleCloseSaida}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                <CheckCircleSharpIcon />
                Saída realizada com sucesso!
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Bom descanso, {employeeName}!
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  )
}

export default CheckIn
