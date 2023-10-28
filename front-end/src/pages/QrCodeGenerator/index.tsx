import React from 'react'
import QRCode from "react-qr-code";

const QrCodeGenerator = () => {
  return (
    <div>
    <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={JSON.stringify({
        data: {
            employeeName: "Lucas Claudino Canuto",
            employeeToken: "123456"
        }
    })}
    viewBox={`0 0 256 256`}
  />
    </div>
  )
}

export default QrCodeGenerator