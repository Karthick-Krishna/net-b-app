import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Send, MessageSquare, AlertCircle, CheckCircle2, Phone, Mail, Clock, ShieldCheck, X } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const SupportPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { tickets, submitTicket, sendTicketReply } = useBanking();

  const [activeTicketId, setActiveTicketId] = useState(tickets[0]?.ticketId || '');
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<'TRANSACTION_DISPUTE' | 'CARD_LOST' | 'FRAUD' | 'ACCOUNT_INQUIRY' | 'GENERAL'>('ACCOUNT_INQUIRY');
  const [newDescription, setNewDescription] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeTicket = tickets.find(t => t.ticketId === activeTicketId) || tickets[0];

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      toast.error('Please enter a subject and message');
      return;
    }

    const t = await submitTicket({
      subject: newSubject,
      description: newDescription,
      category: newCategory,
      priority: 'HIGH',
    });
    toast.success('Support ticket submitted to Central Banking Operations!');
    setShowCreateModal(false);
    setActiveTicketId(t.ticketId);
    setNewSubject('');
    setNewDescription('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    sendTicketReply(activeTicket.ticketId, replyText);
    setReplyText('');
    toast.success('Message sent to Administrator');
  };

  return (
    <AnimatedPageTransition className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Premier Customer Concierge & Support
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Direct priority communication channel with HSBC India Operations Console
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors shadow-xs"
        >
          Open New Inquiry
        </button>
      </div>

      {/* Concierge Hotline Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Premier 24/7 Helpline</div>
            <div className="text-xs font-black text-[#252525] mt-0.5">1800 266 3456 / +91 22 6689 7777</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-50 text-[#252525] flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Dedicated Relationship Manager</div>
            <div className="text-xs font-black text-[#252525] mt-0.5">Vikram Singhania (VP, Wealth)</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16864A] flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Live Operations Sync</div>
            <div className="text-xs font-black text-[#16864A] mt-0.5">Online • Real-Time Broadcast</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777]">
            Inquiry Tickets ({tickets.length})
          </h3>
          {tickets.length === 0 ? (
            <div className="p-6 bg-white rounded-2xl border border-[#E8E8E8] text-center text-xs text-[#777777]">
              No open inquiries found. Click "Open New Inquiry" to contact the Operations Console.
            </div>
          ) : (
            tickets.map(t => {
              const isSelected = t.ticketId === activeTicket?.ticketId;
              return (
                <div
                  key={t.ticketId}
                  onClick={() => setActiveTicketId(t.ticketId)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-white border-[#DB0011] shadow-md ring-1 ring-red-100'
                      : 'bg-white border-[#E8E8E8] hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-red-50 text-[#DB0011]">{t.category}</span>
                    <span className="text-[#16864A]">{t.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#252525] mt-2 truncate">{t.subject}</h4>
                  <p className="text-[11px] text-[#777777] mt-1">{t.createdAt.slice(0, 10)}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E8E8] shadow-xs p-6 flex flex-col h-[520px]">
          {activeTicket ? (
            <>
              <div className="pb-4 border-b border-[#E8E8E8] flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-[#252525]">{activeTicket.subject}</h3>
                  <div className="text-[11px] text-[#777777] mt-0.5">
                    Assigned: {activeTicket.assignedAdmin || 'Central Banking Operations Desk'}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#16864A] border border-emerald-200">
                  {activeTicket.status}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {activeTicket.messages?.map(m => {
                  const isCustomer = m.senderRole === 'customer';
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isCustomer
                            ? 'bg-[#DB0011] text-white rounded-br-xs'
                            : 'bg-gray-100 text-[#252525] rounded-bl-xs'
                        }`}
                      >
                        <div className="text-[10px] font-bold opacity-80 mb-0.5">
                          {isCustomer ? 'You (Customer)' : 'HSBC Operations Administrator'}
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

              <form onSubmit={handleSendReply} className="pt-3 border-t border-[#E8E8E8] flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message to administration..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
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

      {/* New Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E8E8]">
              <h3 className="text-sm font-bold text-[#252525]">Open Premier Support Inquiry</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-[#DB0011]"
                  placeholder="e.g. Card Limit Enhancement / Transaction Query"
                />
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-[#DB0011]"
                >
                  <option value="ACCOUNT_INQUIRY">Account Inquiry</option>
                  <option value="TRANSACTION_DISPUTE">Transaction Dispute</option>
                  <option value="CARD_LOST">Lost or Stolen Card</option>
                  <option value="FRAUD">Suspected Fraud</option>
                  <option value="GENERAL">General Support</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl focus:outline-none focus:border-[#DB0011]"
                  placeholder="Describe your inquiry with dates, amounts, or references..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#E8E8E8] rounded-xl font-bold text-[#777777] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#DB0011] text-white rounded-xl font-bold hover:bg-[#B0000D]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
