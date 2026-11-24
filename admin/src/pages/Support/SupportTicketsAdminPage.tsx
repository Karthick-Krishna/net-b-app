import React, { useState } from 'react';
import { Headphones, Send } from 'lucide-react';
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
    toast.success('Reply transmitted to customer in real time!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Concierge Support Operations
        </h2>
        <p className="text-xs text-slate-400">
          Manage customer dispute inquiries, fraud alerts, and limit requests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {tickets.map(t => {
            const isSelected = t.ticketId === activeTicket?.ticketId;
            return (
              <div
                key={t.ticketId}
                onClick={() => setSelectedTicketId(t.ticketId)}
                className={`p-4 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-[#DB0011] text-white ring-1 ring-[#DB0011]'
                    : 'bg-[#1E293B] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-red-400">{t.category}</span>
                  <span className="text-emerald-400">{t.status}</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1 truncate">{t.subject}</h4>
                <div className="text-[10px] text-slate-500 mt-1">Customer: {t.customerName}</div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-2 bg-[#1E293B] rounded-2xl border border-slate-800 p-6 flex flex-col h-[500px]">
          {activeTicket ? (
            <>
              <div className="pb-4 border-b border-slate-800 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-white">{activeTicket.subject}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Customer: {activeTicket.customerName} ({activeTicket.ownerUid})
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400">
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
                        className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-[#DB0011] text-white rounded-br-xs'
                            : 'bg-slate-800 text-slate-100 rounded-bl-xs'
                        }`}
                      >
                        <div className="text-[10px] font-bold opacity-80 mb-0.5">
                          {isAdmin ? 'Premier Administrator' : activeTicket.customerName}
                        </div>
                        {m.message}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 px-1">
                        {m.timestamp.slice(11, 16)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type official reply to customer..."
                  value={replyMessage}
                  onChange={e => setReplyMessage(e.target.value)}
                  className="flex-1 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-[#DB0011]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#DB0011] text-white rounded-lg text-xs font-bold hover:bg-[#B0000D] transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              No ticket selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
