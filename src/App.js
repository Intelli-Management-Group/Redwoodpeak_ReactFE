import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import ChangePassword from "./pages/Component/ChangePassword/ChangePassword";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import ProfileView from "./pages/Profile/ProfileView";

function App() {
  return (
    <BrowserRouter>
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
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Registration/>}/>
        <Route path='/Profile' element={<Profile/>}/>
        <Route path='/ChangePassword' element={<ChangePassword/>}/>
        <Route path='/ProfileEdit' element={<ProfileEdit/>}/>
        <Route path='/ProfileView' element={<ProfileView/>}/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
