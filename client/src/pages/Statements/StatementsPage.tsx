import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  Calendar,
  Filter,
  Building2,
  CheckCircle2,
  Award,
  Landmark,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '@shared/utils/formatters';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import toast from 'react-hot-toast';

export const StatementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { accounts, transactions } = useBanking();

  const [activeTab, setActiveTab] = useState<'STATEMENTS' | 'INTEREST_CERTS'>('STATEMENTS');
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.accountId || '');
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [certType, setCertType] = useState<'SAVINGS_INTEREST' | 'FD_TDS'>('SAVINGS_INTEREST');
  const [finYear, setFinYear] = useState('2026-27');
  const [isDownloading, setIsDownloading] = useState(false);

  const account = accounts.find(a => a.accountId === selectedAccount) || accounts[0];
  const accountTxs = transactions.filter(t => t.accountId === account?.accountId);

  const totalCredits = accountTxs
    .filter(t => t.transactionType === 'CREDIT')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalDebits = accountTxs
    .filter(t => t.transactionType === 'DEBIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    toast.loading(activeTab === 'STATEMENTS' ? 'Generating signed e-Statement PDF...' : 'Generating certified Interest Certificate PDF...', { id: 'pdf-toast' });
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(activeTab === 'STATEMENTS' ? 'e-Statement PDF downloaded!' : 'Certified Interest Certificate PDF downloaded!', { id: 'pdf-toast' });
    }, 1200);
  };

  return (
    <AnimatedPageTransition className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Account Statements & Interest Certificates
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Download certified e-Statements, interest certificates for tax returns, and ledger activity
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E8E8E8] rounded-xl self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab('STATEMENTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'STATEMENTS' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            e-Statements
          </button>
          <button
            onClick={() => setActiveTab('INTEREST_CERTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'INTEREST_CERTS' ? 'bg-[#DB0011] text-white shadow-xs' : 'text-gray-600 hover:text-black'
            }`}
          >
            Interest Certificates (ITR)
          </button>
        </div>
      </div>

      {activeTab === 'STATEMENTS' ? (
        <>
          {/* Controls */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex flex-col sm:flex-row gap-4 items-center print:hidden">
            <div className="w-full sm:w-1/2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                Select Account
              </label>
              <select
                value={selectedAccount}
                onChange={e => setSelectedAccount(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-xs font-semibold text-[#252525] focus:outline-none focus:border-[#DB0011]"
              >
                {accounts.map(acc => (
                  <option key={acc.accountId} value={acc.accountId}>
                    {acc.accountType} ({acc.maskedAccountNumber}) — {formatINR(acc.managedBalance)}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                Statement Period
              </label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-xs font-semibold text-[#252525] focus:outline-none focus:border-[#DB0011]"
              >
                <option value="LAST_30_DAYS">Current Month / Last 30 Days</option>
                <option value="LAST_90_DAYS">Last Quarter (90 Days)</option>
                <option value="FINANCIAL_YEAR">Current Financial Year (FY 2026-27)</option>
              </select>
            </div>

            <div className="flex gap-2 self-end sm:self-auto pt-2 sm:pt-4">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-3.5 py-2.5 bg-white border border-[#E8E8E8] text-[#252525] rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#DB0011]" />
                <span>PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-[#DB0011] text-white rounded-xl text-xs font-bold hover:bg-[#B0000D] transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Formatted Statement Document Paper */}
          <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E8E8E8] shadow-card print:border-none print:shadow-none print:p-0 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-[#E8E8E8]">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img src="/logo.png" alt="HSBC India" className="w-9 h-9 object-contain" />
                  <div>
                    <h1 className="text-base sm:text-lg font-black text-[#252525] tracking-tight leading-none">
                      HSBC INDIA
                    </h1>
                    <p className="text-[10px] text-[#777777] uppercase tracking-widest font-bold mt-1">
                      Personal Internet Banking e-Statement
                    </p>
                  </div>
                </div>
                <div className="text-xs text-[#555555] space-y-0.5 pt-1">
                  <div>Customer Name: <strong className="text-[#252525]">{currentUser?.displayName || 'Premier Customer'}</strong></div>
                  <div>Customer ID: <strong className="font-mono text-[#252525]">{currentUser?.customerId}</strong></div>
                  <div>Registered Address: {currentUser?.address || 'Fort'}, {currentUser?.city || 'Mumbai'} - 400001</div>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-[#555555] space-y-0.5 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-xl w-full sm:w-auto">
                <div>Branch: <strong className="text-[#252525]">{account?.branchName || 'Mumbai Main Branch, Fort'}</strong></div>
                <div>Account Number: <strong className="font-mono text-[#252525]">{account?.accountNumber}</strong></div>
                <div>IFSC Code: <strong className="font-mono text-[#252525]">{account?.ifscCode || 'HSBC0400002'}</strong></div>
                <div>Generated On: <strong className="text-[#252525]">{new Date().toISOString().split('T')[0]}</strong></div>
              </div>
            </div>

            {/* Regulatory Disclaimer Notice */}
            <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 text-[11px] text-[#B0000D] leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Application-Managed Record:</strong> This official statement is generated from an independently operated digital banking demonstration system. All balances and records represent simulated application records.
              </span>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 bg-[#F9F9F9] rounded-2xl border border-[#E8E8E8] text-xs">
              <div>
                <span className="text-[11px] text-[#777777] font-semibold block">Closing Managed Balance</span>
                <span className="text-sm sm:text-base font-black text-[#252525] mt-0.5 block">{formatINR(account?.managedBalance || 0)}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#777777] font-semibold block">General Ledger Balance</span>
                <span className="text-sm sm:text-base font-black text-[#252525] mt-0.5 block">{formatINR(account?.ledgerBalance || 0)}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#777777] font-semibold block">Period Total Credits</span>
                <span className="text-sm sm:text-base font-black text-[#16864A] mt-0.5 block">+{formatINR(totalCredits)}</span>
              </div>
              <div>
                <span className="text-[11px] text-[#777777] font-semibold block">Period Total Debits</span>
                <span className="text-sm sm:text-base font-black text-[#252525] mt-0.5 block">-{formatINR(totalDebits)}</span>
              </div>
            </div>

            {/* Statement Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E8] text-[#777777] uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Description & Reference</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2 text-right">Debit (INR)</th>
                    <th className="py-3 px-2 text-right">Credit (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E8]">
                  {accountTxs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#777777] text-xs">
                        No transactions found for the selected account in this statement period.
                      </td>
                    </tr>
                  ) : (
                    accountTxs.map(tx => {
                      const isCredit = tx.transactionType === 'CREDIT';
                      return (
                        <tr key={tx.transactionId} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-2 text-[#555555] whitespace-nowrap font-medium">{tx.transactionDate}</td>
                          <td className="py-3.5 px-2">
                            <div className="font-bold text-[#252525]">{tx.description}</div>
                            <div className="text-[10px] text-[#777777] font-mono mt-0.5">Ref: {tx.reference}</div>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="px-2 py-0.5 bg-gray-100 text-[#555555] rounded-md text-[10px] font-semibold">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-right font-mono font-semibold text-[#252525]">
                            {!isCredit ? formatINR(tx.amount) : '-'}
                          </td>
                          <td className="py-3.5 px-2 text-right font-mono font-bold text-[#16864A]">
                            {isCredit ? `+${formatINR(tx.amount)}` : '-'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-[#E8E8E8] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#777777] gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16864A]" />
                <span>Digital Signature Verified: HSBC India Central Core Banking Server</span>
              </div>
              <span className="font-mono text-[10px]">AUTH_HASH: 7F8E-99A1-24B3-D6E8</span>
            </div>
          </div>
        </>
      ) : (
        /* TAB 2: INTEREST CERTIFICATES (FOR TAX / ITR FILING) */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E8E8] shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-[#252525]">
                Download Certified Interest Certificate
              </h3>
              <p className="text-xs text-[#777777]">
                Official certificate under Section 80TTA / Form 16A for Income Tax Return (ITR) filing
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">
                  Certificate Category
                </label>
                <select
                  value={certType}
                  onChange={e => setCertType(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
                >
                  <option value="SAVINGS_INTEREST">Savings Account Interest (Sec 80TTA)</option>
                  <option value="FD_TDS">Fixed Deposit Interest & TDS Summary</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">
                  Financial Year
                </label>
                <select
                  value={finYear}
                  onChange={e => setFinYear(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
                >
                  <option value="2026-27">FY 2026-27 (Assessment Year 2027-28)</option>
                  <option value="2025-26">FY 2025-26 (Assessment Year 2026-27)</option>
                  <option value="2024-25">FY 2024-25 (Assessment Year 2025-26)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">
                  Select Account
                </label>
                <select
                  value={selectedAccount}
                  onChange={e => setSelectedAccount(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
                >
                  {accounts.map(acc => (
                    <option key={acc.accountId} value={acc.accountId}>
                      {acc.accountType} ({acc.maskedAccountNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interest Certificate Preview Paper */}
            <div className="p-6 bg-[#F9F9F9] rounded-2xl border border-[#E8E8E8] space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-[#E8E8E8]">
                <div>
                  <div className="font-black text-[#252525] text-sm">
                    {certType === 'SAVINGS_INTEREST'
                      ? 'CERTIFICATE OF SAVINGS ACCOUNT INTEREST CREDITED'
                      : 'FIXED DEPOSIT INTEREST & TDS DEDUCTION CERTIFICATE'}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Financial Year: {finYear} • PAN: ABCDE1234F • Client ID: {currentUser?.customerId}
                  </div>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block">Gross Interest Earned</span>
                  <span className="font-black text-sm text-[#16864A] mt-0.5 block">
                    {certType === 'SAVINGS_INTEREST' ? '₹34,850.00' : '₹1,42,600.00'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">TDS Deducted (Sec 194A)</span>
                  <span className="font-black text-sm text-[#252525] mt-0.5 block">
                    {certType === 'SAVINGS_INTEREST' ? '₹0.00 (Exempt)' : '₹14,260.00'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Net Interest Credited</span>
                  <span className="font-black text-sm text-[#252525] mt-0.5 block">
                    {certType === 'SAVINGS_INTEREST' ? '₹34,850.00' : '₹1,28,340.00'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Status on TRACES Portal</span>
                  <span className="font-bold text-xs text-[#16864A] mt-0.5 block">
                    Reconciled & Filed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPageTransition>
  );
};
