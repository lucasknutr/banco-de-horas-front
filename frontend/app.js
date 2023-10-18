async function generateQR() {
    const name = document.getElementById('name').value;
    const accessId = document.getElementById('accessId').value;
  
    const response = await fetch('/generateQR', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, accessId }),
    });
  
    const data = await response.json();
  
    document.getElementById('qrCodeImage').src = data.qrCode;
  }
  