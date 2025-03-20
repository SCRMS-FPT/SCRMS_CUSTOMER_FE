import React, { useState } from "react";

const PaymentButton = ({ amount, account, bank, description }) => {
    const qrUrl = `https://qr.sepay.vn/img?acc=${account}&bank=${bank}&amount=${amount}&des=${encodeURIComponent(description)}`;

    return (
        <div>
            <h3>Quét QR để thanh toán</h3>
            <img src={qrUrl} alt="QR Code Thanh Toán" />
        </div>
    );
};

export default PaymentButton;
