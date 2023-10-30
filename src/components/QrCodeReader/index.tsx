import { useZxing } from "react-zxing";
import { useEffect, useMemo, useState } from 'react';
import { postClockIn } from '../../actions/clockingActions';
import { employeePost } from "../../interfaces/employeeInterfaces";
import { Alert } from "@mui/material";

const QrCodeReader = ({ checkingOption, handleOpen, setEmployeeName, employeeName, email, setEmail }: { checkingOption: string, handleOpen: any, setEmployeeName: any, employeeName: any, email: string, setEmail: any }) => {
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

    async function handleClockIn(employee: employeePost) {
      try {
        if (result.data.employeeToken && result.data.employeeToken !== lastScannedQRCode) {
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
  
    if (result.data.email && result.data.email !== lastScannedQRCode) {
      handleClockIn(employee);
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