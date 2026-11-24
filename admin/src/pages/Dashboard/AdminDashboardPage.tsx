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
  Building2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { formatINR } from '@shared/utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    totalCustomersCount,
    totalManagedAccountsCount,
    totalDepositedVolume,
    auditLogs,
    transactions,
  } = useAdminStore();

  const recentAudit = auditLogs.slice(0, 5);
  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Title & Branch status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Operations Executive Overview
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Live metrics, customer accounts, and real-time administrative ledger overrides
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-[#16864A] border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16864A] animate-pulse" />
            Core Banking Online
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] text-[#777777] font-bold uppercase tracking-wider">
                Total Managed Volume
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#252525] mt-1">
                {formatINR(totalDepositedVolume)}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#777777] mt-3 flex items-center gap-1">
            <span className="text-[#16864A] font-bold">100%</span> Real-Time Synchronized
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] text-[#777777] font-bold uppercase tracking-wider">
                Active Customers
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#252525] mt-1">
                {totalCustomersCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#777777] mt-3">
            KYC Verified Premier Clients
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] text-[#777777] font-bold uppercase tracking-wider">
                Bank Accounts
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#252525] mt-1">
                {totalManagedAccountsCount}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16864A] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#777777] mt-3">
            Savings, Current, Salary Portfolios
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] text-[#777777] font-bold uppercase tracking-wider">
                Audit Trail Logs
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#252525] mt-1">
                {auditLogs.length}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[11px] text-[#777777] mt-3">
            Immutable Regulatory History
          </div>
        </div>
      </div>

      {/* Quick Operations Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/balances')}
          className="p-5 bg-white rounded-2xl border-2 border-[#DB0011] text-left hover:shadow-md transition-all group"
        >
          <div className="text-[11px] font-bold text-[#DB0011] uppercase tracking-wider flex items-center justify-between">
            <span>Primary Core Action</span>
            <ArrowRight className="w-4 h-4 text-[#DB0011] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-black text-[#252525] mt-1">Adjust Customer Balance</h3>
          <p className="text-xs text-[#777777] mt-1">
            Choose customer account, set managed balance with live diff preview and mandatory audit justification.
          </p>
        </button>

        <button
          onClick={() => navigate('/transactions')}
          className="p-5 bg-white rounded-2xl border border-[#E8E8E8] hover:border-gray-400 text-left hover:shadow-md transition-all group"
        >
          <div className="text-[11px] font-bold text-[#777777] uppercase tracking-wider flex items-center justify-between">
            <span>Ledger Injection</span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-black text-[#252525] mt-1">Create Debit/Credit Record</h3>
          <p className="text-xs text-[#777777] mt-1">
            Inject audited credit or debit with reference number and automated balance recalculation.
          </p>
        </button>

        <button
          onClick={() => navigate('/security')}
          className="p-5 bg-white rounded-2xl border border-[#E8E8E8] hover:border-gray-400 text-left hover:shadow-md transition-all group"
        >
          <div className="text-[11px] font-bold text-[#777777] uppercase tracking-wider flex items-center justify-between">
            <span>Security Controls</span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-black text-[#252525] mt-1">App-Lock & Credential Resets</h3>
          <p className="text-xs text-[#777777] mt-1">
            Review customer lockouts and safely initiate PIN resets without exposing raw secret keys.
          </p>
        </button>
      </div>

      {/* Two Column Section: Live Transactions & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Transaction Stream */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
            <h3 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Live Transaction Stream
            </h3>
            <button
              onClick={() => navigate('/transactions')}
              className="text-xs text-[#DB0011] hover:underline font-bold"
            >
              View Full Manager →
            </button>
          </div>

          <div className="divide-y divide-[#E8E8E8]">
            {recentTxs.map(tx => {
              const isCredit = tx.transactionType === 'CREDIT';
              return (
                <div key={tx.transactionId} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCredit ? 'bg-emerald-50 text-[#16864A]' : 'bg-red-50 text-[#DB0011]'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#252525]">{tx.description}</div>
                      <div className="text-[10px] text-[#777777] font-mono">
                        {tx.counterpartyName} • Ref: {tx.reference}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold font-mono ${isCredit ? 'text-[#16864A]' : 'text-[#252525]'}`}>
                      {isCredit ? '+' : '-'} {formatINR(tx.amount)}
                    </div>
                    <div className="text-[10px] text-[#777777]">{tx.transactionDate}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Audit Events */}
        <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#E8E8E8]">
            <h3 className="text-xs font-bold text-[#252525] uppercase tracking-wider">
              Recent Regulatory Audit Events
            </h3>
            <button
              onClick={() => navigate('/audit-logs')}
              className="text-xs text-[#DB0011] hover:underline font-bold"
            >
              Full Audit Trail →
            </button>
          </div>

          <div className="divide-y divide-[#E8E8E8]">
            {recentAudit.map(log => (
              <div key={log.logId} className="py-3 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-[#DB0011] border border-red-200">
                      {log.action}
                    </span>
                    <div className="text-xs text-[#252525] mt-1 font-semibold">{log.reason}</div>
                    <div className="text-[10px] text-[#777777] mt-0.5">
                      Target: {log.targetCustomerName || log.targetUid} • By: {log.adminEmail}
                    </div>
                  </div>
                  <div className="text-[10px] text-[#777777] font-mono">
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
