import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { SupportTicket, SupportMessage } from '../types';
import { api } from '../services/api';
import {
  MessageSquare,
  HelpCircle,
  FileQuestion,
  Calendar,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  CheckCircle2,
  X
} from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { showToast } = useBanking();
  const [activeTab, setActiveTab] = useState<'chat' | 'faqs' | 'dispute' | 'appointment'>('chat');
  const [faqs, setFaqs] = useState<{ q: string; a: string; category: string }[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Tickets & Chat
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>('');

  // Dispute form
  const [disputeCategory, setDisputeCategory] = useState<string>('TRANSACTION_DISPUTE');
  const [disputeSubject, setDisputeSubject] = useState<string>('Unauthorized Charge Review');
  const [disputeDescription, setDisputeDescription] = useState<string>('');

  // Appointment form
  const [branchName, setBranchName] = useState<string>('Canary Wharf Flagship Premier Centre');
  const [appointDate, setAppointDate] = useState<string>('2026-12-04');
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM');
  const [serviceType, setServiceType] = useState<string>('Premier Wealth Advisory');

  useEffect(() => {
    api.getFaqs().then(res => setFaqs(res.faqs)).catch(() => {});
    api.getTickets().then(res => {
      setTickets(res.tickets);
      if (res.tickets.length > 0) {
        selectTicket(res.tickets[0]);
      }
    }).catch(() => {});
  }, []);

  const selectTicket = async (t: SupportTicket) => {
    setActiveTicket(t);
    try {
      const res = await api.getTicketDetails(t.id);
      setMessages(res.messages);
    } catch (err: any) {
      showToast(err.message || 'Failed to load ticket messages', 'error');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeTicket) return;
    const msg = chatInput;
    setChatInput('');

    try {
      const res = await api.sendTicketMessage(activeTicket.id, msg);
      setMessages(res.messages);
    } catch (err: any) {
      showToast(err.message || 'Could not send message', 'error');
    }
  };

  const handleCreateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createTicket({
        category: disputeCategory,
        subject: disputeSubject,
        description: disputeDescription,
        priority: 'HIGH',
      });
      showToast(res.message, 'success');
      setDisputeDescription('');
      // Reload tickets
      const updated = await api.getTickets();
      setTickets(updated.tickets);
      const newlyCreated = updated.tickets.find(t => t.id === res.ticketId);
      if (newlyCreated) {
        selectTicket(newlyCreated);
        setActiveTab('chat');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit dispute', 'error');
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.bookAppointment({
        branchName,
        date: appointDate,
        timeSlot,
        serviceType,
      });
      showToast(res.message, 'success');
      setActiveTab('chat');
    } catch (err: any) {
      showToast(err.message || 'Booking failed', 'error');
    }
  };

  return (
    <div className="p-4 space-y-4 pb-8 animate-in fade-in duration-200">
      {/* Title */}
      <div>
        <h1 className="text-lg font-bold text-bank-text">Premier Concierge & Support</h1>
        <p className="text-xs text-bank-muted">24/7 Intelligent Banking Assistant & Dispute Desk</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1.5 text-xs">
        {[
          { id: 'chat', label: 'Live Assistant', icon: MessageSquare },
          { id: 'faqs', label: 'FAQs', icon: HelpCircle },
          { id: 'dispute', label: 'File Dispute', icon: ShieldAlert },
          { id: 'appointment', label: 'Book Branch', icon: Calendar },
        ].map(item => {
          const Icon = item.icon;
          const isSelected = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id as any)}
              className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
                isSelected
                  ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                  : 'bg-white border-bank-border text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Icon size={14} className={isSelected ? 'text-[#DB0011]' : 'text-zinc-600'} />
              <span className="leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Live Chat Assistant */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-bank-border shadow-card flex flex-col h-[520px] overflow-hidden">
          {/* Active Ticket Banner */}
          <div className="bg-zinc-50 border-b border-zinc-200 px-4 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-zinc-800">
                {activeTicket ? activeTicket.ticket_number : 'Premier Virtual Assistant'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">
              Status: {activeTicket?.status || 'OPEN'}
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-zinc-50/40">
            {messages.length === 0 ? (
              <div className="text-center p-8 text-zinc-400">
                <Bot size={28} className="mx-auto mb-2 text-[#DB0011]" />
                <p className="font-medium">Welcome to Premier Banking Support.</p>
                <p className="text-[11px] mt-1">Ask any question regarding accounts, card locks, wire transfers, or disputes.</p>
              </div>
            ) : (
              messages.map(m => {
                const isUser = m.sender_type === 'USER';
                return (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] shrink-0 ${
                        isUser ? 'bg-[#DB0011] text-white' : 'bg-zinc-900 text-white'
                      }`}
                    >
                      {isUser ? <User size={13} /> : <Bot size={13} />}
                    </div>

                    <div
                      className={`max-w-[75%] p-3 rounded-2xl leading-relaxed text-xs ${
                        isUser
                          ? 'bg-[#DB0011] text-white rounded-tr-xs'
                          : 'bg-white text-zinc-800 border border-zinc-200 rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your message (e.g. 'How do I freeze my card?')..."
              className="flex-1 p-2.5 rounded-xl border border-zinc-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#DB0011]/30"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white transition shrink-0"
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: FAQs */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted">
            Frequently Asked Banking Questions
          </h2>

          <div className="divide-y divide-zinc-100 text-xs">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-3">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-zinc-900 gap-2 hover:text-[#DB0011] transition"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedFaq === idx && (
                  <p className="mt-2 text-zinc-600 leading-relaxed text-[11px] bg-zinc-50 p-3 rounded-xl border border-zinc-100 animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: File Dispute */}
      {activeTab === 'dispute' && (
        <div className="bg-white rounded-2xl p-5 border border-bank-border shadow-card space-y-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">File a Formal Transaction Dispute</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Zero Liability Protection for Unauthorized Financial Activity</p>
          </div>

          <form onSubmit={handleCreateDispute} className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Dispute Category</label>
              <select
                value={disputeCategory}
                onChange={e => setDisputeCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
              >
                <option value="TRANSACTION_DISPUTE">Unrecognized Debit / Charge</option>
                <option value="CARD_LOST">Lost or Stolen Card Incident</option>
                <option value="FRAUD">Suspected Phishing / Unauthorized Access</option>
                <option value="ACCOUNT_INQUIRY">Incorrect Fee or Interest Calculation</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Subject Header</label>
              <input
                type="text"
                value={disputeSubject}
                onChange={e => setDisputeSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 font-medium"
                required
              />
            </div>

            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Details & Transaction Reference</label>
              <textarea
                rows={4}
                value={disputeDescription}
                onChange={e => setDisputeDescription(e.target.value)}
                placeholder="State the transaction reference, merchant, exact amount, and reason for dispute..."
                className="w-full p-2.5 rounded-xl border border-zinc-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs tracking-wide shadow-md transition"
            >
              Submit Dispute File
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: Book Branch Appointment */}
      {activeTab === 'appointment' && (
        <div className="bg-white rounded-2xl p-5 border border-bank-border shadow-card space-y-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Book Premier Branch Appointment</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Meet with your dedicated Relationship Manager or Wealth Advisor</p>
          </div>

          <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Select Premier Centre</label>
              <select
                value={branchName}
                onChange={e => setBranchName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
              >
                <option value="Canary Wharf Flagship Premier Centre">Canary Wharf Flagship Premier Centre (8 Canada Square)</option>
                <option value="Mayfair Private Wealth Suite">Mayfair Private Wealth Suite (16 Berkeley St)</option>
                <option value="City of London Queen Victoria Branch">City of London Branch (76 Queen Victoria St)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Appointment Date</label>
                <input
                  type="date"
                  value={appointDate}
                  onChange={e => setAppointDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-zinc-600 font-semibold block mb-1">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-zinc-600 font-semibold block mb-1">Advisory Topic</label>
              <select
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
              >
                <option value="Premier Wealth Advisory">Premier Wealth Advisory & Portfolios</option>
                <option value="Mortgage & Property Finance">Mortgage & Property Finance</option>
                <option value="International Cross-Border Account Setup">International Cross-Border Account Setup</option>
                <option value="Corporate Executive Banking">Corporate Executive Banking</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs tracking-wide shadow-md transition"
            >
              Confirm Appointment
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
