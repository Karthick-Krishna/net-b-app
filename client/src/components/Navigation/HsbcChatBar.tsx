import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessagesSquare,
  Mic,
  ArrowRight,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Landmark,
  KeyRound,
  Snowflake,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '@shared/utils/formatters';
import toast from 'react-hot-toast';

export const HsbcChatBar: React.FC = () => {
  const { totalBalanceGbpOrInr, cards, updateCardSettings } = useBanking();
  const { currentUser } = useAuth();

  const [inputMsg, setInputMsg] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: `Hello ${currentUser?.displayName?.split(' ')[0] || 'Karthick'}. I am your HSBC Virtual Assistant. How may I assist you with your Premier accounts and cards today?`,
      time: 'Just now',
    },
  ]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: 'user' as const, text, time: userTime };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsChatOpen(true);

    // Contextual responses based on customer intent
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "I can help with balance inquiries, card controls, PIN assistance, or transaction queries.";

      if (lower.includes('balance') || lower.includes('money') || lower.includes('asset')) {
        reply = `Your Total Assets across all active HSBC Premier accounts are ${formatINR(totalBalanceGbpOrInr)}. All accounts are synchronized and active.`;
      } else if (lower.includes('freeze') || lower.includes('block card')) {
        const primaryCard = cards[0];
        if (primaryCard) {
          const newStatus = primaryCard.cardStatus === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
          updateCardSettings(primaryCard.cardId, { cardStatus: newStatus });
          reply = `Card ${primaryCard.maskedCardNumber} has been ${newStatus === 'FROZEN' ? 'temporarily FROZEN' : 'UN-FROZEN and activated'} per your request.`;
          toast.success(newStatus === 'FROZEN' ? 'Card frozen' : 'Card activated');
        } else {
          reply = 'I could not locate an active card on file to freeze.';
        }
      } else if (lower.includes('pin') || lower.includes('mpin')) {
        reply = 'You can reveal your 4-digit Card ATM PIN securely using the "View card PIN" quick action button, or reset your 6-digit App-Lock MPIN from Security Settings.';
      } else if (lower.includes('card') || lower.includes('limit')) {
        reply = `You have ${cards.length} active cards on your profile. Daily domestic spending limit is ${formatINR(cards[0]?.spendingLimit || 200000)}.`;
      } else if (lower.includes('transfer') || lower.includes('pay')) {
        reply = 'To initiate an instant NEFT/RTGS/IMPS domestic payment or Global Money remittance, tap "Pay" in the top navigation bar.';
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleMicClick = () => {
    setIsListening(true);
    toast('Listening to speech input...', { icon: '🎙' });
    setTimeout(() => {
      setIsListening(false);
      setInputMsg('What is my total balance?');
    }, 1500);
  };

  return (
    <>
      {/* STICKY BOTTOM CHAT BAR (EXACT DESIGN AS IN SCREENSHOT) */}
      <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg py-2.5 px-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Double Chat Bubble Icon */}
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="p-1 text-[#1f1f1f] hover:text-[#DB0011] transition-colors"
            aria-label="Open HSBC Virtual Assistant"
          >
            <MessagesSquare className="w-6 h-6 stroke-[1.8]" />
          </button>

          {/* Input Box: "Start chat" with Microphone inside */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Start chat"
              className="w-full h-11 pl-3.5 pr-10 bg-white border border-[#333333] rounded-[2px] text-[14px] text-[#222222] placeholder:text-gray-400 focus:outline-none focus:border-[#DB0011] transition-colors"
            />
            <button
              type="button"
              onClick={handleMicClick}
              className={`absolute right-3 p-1 transition-colors ${
                isListening ? 'text-[#DB0011] animate-pulse' : 'text-gray-500 hover:text-[#DB0011]'
              }`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          {/* Right Arrow / Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            className="p-1 text-[#1f1f1f] hover:text-[#DB0011] transition-colors"
            aria-label="Send Message"
          >
            <ArrowRight className="w-6 h-6 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* INTERACTIVE HSBC VIRTUAL ASSISTANT MODAL */}
      <AnimatePresence>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col h-[82vh] max-h-[640px] overflow-hidden"
            >
              {/* Chat Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-50 text-[#DB0011] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#1f1f1f]">
                      HSBC Virtual Assistant
                    </h3>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live AI Banking Assistant
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-black rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9F9FB]">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#DB0011] text-white rounded-br-none'
                          : 'bg-white text-[#222222] border border-gray-200/80 shadow-xs rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                      {m.time}
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto flex items-center gap-2 no-scrollbar">
                {[
                  'What is my total balance?',
                  'Freeze my debit card',
                  'How do I view my PIN?',
                  'Daily spending limit',
                ].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSend(chip)}
                    className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#222222] text-[11px] font-semibold rounded-full transition-colors whitespace-nowrap"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Inside Drawer */}
              <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Ask HSBC assistant..."
                  className="flex-1 h-10 px-3.5 bg-gray-100 border border-transparent rounded-lg text-xs text-[#222222] focus:bg-white focus:border-[#DB0011] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  className="w-10 h-10 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-lg flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
