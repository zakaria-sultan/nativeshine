import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import QuoteModal from "../common/QuoteModal";

const Layout = ({ children }) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const content = children ?? <Outlet />;

  return (
    <>
      <Header onOpenQuote={() => setIsQuoteModalOpen(true)} />
      <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-[#00AEEF] selection:text-white">
        <main className="flex flex-col w-full min-h-0 flex-1 pt-36 lg:pt-24 pb-0">
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
