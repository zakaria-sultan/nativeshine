import QuoteForm from '../common/QuoteModal';
import { useQuote } from '../../context/QuoteContext';

export const QuoteModal = () => {
  const { isQuoteOpen, closeQuote } = useQuote();
  return <QuoteForm isOpen={isQuoteOpen} onClose={closeQuote} />;
};
