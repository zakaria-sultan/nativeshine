import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ServicePageTemplate from "./pages/ServicePageTemplate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ScrollToTop from "./components/common/ScrollToTop";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminServiceEdit from "./pages/admin/AdminServiceEdit";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAccount from "./pages/admin/AdminAccount";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="services/:id" element={<AdminServiceEdit />} />
          <Route path="users" element={<AdminUsers />} />
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
    </Router>
  );
}

export default App;
