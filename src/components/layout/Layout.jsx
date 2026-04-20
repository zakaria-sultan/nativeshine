import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import QuoteModal from "../common/QuoteModal";

const Layout = ({ children }) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <>
      <Header onOpenQuote={() => setIsQuoteModalOpen(true)} />
      <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-[#00AEEF] selection:text-white">
        <main className="flex flex-col w-full min-h-0 flex-none md:flex-1 pt-20 md:pt-24 lg:pt-28 pb-20 max-md:pb-28">
          {children}
        </main>
        <Footer className="shrink-0 mt-20 md:mt-24" />
      </div>
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
};

export default Layout;
