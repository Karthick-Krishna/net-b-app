import React from 'react';
import { Wallet, Building2, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import { formatINR } from '@shared/utils/formatters';

export const AccountsManagementPage: React.FC = () => {
  const { accounts, totalDepositedVolume } = useAdminStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Bank Account Portfolios
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Supervise all customer savings, business current, and corporate salary accounts
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-[#252525] bg-white px-3.5 py-2 rounded-xl border border-[#E8E8E8] shadow-xs">
          <Building2 className="w-4 h-4 text-[#DB0011]" />
          <span>Mumbai Main Branch, Fort (HQ)</span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Total Managed Balance</span>
          <div className="text-xl font-black text-[#252525] mt-1">{formatINR(totalDepositedVolume)}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Active Account Portfolios</span>
          <div className="text-xl font-black text-[#252525] mt-1">{accounts.length} Accounts</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E8E8E8] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777]">Average Portfolio Size</span>
          <div className="text-xl font-black text-[#252525] mt-1">
            {formatINR(accounts.length ? totalDepositedVolume / accounts.length : 0)}
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#555555]">
            <thead className="bg-[#F9F9F9] text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#E8E8E8] font-bold">
              <tr>
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Managed Balance (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {accounts.map(acc => (
                <tr key={acc.accountId} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#252525]">{acc.accountNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-[#252525]">{acc.customerName}</td>
                  <td className="py-3.5 px-4 text-[#555555]">{acc.accountType}</td>
                  <td className="py-3.5 px-4 text-[#777777]">{acc.branchName}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16864A] border border-emerald-200">
                      {acc.accountStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-sm text-[#252525]">
                    {formatINR(acc.managedBalance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
