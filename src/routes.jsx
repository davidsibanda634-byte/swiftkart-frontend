import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Marketplace from './pages/Marketplace'
import Services from './pages/Services'
import Jobs from './pages/Jobs'
import Events from './pages/Events'
import CreateListing from './pages/CreateListing'
import Login from './pages/Login'
import Register from './pages/Register'
import MyListings from './pages/MyListings'
import ListingDetail from './pages/ListingDetail'
import Search from './pages/Search'
import EditListing from './pages/EditListing'
import UserProfile from './pages/UserProfile'
import Saved from './pages/Saved'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminReports from './pages/AdminReports'
import AdminListings from './pages/AdminListings'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminActivity from './pages/AdminActivity'
import JobDetail from './pages/JobDetail'
import NotFound from './pages/NotFound'
import ProfileMenu from './pages/ProfileMenu'
import Accommodation from './pages/Accommodation'
import AccommodationDetail from './pages/AccommodationDetail'
import EventDetail from './pages/EventDetail'
import ServiceDetail from './pages/ServiceDetail'
import TermsOfUse from './pages/legal/TermsOfUse'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import PrivacyCentre from './pages/legal/PrivacyCentre'
import CookiePolicy from './pages/legal/CookiePolicy'
import CommunityGuidelines from './pages/legal/CommunityGuidelines'
import AboutUs from './pages/AboutUs'
import HowToBuy from './pages/help/HowToBuy'
import HowToSell from './pages/help/HowToSell'
import StayingSafe from './pages/help/StayingSafe'
import ContactSupport from './pages/help/ContactSupport'
import ReportBug from './pages/help/ReportBug'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/services" element={<Services />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/create" element={<CreateListing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/listings/edit/:id" element={<EditListing />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/listings" element={<AdminListings />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/activity" element={<AdminActivity />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/accommodation/:id" element={<AccommodationDetail />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route path="/profile-menu" element={<ProfileMenu />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/legal/terms" element={<TermsOfUse />} />
        <Route path="/legal/privacy" element={<PrivacyPolicy />} />
        <Route path="/legal/privacy-centre" element={<PrivacyCentre />} />
        <Route path="/legal/cookies" element={<CookiePolicy />} />
        <Route path="/legal/guidelines" element={<CommunityGuidelines />} />
        <Route path="/help/how-to-buy" element={<HowToBuy />} />
        <Route path="/help/how-to-sell" element={<HowToSell />} />
        <Route path="/help/safety" element={<StayingSafe />} />
        <Route path="/help/contact" element={<ContactSupport />} />
        <Route path="/help/bug" element={<ReportBug />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}