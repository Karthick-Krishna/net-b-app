import React, { useState } from 'react';
import { Headphones, Send, Clock, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const SupportTicketsAdminPage: React.FC = () => {
  const { tickets, replyTicket } = useAdminStore();
  const [selectedTicketId, setSelectedTicketId] = useState(tickets[0]?.ticketId || '');
  const [replyMessage, setReplyMessage] = useState('');

  const activeTicket = tickets.find(t => t.ticketId === selectedTicketId) || tickets[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeTicket) return;
    replyTicket(activeTicket.ticketId, replyMessage);
    setReplyMessage('');
    toast.success('Reply transmitted to customer on Port 4000 in real time!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
          Concierge Support Operations Desk
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Real-time customer dispute inquiries, card protection alerts, and priority client requests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777]">
            Active Inquiries ({tickets.length})
          </h3>
          {tickets.map(t => {
            const isSelected = t.ticketId === activeTicket?.ticketId;
            return (
              <div
                key={t.ticketId}
                onClick={() => setSelectedTicketId(t.ticketId)}
                className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-white border-[#DB0011] shadow-md ring-1 ring-red-100'
                    : 'bg-white border-[#E8E8E8] hover:border-gray-300 shadow-xs'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="px-2 py-0.5 rounded bg-red-50 text-[#DB0011]">{t.category}</span>
                  <span className="text-[#16864A]">{t.status}</span>
                </div>
                <h4 className="text-xs font-bold text-[#252525] mt-2 truncate">{t.subject}</h4>
                <div className="text-[11px] text-[#777777] mt-1">Customer: {t.customerName}</div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E8E8] shadow-xs p-6 flex flex-col h-[520px]">
          {activeTicket ? (
            <>
              <div className="pb-4 border-b border-[#E8E8E8] flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-[#252525]">{activeTicket.subject}</h3>
                  <div className="text-xs text-[#777777] mt-0.5">
                    Customer: <strong className="text-[#252525]">{activeTicket.customerName}</strong> ({activeTicket.ownerUid})
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#16864A] border border-emerald-200">
                  {activeTicket.status}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {activeTicket.messages?.map(m => {
                  const isAdmin = m.senderRole === 'admin';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-[#DB0011] text-white rounded-br-xs'
                            : 'bg-gray-100 text-[#252525] rounded-bl-xs'
                        }`}
                      >
                        <div className="text-[10px] font-bold opacity-80 mb-0.5">
                          {isAdmin ? 'You (Operations Admin)' : `${activeTicket.customerName} (Client)`}
                        </div>
                        {m.message}
                      </div>
                      <span className="text-[9px] text-[#777777] mt-1 px-1">
                        {m.timestamp.slice(11, 16)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="pt-3 border-t border-[#E8E8E8] flex gap-2">
                <input
                  type="text"
                  placeholder="Transmit official administrative response to client..."
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="flex-1 p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-xs text-[#252525] focus:outline-none focus:border-[#DB0011]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-[#777777]">
              No active inquiry selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
