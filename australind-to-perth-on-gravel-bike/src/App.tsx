import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import HomePage from "./pages/HomePage";
import ItineraryPage from "./pages/ItineraryPage";
import TrackPage from "./pages/TrackPage";
import LogisticsPage from "./pages/LogisticsPage";
import FamilyPage from "./pages/FamilyPage";
import EmergencyPage from "./pages/EmergencyPage";
import GuidePage from "./pages/GuidePage";
import PackingPage from "./pages/PackingPage";
import MorePage from "./pages/MorePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/logistics" element={<LogisticsPage />} />
          <Route path="/family" element={<FamilyPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/more" element={<MorePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
