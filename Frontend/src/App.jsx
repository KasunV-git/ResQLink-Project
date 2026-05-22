import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/citizen/Dashboard";
import Report from "./pages/citizen/Report";
import Alerts from "./pages/citizen/Alerts";
import MapPage from "./pages/citizen/MapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/report" element={<Report />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;