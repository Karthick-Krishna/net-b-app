import React from 'react';
import { Wallet, Building2, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';

export const AccountsManagementPage: React.FC = () => {
  const { accounts, formatCurrency } = useAdminStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Bank Account Portfolios
        </h2>
        <p className="text-xs text-slate-400">
          All client savings, business current, and corporate salary accounts
        </p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Account Number</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Managed Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {accounts.map(acc => (
                <tr key={acc.accountId} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-white font-bold">{acc.accountNumber}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200">{acc.customerName}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{acc.accountType}</td>
                  <td className="py-3 px-4 font-sans text-slate-400">{acc.branchName}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400">
                      {acc.accountStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white text-sm">
                    {formatCurrency(acc.managedBalance, acc.currency)}
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
