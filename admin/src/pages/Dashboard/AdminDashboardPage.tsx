import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Wallet,
  DollarSign,
  FileCheck2,
  ArrowRight,
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    totalCustomersCount,
    totalManagedAccountsCount,
    totalDepositedVolume,
    auditLogs,
    transactions,
    formatCurrency,
  } = useAdminStore();

  const recentAudit = auditLogs.slice(0, 5);
  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Executive Operations Overview
        </h2>
        <p className="text-xs text-slate-400">
          Live KPIs, customer portfolios, and active administrative ledger controls
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Portfolio Balance</div>
              <div className="text-2xl font-extrabold text-white mt-1">
                {formatCurrency(totalDepositedVolume, 'INR')}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-950/50 text-[#DB0011] flex items-center justify-center border border-red-900/40">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">100%</span> Managed Real-Time
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Customers</div>
              <div className="text-2xl font-extrabold text-white mt-1">{totalCustomersCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-950/50 text-blue-400 flex items-center justify-center border border-blue-900/40">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">Verified KYC Premier Clients</div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Bank Accounts</div>
              <div className="text-2xl font-extrabold text-white mt-1">{totalManagedAccountsCount}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-950/50 text-emerald-400 flex items-center justify-center border border-emerald-900/40">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">Savings, Current, Salary</div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Audit Log Stream</div>
              <div className="text-2xl font-extrabold text-white mt-1">{auditLogs.length}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-950/50 text-purple-400 flex items-center justify-center border border-purple-900/40">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">Immutable Financial Trail</div>
        </div>
      </div>

      {/* Quick Operations Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/balances')}
          className="p-5 bg-gradient-to-r from-red-900/60 to-red-950/80 rounded-2xl border border-red-800/60 text-left hover:scale-[1.01] transition-transform group shadow-md"
        >
          <div className="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center justify-between">
            <span>Primary Control</span>
            <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white mt-1">Adjust Customer Balance</h3>
          <p className="text-xs text-slate-300 mt-1">
            Search customer, choose account, enter managed balance and mandatory audit reason.
          </p>
        </button>

        <button
          onClick={() => navigate('/transactions')}
          className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border border-slate-700 text-left hover:scale-[1.01] transition-transform group shadow-md"
        >
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Manual Injection</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white mt-1">Create Debit/Credit Record</h3>
          <p className="text-xs text-slate-400 mt-1">
            Inject audited credit or debit with reference and automatic balance adjustment.
          </p>
        </button>

        <button
          onClick={() => navigate('/security')}
          className="p-5 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl border border-slate-700 text-left hover:scale-[1.01] transition-transform group shadow-md"
        >
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Security Operations</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-white mt-1">App-Lock & Credential Resets</h3>
          <p className="text-xs text-slate-400 mt-1">
            Review customer lockouts and safely initiate PIN resets without exposing keys.
          </p>
        </button>
      </div>

      {/* Two Column Section: Live Transactions & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Transaction Monitoring */}
        <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Live Transaction Stream
            </h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs text-[#DB0011] hover:underline font-semibold"
            >
              View Full Manager
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {recentTxs.map(tx => {
              const isCredit = tx.transactionType === 'CREDIT';
              return (
                <div key={tx.transactionId} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCredit ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{tx.description}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {tx.counterpartyName} • Ref: {tx.reference}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${isCredit ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {isCredit ? '+' : '-'} {formatCurrency(tx.amount, tx.currency)}
                    </div>
                    <div className="text-[9px] text-slate-500">{tx.transactionDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Events */}
        <div className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent Audit Log Events
            </h3>
            <button
              onClick={() => navigate('/audit-logs')}
              className="text-xs text-[#DB0011] hover:underline font-semibold"
            >
              Full Audit Trail
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {recentAudit.map(log => (
              <div key={log.logId} className="py-3 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-red-400 border border-slate-700">
                      {log.action}
                    </span>
                    <div className="text-xs text-slate-300 mt-1 font-medium">{log.reason}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: {log.targetCustomerName || log.targetUid} • By: {log.adminEmail}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
