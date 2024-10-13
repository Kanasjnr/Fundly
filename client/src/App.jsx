import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AboutUs from "./pages/AboutUs";
import AccountConfirmation from "./components/auth/AccountConfirmation";
import LinkExpired from "./components/auth/LinkExpired";
import ActivatePage from "./components/auth/ActivatePage";
import GoogleAuth from "./components/auth/GoogleAuth";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import DashboardPage from "./pages/DashboardPage";
import CreateCampaignPage from "./pages/CreateCampaignPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import RequestVerificationPage from "./pages/RequestVerificationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
     <Route path="/auth/google-verify" element={<GoogleAuth />} />
				<Route path="/confirm-email" element={<AccountConfirmation/>} />
				<Route path="/link-expired/" element={<LinkExpired />} />
				<Route path="/verify-access/:token" element={<ActivatePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/Faq" element={<Faq/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />

        <Route path="/create-campaign" element={<CreateCampaignPage/>} />
        <Route path="/campaign-details/:id" element={<CampaignDetailsPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/verify" element={<RequestVerificationPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
