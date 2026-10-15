import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ServicePageTemplate from "./pages/ServicePageTemplate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/common/ScrollToTop";
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminServiceEdit = lazy(() => import("./pages/admin/AdminServiceEdit"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminAccount = lazy(() => import("./pages/admin/AdminAccount"));
const AdminSiteSettings = lazy(() => import("./pages/admin/AdminSiteSettings"));
const AdminHomeSlides = lazy(() => import("./pages/admin/AdminHomeSlides"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/:id" element={<AdminServiceEdit />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSiteSettings />} />
          <Route path="homepage" element={<AdminHomeSlides />} />
          <Route path="account" element={<AdminAccount />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<HomePage />} />
          <Route path="/services/:slug" element={<ServicePageTemplate />} />
          <Route
            path="*"
            element={
              <div className="ns-page-last py-8 text-center text-4xl font-black text-[#00AEEF] uppercase tracking-tighter">
                404: Page Not Found
              </div>
            }
          />
        </Route>
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
