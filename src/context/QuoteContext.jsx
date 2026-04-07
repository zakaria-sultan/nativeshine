import React, { createContext, useContext, useState } from 'react';

const QuoteContext = createContext();

export const QuoteProvider = ({ children }) => {
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);

    const openQuote = () => setIsQuoteOpen(true);
    const closeQuote = () => setIsQuoteOpen(false);

    return (
        <QuoteContext.Provider value={{ isQuoteOpen, openQuote, closeQuote }}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuote = () => {
    const context = useContext(QuoteContext);
    if (!context) {
        throw new Error('useQuote must be used within a QuoteProvider');
    }
    return context;
};
