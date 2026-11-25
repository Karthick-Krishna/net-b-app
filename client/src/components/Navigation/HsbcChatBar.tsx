import React, { useState } from 'react';
import {
  MessagesSquare,
  Mic,
  ArrowRight,
  Send,
  Sparkles,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '@shared/utils/formatters';
import { ModalDialog } from '../common/ModalDialog';
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
    if (!text.trim()) {
      setIsChatOpen(true);
      return;
    }

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = { sender: 'user' as const, text, time: userTime };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setIsChatOpen(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = 'I can help with balance inquiries, card controls, PIN assistance, or transaction queries.';

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
        reply = 'You can reveal your 4-digit Card ATM PIN securely using the "View card PIN" quick action on Cards, or reset your 6-digit App-Lock MPIN from Security Settings.';
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
    }, 450);
  };

  const handleMicClick = () => {
    setIsListening(true);
    toast('Listening to speech input...', { icon: '🎙' });
    setTimeout(() => {
      setIsListening(false);
      setInputMsg('What is my total balance?');
    }, 1200);
  };

  return (
    <>
      {/* STICKY BOTTOM CHAT BAR (Matches Reference Screenshot + Responsive Safe Area) */}
      <footer className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pt-2.5 px-3 sm:px-4 pb-[max(0.625rem,env(safe-area-inset-bottom,0px))] print:hidden">
        <div className="max-w-md md:max-w-2xl mx-auto flex items-center gap-2.5 sm:gap-3">
          {/* Double Chat Bubble Icon */}
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="min-w-[44px] min-h-[44px] -ml-1 flex items-center justify-center text-[#1f1f1f] hover:text-[#DB0011] transition-colors cursor-pointer shrink-0"
            aria-label="Open HSBC Virtual Assistant"
          >
            <MessagesSquare className="w-6 h-6 stroke-[1.8]" aria-hidden="true" />
          </button>

          {/* Input Box: "Start chat" with Microphone inside */}
          <div className="flex-1 relative flex items-center min-w-0">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Start chat"
              aria-label="Start chat with HSBC Virtual Assistant"
              className="w-full h-11 pl-3.5 pr-11 bg-white border border-[#333333] rounded-[2px] text-[14px] text-[#222222] placeholder:text-gray-400 focus:outline-none focus:border-[#DB0011] transition-colors"
            />
            <button
              type="button"
              onClick={handleMicClick}
              aria-label="Voice Input"
              className={`absolute right-0.5 min-w-[40px] min-h-[40px] flex items-center justify-center transition-colors cursor-pointer ${
                isListening ? 'text-[#DB0011] animate-pulse' : 'text-gray-500 hover:text-[#DB0011]'
              }`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5 stroke-[1.8]" aria-hidden="true" />
            </button>
          </div>

          {/* Right Arrow / Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            className="min-w-[44px] min-h-[44px] -mr-1 flex items-center justify-center text-[#1f1f1f] hover:text-[#DB0011] transition-colors cursor-pointer shrink-0"
            aria-label="Send Message"
          >
            <ArrowRight className="w-6 h-6 stroke-[2]" aria-hidden="true" />
          </button>
        </div>
      </footer>

      {/* ACCESSIBLE HSBC VIRTUAL ASSISTANT DIALOG */}
      <ModalDialog
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title="HSBC Virtual Assistant"
        subtitle="Live AI Banking Support"
        maxWidthClass="max-w-lg"
      >
        <div className="flex flex-col h-[58dvh] max-h-[500px] -m-5">
          {/* Chat Status Bar */}
          <div className="px-5 py-2.5 bg-[#F6F7F9] border-b border-gray-100 flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
            <Sparkles className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            <span>Encrypted Premier Banking Concierge Online</span>
          </div>

          {/* Chat Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9F9FB]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[84%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
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
          <div className="px-4 py-2.5 bg-white border-t border-gray-100 overflow-x-auto flex items-center gap-2 no-scrollbar">
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
                className="flex-shrink-0 px-3 py-1.5 min-h-[32px] bg-[#F2F4F7] hover:bg-gray-200 text-[#1f1f1f] text-[11px] font-semibold rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Inside Dialog */}
          <div className="p-3.5 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask HSBC assistant..."
              aria-label="Message HSBC assistant"
              className="flex-1 h-11 px-3.5 bg-[#F2F4F7] border border-transparent rounded-[2px] text-xs text-[#1f1f1f] focus:bg-white focus:border-[#DB0011] focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              aria-label="Send message"
              className="min-w-[44px] h-11 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-[2px] flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </ModalDialog>
    </>
  );
};
