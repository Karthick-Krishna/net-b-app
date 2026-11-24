import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import { BankAccount } from '../types';
import { api } from '../services/api';
import {
  Building2,
  Download,
  Share2,
  Calendar,
  PlusCircle,
  FileText,
  Shield,
  X,
  CreditCard
} from 'lucide-react';

export const AccountsPage: React.FC = () => {
  const { accounts, formatAmount, selectedAccount, setSelectedAccount, refreshAccounts, showToast } = useBanking();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [statementOpen, setStatementOpen] = useState<boolean>(false);
  const [statementData, setStatementData] = useState<any | null>(null);
  const [loadingStatement, setLoadingStatement] = useState<boolean>(false);
  const [openAccountModal, setOpenAccountModal] = useState<boolean>(false);
  const [newAccType, setNewAccType] = useState<string>('FOREIGN_CURRENCY');
  const [newAccName, setNewAccName] = useState<string>('Multi-Currency Euro Pocket');
  const [newAccCurrency, setNewAccCurrency] = useState<string>('EUR');

  // Filter accounts
  const displayedAccounts = filterType === 'ALL'
    ? accounts
    : accounts.filter(a => a.account_type === filterType);

  const activeAccount = selectedAccount || accounts[0];

  const handleFetchStatement = async (acc: BankAccount) => {
    setLoadingStatement(true);
    try {
      const res = await api.getAccountStatement(acc.id);
      setStatementData(res);
      setStatementOpen(true);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch statement', 'error');
    } finally {
      setLoadingStatement(false);
    }
  };

  const handleShareDetails = (acc: BankAccount) => {
    const details = `Premier Bank UK Details:\nAccount Name: ${acc.account_name}\nAccount Number: ${acc.account_number}\nSort Code: ${acc.sort_code || '40-05-15'}\nSWIFT/BIC: ${acc.ifsc_swift}\nBranch: ${acc.branch_name}`;
    if (navigator.share) {
      navigator.share({ title: acc.account_name, text: details }).catch(() => {});
    } else {
      navigator.clipboard.writeText(details);
      showToast('Account details copied to clipboard', 'success');
    }
  };

  const handleOpenAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.openAccount({
        accountType: newAccType,
        accountName: newAccName,
        currency: newAccCurrency
      });
      showToast('New bank account opened successfully!', 'success');
      setOpenAccountModal(false);
      refreshAccounts();
    } catch (err: any) {
      showToast(err.message || 'Account opening failed', 'error');
    }
  };

  return (
    <div className="p-4 space-y-5 pb-8 animate-in fade-in duration-200">
      {/* Title & Open Account Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-bank-text">Accounts & Balances</h1>
          <p className="text-xs text-bank-muted">Premier International Portfolio</p>
        </div>
        <button
          onClick={() => setOpenAccountModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold shadow-xs transition"
        >
          <PlusCircle size={14} />
          <span>Open Account</span>
        </button>
      </div>

      {/* Account Type Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'ALL', label: 'All Accounts' },
          { id: 'SAVINGS', label: 'Savings' },
          { id: 'CURRENT', label: 'Current' },
          { id: 'SALARY', label: 'Salary' },
          { id: 'FIXED_DEPOSIT', label: 'Fixed Deposits' },
          { id: 'FOREIGN_CURRENCY', label: 'Foreign Currency' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white border border-bank-border text-zinc-600 hover:bg-zinc-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List of Accounts */}
      <div className="space-y-3.5">
        {displayedAccounts.map(acc => {
          const isSelected = activeAccount?.id === acc.id;

          return (
            <div
              key={acc.id}
              className={`bg-white rounded-2xl border transition-all shadow-card overflow-hidden ${
                isSelected ? 'border-[#DB0011] ring-1 ring-[#DB0011]' : 'border-bank-border hover:border-zinc-300'
              }`}
            >
              <div 
                className="p-4 cursor-pointer"
                onClick={() => setSelectedAccount(acc)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DB0011] flex items-center justify-center font-bold shrink-0">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-bank-text leading-tight">{acc.account_name}</h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">{acc.account_number}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-bank-text">
                      {formatAmount(acc.available_balance, acc.currency)}
                    </div>
                    <span className="text-[10px] text-zinc-400">Available</span>
                  </div>
                </div>

                {/* Ledger & Metadata */}
                <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <div>
                    <span>Ledger Balance: </span>
                    <strong className="text-zinc-800 font-medium">{formatAmount(acc.ledger_balance, acc.currency)}</strong>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {acc.status}
                  </span>
                </div>
              </div>

              {/* Account Quick Actions Bar */}
              <div className="bg-zinc-50 px-4 py-2.5 border-t border-zinc-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleFetchStatement(acc)}
                  disabled={loadingStatement}
                  className="flex items-center gap-1 text-zinc-700 hover:text-[#DB0011] font-medium transition"
                >
                  <FileText size={13} />
                  <span>Statements</span>
                </button>

                <button
                  onClick={() => handleShareDetails(acc)}
                  className="flex items-center gap-1 text-zinc-700 hover:text-[#DB0011] font-medium transition"
                >
                  <Share2 size={13} />
                  <span>Share Details</span>
                </button>

                <div className="text-[11px] text-zinc-400 font-mono">
                  SC: {acc.sort_code || '40-05-15'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Details & Routing Metadata */}
      {activeAccount && (
        <div className="bg-white rounded-2xl p-4 border border-bank-border shadow-card space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-bank-muted flex items-center gap-1.5">
            <Shield size={14} className="text-[#DB0011]" />
            <span>Banking Routing & Branch Specifications</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-zinc-500 block text-[10px]">Sort Code</span>
              <span className="font-mono font-bold text-zinc-900 text-sm">{activeAccount.sort_code || '40-05-15'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
              <span className="text-zinc-500 block text-[10px]">SWIFT / BIC</span>
              <span className="font-mono font-bold text-zinc-900 text-sm">{activeAccount.ifsc_swift}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 col-span-2">
              <span className="text-zinc-500 block text-[10px]">Registered Branch</span>
              <span className="font-semibold text-zinc-900">{activeAccount.branch_name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Statement Modal */}
      {statementOpen && statementData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-zinc-200">
            <div className="bg-[#DB0011] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Official Bank Statement</h3>
                <p className="text-[11px] text-white/80">{statementData.account.account_name} ({statementData.account.account_number})</p>
              </div>
              <button onClick={() => setStatementOpen(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Statement Summary Card */}
              <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                <div>
                  <span className="text-zinc-500 text-[10px]">Opening Balance</span>
                  <div className="font-bold text-zinc-900">{formatAmount(statementData.summary.openingBalance, statementData.account.currency)}</div>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px]">Closing Balance</span>
                  <div className="font-bold text-zinc-900">{formatAmount(statementData.summary.closingBalance, statementData.account.currency)}</div>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px]">Total Credits</span>
                  <div className="font-bold text-emerald-700">+{formatAmount(statementData.summary.totalCredits, statementData.account.currency)}</div>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px]">Total Debits</span>
                  <div className="font-bold text-zinc-900">-{formatAmount(statementData.summary.totalDebits, statementData.account.currency)}</div>
                </div>
              </div>

              {/* Transactions in Statement */}
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-800 text-xs">Transactions ({statementData.transactions.length})</h4>
                <div className="divide-y divide-zinc-100 max-h-60 overflow-y-auto border border-zinc-200 rounded-xl p-2 bg-white">
                  {statementData.transactions.map((t: any) => (
                    <div key={t.id} className="py-2 flex items-center justify-between text-[11px]">
                      <div>
                        <div className="font-semibold text-zinc-900">{t.counterparty_name}</div>
                        <div className="text-[10px] text-zinc-500">{new Date(t.created_at).toLocaleDateString('en-GB')} • Ref: {t.reference}</div>
                      </div>
                      <div className="font-bold text-zinc-900">
                        {formatAmount(t.amount, t.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download / Print Official Statement */}
              <button
                onClick={() => {
                  window.print();
                  showToast('Official Statement sent to print / PDF save', 'success');
                }}
                className="w-full py-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Download size={14} />
                <span>Export / Download Stamped PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Open Account Modal */}
      {openAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-5 border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
              <h3 className="font-bold text-sm text-bank-text">Open New Account</h3>
              <button onClick={() => setOpenAccountModal(false)} className="text-zinc-400 hover:text-zinc-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleOpenAccount} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Account Type</label>
                <select
                  value={newAccType}
                  onChange={e => setNewAccType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  <option value="FOREIGN_CURRENCY">Foreign Currency Pocket</option>
                  <option value="SAVINGS">High Yield Savings Account</option>
                  <option value="CURRENT">Everyday Current Account</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Account Name</label>
                <input
                  type="text"
                  value={newAccName}
                  onChange={e => setNewAccName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                  placeholder="e.g. Euro Travel Pocket"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-zinc-700 block mb-1">Currency</label>
                <select
                  value={newAccCurrency}
                  onChange={e => setNewAccCurrency(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 bg-white"
                >
                  <option value="EUR">EUR (€) Euro</option>
                  <option value="USD">USD ($) US Dollar</option>
                  <option value="JPY">JPY (¥) Japanese Yen</option>
                  <option value="CHF">CHF Swiss Franc</option>
                  <option value="GBP">GBP (£) British Pound</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs transition"
                >
                  Confirm & Open Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
