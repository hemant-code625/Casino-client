import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import HomePage from "./pages/HomePage";
import GridGameDesktop from "./components/casino/GridGameDesktop";
import GridGameMobile from "./components/casino/GridGameMobile";
import { useEffect, useState } from "react";

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
          <Route
            path="/casino/magic-number"
            element={isMobile ? <GridGameMobile /> : <GridGameDesktop />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
