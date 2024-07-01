import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import DashboardPage from "./pages/DashboardPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/Faq" element={<Faq/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />

        <Route path="/create-campaign" element={<CreateCampaignPage/>} />
        <Route path="/campaign-details/:id" element={<CampaignDetailsPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
    </Router>
  );
}

export default App;
