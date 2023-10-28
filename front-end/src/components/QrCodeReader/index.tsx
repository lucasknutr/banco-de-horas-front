import { useZxing } from "react-zxing";
import { useMemo, useState } from 'react';
import { postClockIn } from '../../actions/clockingActions';
import { employeePost } from "../../interfaces/employeeInterfaces";

const QrCodeReader = ({ checkingOption }: { checkingOption: string }) => {
  const [employeeName, setEmployeeName] = useState<string>("");
  const [employeeToken, setEmployeeToken] = useState<string>("");
  const [result, setResult] = useState<any>({
    data: 
    {
      employeeName: "", 
      employeeToken: ""
    }
  });

  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
        try {
          postClockIn(JSON.parse(result.getText()));         
        } catch (error) {
          console.log("Erro ao realizar check-in. Tente novamente.");
        } finally {
          console.log(result);
          alert(`Check-in realizado com sucesso! Bem-vindo(a), ${result}!`);
        }
    }
      });

  useMemo(() => {
    setEmployeeName(result.data.employeeName);
    setEmployeeToken(result.data.employeeToken);
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