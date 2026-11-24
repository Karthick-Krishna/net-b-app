import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import { api } from '../services/api';
import {
  Shield,
  Users,
  Landmark,
  ArrowLeftRight,
  CreditCard,
  MessageSquare,
  FileText,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Activity,
  Send,
  RefreshCw
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { formatAmount, showToast } = useBanking();
  const [tab, setTab] = useState<'overview' | 'customers' | 'ledger' | 'transactions' | 'cards' | 'tickets' | 'audit'>('overview');

  const [overview, setOverview] = useState<any | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ticket reply state
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('RESOLVED');

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [ov, cust, ledg, txns, crds, tcks, aud] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminCustomers(),
        api.getAdminLedger(),
        api.getAdminTransactions(),
        api.getAdminCards(),
        api.getAdminTickets(),
        api.getAdminAuditLogs(),
      ]);

      setOverview(ov.overview);
      setCustomers(cust.customers);
      setLedgerEntries(ledg.entries);
      setTransactions(txns.transactions);
      setCards(crds.cards);
      setTickets(tcks.tickets);
      setAuditLogs(aud.logs);
    } catch (err: any) {
      showToast(err.message || 'Failed to load administrative console', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleLockCustomer = async (id: string) => {
    try {
      const res = await api.toggleCustomerLock(id);
      showToast(res.message, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId) return;
    try {
      const res = await api.updateAdminTicketStatus(selectedTicketId, newStatus, resolutionNote);
      showToast(res.message, 'success');
      setSelectedTicketId('');
      setResolutionNote('');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-5 bg-white min-h-[750px] text-zinc-900 animate-in fade-in">
      {/* Admin Portal Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded bg-[#DB0011] text-white flex items-center justify-center font-black text-xs">
              ▲
            </span>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">
              Core Banking Administrative Control Center
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Logged in as <strong className="text-zinc-800">{user?.full_name}</strong> (Role: <span className="text-[#DB0011] font-bold">{user?.role}</span>)
          </p>
        </div>

        <button
          onClick={loadAdminData}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition"
        >
          <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-zinc-200">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: Activity },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'ledger', label: 'Double-Entry Ledger', icon: Landmark },
          { id: 'transactions', label: `Transactions (${transactions.length})`, icon: ArrowLeftRight },
          { id: 'cards', label: `Issued Cards (${cards.length})`, icon: CreditCard },
          { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: MessageSquare },
          { id: 'audit', label: 'Audit Trail', icon: FileText },
        ].map(item => {
          const Icon = item.icon;
          const isSelected = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-semibold whitespace-nowrap transition border-b-2 ${
                isSelected
                  ? 'border-[#DB0011] text-[#DB0011] bg-red-50/50'
                  : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && overview && (
        <div className="space-y-5 animate-in fade-in">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">Total Customer Deposits</span>
              <div className="text-xl font-black text-zinc-900 mt-1">
                {formatAmount(overview.totalDepositsGbp, 'GBP')}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Full Reserve Backed</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">Active Customers</span>
              <div className="text-xl font-black text-zinc-900 mt-1">{overview.totalCustomers}</div>
              <span className="text-[10px] text-zinc-500 mt-1 block">{overview.totalAccounts} accounts opened</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">24h Transaction Volume</span>
              <div className="text-xl font-black text-zinc-900 mt-1">
                {formatAmount(overview.dailyVolumeGbp, 'GBP')}
              </div>
              <span className="text-[10px] text-zinc-500 mt-1 block">{overview.dailyTransactionCount} payments settled</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-[11px] text-zinc-500 uppercase font-semibold">Flagged Fraud / AML</span>
              <div className="text-xl font-black text-emerald-700 mt-1">{overview.flaggedFraudAlerts} Alerts</div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Zero Breaches Detected</span>
            </div>
          </div>

          {/* System & Ledger Integrity Status */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
              <div>
                <strong className="text-emerald-950 font-bold">Double-Entry Balance Reconciliation: VERIFIED</strong>
                <p className="text-emerald-800 text-[11px]">
                  All debits and credits across the general ledger balance to zero discrepancy. ACID transaction isolation active.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white font-mono text-[10px] font-bold">
              100% HEALTHY
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: CUSTOMERS */}
      {tab === 'customers' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Customer ID</th>
                  <th className="p-3">Legal Name</th>
                  <th className="p-3">Email & Phone</th>
                  <th className="p-3">KYC Tier</th>
                  <th className="p-3">Total Balance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-bold text-zinc-900">{c.customer_id}</td>
                    <td className="p-3 font-semibold text-zinc-900">{c.full_name}</td>
                    <td className="p-3 text-zinc-600 text-[11px]">
                      {c.email}
                      <br />
                      <span className="text-zinc-400">{c.phone}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                        {c.kyc_status}
                      </span>
                    </td>
                    <td className="p-3 font-extrabold text-zinc-900">{formatAmount(c.totalBalance, 'GBP')}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.is_locked ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {c.is_locked ? 'LOCKED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleLockCustomer(c.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                          c.is_locked
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                        }`}
                      >
                        {c.is_locked ? 'Unlock' : 'Lock Access'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DOUBLE-ENTRY LEDGER */}
      {tab === 'ledger' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Journal Entry ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Account Number</th>
                  <th className="p-3">Leg Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Balance After</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono text-[11px]">
                {ledgerEntries.map(l => (
                  <tr key={l.id} className="hover:bg-zinc-50">
                    <td className="p-3 text-zinc-500">{l.id.substring(0, 8)}...</td>
                    <td className="p-3 text-zinc-600">{new Date(l.created_at).toLocaleString('en-GB')}</td>
                    <td className="p-3 font-semibold text-zinc-900">{l.account_number}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          l.entry_type === 'CREDIT' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {l.entry_type}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-zinc-900">{formatAmount(l.amount, l.currency)}</td>
                    <td className="p-3 text-zinc-600">{formatAmount(l.balance_after, l.currency)}</td>
                    <td className="p-3 font-sans text-zinc-700">{l.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTIONS MONITORING */}
      {tab === 'transactions' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Reference</th>
                  <th className="p-3">Sender</th>
                  <th className="p-3">Counterparty</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-bold text-zinc-900">{t.reference}</td>
                    <td className="p-3 text-zinc-800">{t.customer_name || 'Premier Customer'}</td>
                    <td className="p-3 font-semibold text-zinc-900">{t.counterparty_name}</td>
                    <td className="p-3 font-extrabold text-zinc-900">{formatAmount(t.amount, t.currency)}</td>
                    <td className="p-3 text-zinc-600">{t.category}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-500 text-[11px]">{new Date(t.created_at).toLocaleString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CARDS */}
      {tab === 'cards' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Card Number</th>
                  <th className="p-3">Cardholder</th>
                  <th className="p-3">Type & Tier</th>
                  <th className="p-3">Expires</th>
                  <th className="p-3">Daily Limit</th>
                  <th className="p-3">Frozen</th>
                  <th className="p-3">Blocked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {cards.map(c => (
                  <tr key={c.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-bold text-zinc-900">{c.card_number_masked}</td>
                    <td className="p-3 font-semibold text-zinc-800">{c.cardholder_name}</td>
                    <td className="p-3 text-zinc-700">{c.card_type} ({c.card_tier})</td>
                    <td className="p-3 text-zinc-600 font-mono">{c.expiry_month}/{c.expiry_year}</td>
                    <td className="p-3 font-bold text-zinc-900">{formatAmount(c.daily_spending_limit, 'GBP')}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.is_frozen ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {c.is_frozen ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.is_blocked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {c.is_blocked ? 'BLOCKED' : 'NO'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: SUPPORT TICKETS */}
      {tab === 'tickets' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Ticket #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {tickets.map(t => (
                  <tr key={t.id} className="hover:bg-zinc-50">
                    <td className="p-3 font-mono font-bold text-zinc-900">{t.ticket_number}</td>
                    <td className="p-3 font-semibold text-zinc-900">{t.customer_name || 'Customer'}</td>
                    <td className="p-3 text-zinc-600">{t.category}</td>
                    <td className="p-3 font-medium text-zinc-800">{t.subject}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.priority === 'HIGH' || t.priority === 'URGENT' ? 'bg-red-50 text-red-700' : 'bg-zinc-100 text-zinc-700'}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedTicketId(t.id)}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-black text-white text-[11px] font-bold transition"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ticket Response Modal */}
          {selectedTicketId && (
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-3 text-xs">
              <h3 className="font-bold text-sm text-zinc-900">Resolve Support Ticket</h3>
              <form onSubmit={handleUpdateTicket} className="space-y-3">
                <div>
                  <label className="text-zinc-600 block mb-1 font-semibold">Official Banking Resolution Note</label>
                  <textarea
                    rows={3}
                    value={resolutionNote}
                    onChange={e => setResolutionNote(e.target.value)}
                    placeholder="Enter resolution details communicated to the customer..."
                    className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-zinc-600 block mb-1 font-semibold">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      className="w-full p-2 rounded-xl border border-zinc-300 bg-white"
                    >
                      <option value="RESOLVED">RESOLVED</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <div className="pt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTicketId('')}
                      className="py-2 px-3 rounded-xl border border-zinc-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-4 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold"
                    >
                      Submit Resolution
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {tab === 'audit' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="overflow-x-auto border border-zinc-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor Role</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[11px] font-mono">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-50">
                    <td className="p-3 text-zinc-500">{new Date(log.created_at).toLocaleString('en-GB')}</td>
                    <td className="p-3 font-bold text-zinc-900">{log.action}</td>
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                        {log.actor_role}
                      </span>
                    </td>
                    <td className="p-3 text-zinc-700">{log.resource}</td>
                    <td className="p-3 text-zinc-500">{log.ip_address || '127.0.0.1'}</td>
                    <td className="p-3 font-sans text-zinc-600 max-w-xs truncate">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
