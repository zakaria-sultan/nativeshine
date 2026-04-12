import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import QuoteModal from '../common/QuoteModal';

const Layout = ({ children }) => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-[#00AEEF] selection:text-white">
            <Header onOpenQuote={() => setIsQuoteModalOpen(true)} />
            <main className="flex-grow pt-24 lg:pt-32">
                {children}
            </main>
            <Footer />
            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
            />
        </div>
    );
};

export default Layout;
