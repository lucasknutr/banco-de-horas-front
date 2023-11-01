import { useZxing } from "react-zxing";
import { useEffect, useMemo, useState } from 'react';
import { getMonthlyTimeById, postClockIn, postClockOut } from '../../actions/clockingActions';
import { calculateTimePost, employeePost } from "../../interfaces/employeeInterfaces";
// @ts-ignore
import { Alert } from "@mui/material";

// @ts-ignore
const QrCodeReader = ({ handleOpen, handleOpenSaida, setEmployeeName, employeeName, email, setEmail, isDailyOn, isMonthlyOn, isEntradaOn, isSaidaOn }: { handleOpen: any, handleOpenSaida: any, setEmployeeName: any, employeeName: any, email: string, setEmail: any, isDailyOn: boolean, isMonthlyOn: boolean, isEntradaOn: boolean, isSaidaOn: boolean }) => {
  const [result, setResult] = useState<any>({
    data: {
      employeeName: "",
      email: ""
    }
  });

  const [lastScannedQRCode, setLastScannedQRCode] = useState<string | null>(null);

  useEffect(() => {
      const employee: employeePost = {
          data: {
            employeeName: employeeName,
            email: email,
          }

        };

      const employeeCalculateTime: calculateTimePost = {
        data: {
          employeeName: employeeName,
        }
      };

    async function handleClockIn(employee: employeePost) {
      try {
        if (result.data.employeeName && result.data.email !== lastScannedQRCode) {
          const response = await postClockIn(employee);
          console.log(response);
          setLastScannedQRCode(result.data.email);
          setEmployeeName(result.data.employeeName);
        }
      } catch (error) {
        alert(error);
      } finally {
        // TODO Adicionar modal
        handleOpen();
      }
    }

    async function handleClockOut(employee: employeePost) {
      try {
        if (result.data.employeeName && result.data.email !== lastScannedQRCode) {
          const response = await postClockOut(employee);
          console.log(response);
          setLastScannedQRCode(result.data.email);
          setEmployeeName(result.data.employeeName);
        }
      } catch (error) {
        alert(error);
      } finally {
        // TODO Adicionar modal
        handleOpenSaida();
      }
    }

    async function handleMonthlyHours(employee: calculateTimePost) {
      try {
        if (result.data.employeeName) {
          const response = await getMonthlyTimeById(employee);
          console.log(response);
          setLastScannedQRCode(result.data.email);
          setEmployeeName(result.data.employeeName);
        }
      } catch (error) {
        alert(error);
      } finally {
        // TODO Adicionar modal
        handleOpen();
      }
    }
  
    if (result.data.email && result.data.email !== lastScannedQRCode && isEntradaOn) {
      handleClockIn(employee);
    }

    else if (result.data.email && result.data.email !== lastScannedQRCode && isSaidaOn) {
      handleClockOut(employee);
    }

    else if (result.data.name && isMonthlyOn) {
      handleMonthlyHours(employeeCalculateTime);
    }


  }, [result, lastScannedQRCode]);

  const { ref } = useZxing({
    onDecodeResult(resultado) {
      setResult(JSON.parse(resultado.getText()));
    }
  });

  useMemo(() => {
    setEmployeeName(result.data.employeeName);
    setEmail(result.data.email);
  }, [result]);

  return (
    <>
      <video ref={ref} />
      <p>
        <span>Last result:</span>
        <span>{JSON.stringify(result)}</span>
      </p>
    </>
  );
}

export default QrCodeReader;