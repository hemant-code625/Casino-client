import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";
import MineGameDesktop from "./components/casino/desktop/MineGameDesktop";
import MineGameMobile from "./components/casino/mobile/MineGameMobile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login";
import Register from "./components/Register";
import WalletDetails from "./components/AddBankDetails";
import Protected from "./components/Protected";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bank-details" element={<WalletDetails />} />
          <Route
            path="/casino/mines"
            element={
              <Protected>
                {isMobile ? <MineGameMobile /> : <MineGameDesktop />}
              </Protected>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
