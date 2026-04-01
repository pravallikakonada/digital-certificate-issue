import { QRCodeCanvas } from "qrcode.react";

const CertificateQRCode = ({ certificateId }) => {
  const verifyUrl = `http:// 10.190.122.150:5173/verify?id=${certificateId}`;

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <QRCodeCanvas value={verifyUrl} size={120} />
      <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
        Scan to verify certificate
      </p>
    </div>
  );
};

export default CertificateQRCode;