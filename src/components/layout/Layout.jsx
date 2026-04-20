import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import QuoteModal from '../common/QuoteModal';

const Layout = ({ children }) => {
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    return (
        <>
            <Header onOpenQuote={() => setIsQuoteModalOpen(true)} />
            <div className="flex min-h-0 flex-col bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-[#00AEEF] selection:text-white">
                <main className="block w-full pt-20 md:pt-24 lg:pt-28">
                    {children}
                </main>
                <Footer className="shrink-0" />
            </div>
            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
            />
        </>
    );
};

export default Layout;
