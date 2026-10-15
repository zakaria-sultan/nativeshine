import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSiteContent } from "../../context/SiteContentContext";
import { useServices } from "../../context/ServicesContext";
import Header from "./Header";
import Footer from "./Footer";
import QuoteModal from "../common/QuoteModal";

const Layout = ({ children }) => {
  const location = useLocation();
  const site = useSiteContent();
  const services = useServices();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const content = children ?? <Outlet />;

  return (
    <>
      <Header key={location.key} onOpenQuote={() => setIsQuoteModalOpen(true)} />
      <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-[#00AEEF] selection:text-white">
        <main className="flex flex-col w-full min-h-0 flex-1 pt-36 lg:pt-24 pb-0">
          {(site.error || services.error) && <div role="alert" className="border-b border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-900">
            Some website content could not be refreshed. <button className="font-bold underline" onClick={() => { site.refresh(); services.refresh(); }}>Try again</button>
          </div>}
          {content}
        </main>
        <Footer className="shrink-0 mt-0" />
      </div>
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
};

export default Layout;
