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
      </Route>
    </Routes>
  )
}