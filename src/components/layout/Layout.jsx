import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
            <Header />
            <main className="flex-grow pt-20 lg:pt-24 font-sans antialiased text-slate-900 bg-white">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
