import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Home from "./pages/Home";
import Map from "./pages/Map";

function AppContent() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
      </Routes>
    </>
  );
}
export default function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}
