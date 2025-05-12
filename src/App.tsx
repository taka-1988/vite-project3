// App.tsx
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Nav from "./components/Nav";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import QRScanner from "./components/QRScanner";

function App() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    console.log("モーダルを閉じます");
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleClose}>
              &times;
            </span>
            <h2>QRコードを読み取ってください</h2>
            {/* モーダルが開いている時のみQRScannerをレンダリング */}
            <QRScanner />
            <img src="/src/assets/qr.png" alt="QR Code" />
          </div>
        </div>
      )}
      <div className="app">
        <Nav />
        <div className="topmenu">
          <Menu setIsOpen={setIsOpen} />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
