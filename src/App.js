import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import OurMission from './pages/About/OurMission';
import OverView from './pages/About/Overview';
import SeniorTeam from './pages/About/SeniorTeam';
import HedgeFund from './pages/InvestmentManagement/HedgeFund';
import ManagedAccount from './pages/InvestmentManagement/ManagedAccount';
import OurApproach from './pages/OurApproach/OurApproach';
import ContactUs from './pages/ContactUS/ContactUS';
import Publications from './pages/Publications/Publications';
import News from './pages/Publications/News';
import Visits from './pages/Publications/Visits';
import HedgeFundReports from './pages/InvestorAndResources/HedgeFundReports';
import ManagedAccountReports from './pages/InvestorAndResources/ManagedAccountReports';
import Login from './pages/Login/Login';
import Registration from './pages/Registration/Registration';
import AuthProtectedRoute from './pages/Component/AuthProtectorComponents/AuthProtectorComponents';
import Profile from "./pages/Profile/Profile";
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword/updatePassword';
import NotFound from './pages/NotFound/NotFound';
import Analytics from './Analytics';

function KeywordRedirectNotFound() {
  const location = useLocation();
  const keywords = [
    "Opportunities-Master-Fund-Monthly-Portfolio",
    "China – Portfolio Summary",
    "Redwood Peak Opportunities Master Fund",
    "Redwood Peak – China Outlook Q",
    "Redwood Peak China – Portfolio Summary ",
    "Redwood Peak Opportunities Fund Shareholders Letter",
    "Redwood Peak Opportunities Master Fund – Performance Analysis"
  ];
  let url = location.pathname + location.search;
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    //Redirect to Orignal Url
  }
  const urlLower = url.toLowerCase();
  if (keywords.some(keyword => urlLower.includes(keyword.toLowerCase()))) {
    return <Navigate to="/" replace />;
  }
  return <NotFound />;
}

function App() {

  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/our-mission" element={<OurMission />} />
        <Route path="/overview" element={<OverView />} />
        <Route path="/senior-team" element={<SeniorTeam />} />
        <Route path="/hedge-fund" element={<HedgeFund />} />
        <Route path="/managed-account" element={<ManagedAccount />} />
        <Route path="/our-approach" element={<OurApproach />} />
        <Route path="/publications" element={<AuthProtectedRoute element={<Publications />} />} />
        <Route path="/news" element={<AuthProtectedRoute element={<News />} />} />
        <Route path="/visits" element={<AuthProtectedRoute element={<Visits />} />} />
        <Route path="/hedge-fund-reports" element={<AuthProtectedRoute element={<HedgeFundReports />} />} />
        <Route path="/managed-account-reports" element={<AuthProtectedRoute element={<ManagedAccountReports />} />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registration />} />
        <Route path='/Profile' element={<Profile />} />

        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="*" element={<KeywordRedirectNotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
