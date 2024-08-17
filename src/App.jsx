import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
// import GridGameDesktop from "./components/casino/desktop/GridGameDesktop";
// import GridGameMobile from "./components/casino/mobile/GridGameMobile";
import { useEffect, useState } from "react";
import MineGameDesktop from "./components/casino/desktop/MineGameDesktop";
import MineGameMobile from "./components/casino/mobile/MineGameMobile";
import PaymentPage from "./pages/PaymentPage";

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
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route
            path="/casino/magic-number"
            element={isMobile ? <GridGameMobile /> : <GridGameDesktop />}
          /> */}
          <Route
            path="/casino/mines"
            element={isMobile ? <MineGameMobile /> : <MineGameDesktop />}
          />
          <Route path="/wallet" element={<PaymentPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
