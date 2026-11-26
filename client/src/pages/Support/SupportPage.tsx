import React, { useState } from 'react';
import { Send, Phone, Mail, Clock } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import { ModalDialog } from '../../components/common/ModalDialog';
import toast from 'react-hot-toast';

export const SupportPage: React.FC = () => {
  const { tickets, submitTicket, sendTicketReply } = useBanking();

  const [activeTicketId, setActiveTicketId] = useState('');
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
    toast.success('Support case logged with HSBC Operations Desk.');
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
    toast.success('Message sent to Operations Desk');
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        <div className="px-4 sm:px-6 md:px-8 pt-5 pb-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
              Premier Concierge &amp; Support
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              24/7 direct priority channel with HSBC India Operations
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="min-h-[42px] px-6 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold cursor-pointer self-start sm:self-auto shadow-xs transition-all"
          >
            Open New Inquiry
          </button>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {/* Concierge Info Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#DB0011] flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-5 h-5 stroke-[1.8]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase text-[#777777]">24/7 Helpline</div>
                <div className="text-xs font-bold text-[#1f1f1f] truncate">1800 266 3456</div>
              </div>
            </div>
            <div className="p-4 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#1f1f1f] flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="w-5 h-5 stroke-[1.8]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase text-[#777777]">Relationship Manager</div>
                <div className="text-xs font-bold text-[#1f1f1f] truncate">Vikram Singhania</div>
              </div>
            </div>
            <div className="p-4 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#16864A] flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-5 h-5 stroke-[1.8]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase text-[#777777]">Live Operations Sync</div>
                <div className="text-xs font-bold text-[#16864A]">Online</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ticket List */}
            <div className="lg:col-span-4 space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#777777]">
                Inquiries ({tickets.length})
              </h2>
              {tickets.map(t => {
                const isSelected = t.ticketId === activeTicket?.ticketId;
                return (
                  <button
                    key={t.ticketId}
                    type="button"
                    onClick={() => setActiveTicketId(t.ticketId)}
                    className={`w-full p-4 rounded-2xl text-left cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-white border-[#DB0011] ring-1 ring-[#DB0011]'
                        : 'bg-[#F6F7F9] border-gray-200/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#DB0011]">{t.category}</span>
                      <span className="text-[#16864A]">{t.status}</span>
                    </div>
                    <div className="text-xs font-bold text-[#1f1f1f] mt-2 truncate">{t.subject}</div>
                    <div className="text-[10px] text-[#777777] mt-0.5">{t.createdAt.slice(0, 10)}</div>
                  </button>
                );
              })}
            </div>

            {/* Thread */}
            <div className="lg:col-span-8 bg-[#F6F7F9] rounded-2xl border border-gray-200/70 p-4 sm:p-5 flex flex-col h-[460px]">
              {activeTicket ? (
                <>
                  <div className="pb-3 border-b border-gray-200/80 flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#1f1f1f]">{activeTicket.subject}</h3>
                      <div className="text-[11px] text-[#777777]">
                        Assigned: {activeTicket.assignedAdmin || 'HSBC Operations Desk'}
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200 shrink-0">
                      {activeTicket.status}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 space-y-3">
                    {activeTicket.messages?.map(m => {
                      const isCustomer = m.senderRole === 'customer';
                      return (
                        <div key={m.id} className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isCustomer
                                ? 'bg-[#DB0011] text-white rounded-br-none'
                                : 'bg-white text-[#1f1f1f] border border-gray-200/80 rounded-bl-none shadow-xs'
                            }`}
                          >
                            <div className="text-[10px] font-bold opacity-80 mb-0.5">
                              {isCustomer ? 'You' : 'HSBC Operations'}
                            </div>
                            {m.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendReply} className="pt-3 border-t border-gray-200/80 flex gap-2">
                    <input
                      type="text"
                      placeholder="Reply to Operations Desk..."
                      aria-label="Reply to Operations Desk"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="flex-1 h-11 px-4 bg-white border border-gray-200 rounded-full text-xs focus:border-[#DB0011] focus:outline-none shadow-xs"
                    />
                    <button
                      type="submit"
                      aria-label="Send reply"
                      className="min-w-[44px] h-11 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full flex items-center justify-center cursor-pointer shadow-xs transition-all"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-[#777777]">
                  Select an inquiry to view conversation
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Dialog */}
      <ModalDialog open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Open Support Inquiry" maxWidthClass="max-w-md">
        <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
          <div>
            <label htmlFor="tkt-sub" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Subject</label>
            <input id="tkt-sub" type="text" required value={newSubject} onChange={e => setNewSubject(e.target.value)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" placeholder="e.g. Limit inquiry" />
          </div>
          <div>
            <label htmlFor="tkt-cat" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Category</label>
            <select id="tkt-cat" value={newCategory} onChange={e => setNewCategory(e.target.value as any)} className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold">
              <option value="ACCOUNT_INQUIRY">Account Inquiry</option>
              <option value="TRANSACTION_DISPUTE">Transaction Dispute</option>
              <option value="CARD_LOST">Lost or Stolen Card</option>
              <option value="FRAUD">Suspected Fraud</option>
              <option value="GENERAL">General Support</option>
            </select>
          </div>
          <div>
            <label htmlFor="tkt-desc" className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Details</label>
            <textarea id="tkt-desc" required rows={4} value={newDescription} onChange={e => setNewDescription(e.target.value)} className="w-full p-3 bg-[#F6F7F9] border border-gray-200 rounded-xl" placeholder="Describe your inquiry..." />
          </div>
          <button type="submit" className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full font-semibold transition-all cursor-pointer shadow-xs">
            Submit Inquiry
          </button>
        </form>
      </ModalDialog>
    </AnimatedPageTransition>
  );
};
