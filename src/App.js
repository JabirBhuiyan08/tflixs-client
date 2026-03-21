import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

import { AuthProvider }    from './context/AuthContext';
import { AdsenseProvider } from './context/AdsenseContext';
import { LocaleProvider }  from './context/LocaleContext';

import Header           from './components/layout/Header';
import Footer           from './components/layout/Footer';
// import AIChatWidget     from './components/layout/AIChatWidget';
import NewsletterSignup from './components/layout/NewsletterSignup';
import ScrollToTop      from './components/layout/ScrollToTop';
import GATracker        from './components/layout/GATracker';

import Home         from './pages/Home';
import Calculator   from './pages/Calculator';
import BlogList     from './pages/BlogList';
import BlogPost     from './pages/BlogPost';
import Contact      from './pages/Contact';
import About        from './pages/About';
import NotFound     from './pages/NotFound';
import CropCalendar from './pages/CropCalendar';
import PestGuide    from './pages/PestGuide';
import Unsubscribe  from './pages/Unsubscribe';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import SeedCalculator from './pages/SeedCalculator';

import AdminLogin      from './pages/admin/AdminLogin';
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminBlogs      from './pages/admin/AdminBlogs';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminContacts   from './pages/admin/AdminContacts';
import AdminSEO        from './pages/admin/AdminSEO';
import AdminAdsense    from './pages/admin/AdminAdsense';
import AdminSettings   from './pages/admin/AdminSettings';
import AdminNewsletter from './pages/admin/AdminNewsletter';

import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout    from './components/admin/AdminLayout';

const PublicLayout = ({ children, showNewsletter = false }) => (
  <>
    <Header />
    <main className="main-content">{children}</main>
    {showNewsletter && <NewsletterSignup />}
    <Footer />
    {/* <AIChatWidget /> */}
  </>
);


function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AdsenseProvider>
          <LocaleProvider>
            <Router>
              {/* Fix #1: Scroll to top on every page change */}
              <ScrollToTop />
              {/* Google Analytics SPA page tracking */}
              <GATracker />
              <ToastContainer position="top-right" autoClose={3000} />
              <Routes>
                {/* Admin */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="blogs"          element={<AdminBlogs />} />
                  <Route path="blogs/new"      element={<AdminBlogEditor />} />
                  <Route path="blogs/edit/:id" element={<AdminBlogEditor />} />
                  <Route path="contacts"       element={<AdminContacts />} />
                  <Route path="newsletter"     element={<AdminNewsletter />} />
                  <Route path="seo"            element={<AdminSEO />} />
                  <Route path="adsense"        element={<AdminAdsense />} />
                  <Route path="settings"       element={<AdminSettings />} />
                </Route>

                {/* Public */}
                <Route path="/"           element={<PublicLayout showNewsletter><Home /></PublicLayout>} />
                <Route path="/calculator" element={<PublicLayout><Calculator /></PublicLayout>} />
                <Route path="/blog"       element={<PublicLayout showNewsletter><BlogList /></PublicLayout>} />
                <Route path="/blog/:slug" element={<PublicLayout showNewsletter><BlogPost /></PublicLayout>} />
                <Route path="/calendar"   element={<PublicLayout><CropCalendar /></PublicLayout>} />
                <Route path="/pest-guide"  element={<PublicLayout><PestGuide /></PublicLayout>} />
                <Route path="/unsubscribe" element={<PublicLayout><Unsubscribe /></PublicLayout>} />
                <Route path="/contact"     element={<PublicLayout><Contact /></PublicLayout>} />
                <Route path="/about"       element={<PublicLayout><About /></PublicLayout>} />
                <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
                <Route path="/terms-of-service" element={<PublicLayout><TermsOfService /></PublicLayout>} />
                <Route path="/seed-calculator" element={<PublicLayout><SeedCalculator /></PublicLayout>} />
                <Route path="*"           element={<PublicLayout><NotFound /></PublicLayout>} />
              </Routes>
            </Router>
          </LocaleProvider>
        </AdsenseProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
