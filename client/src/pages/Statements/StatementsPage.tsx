import React, { useState } from 'react';
import {
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '@shared/utils/formatters';
import { AnimatedPageTransition } from '../../components/AnimatedPageTransition';
import {
  downloadInterestCertificateHtml,
  downloadStatementCsv,
  downloadStatementHtml,
} from '../../utils/downloadHelper';
import toast from 'react-hot-toast';

export const StatementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { accounts, transactions } = useBanking();

  const [activeTab, setActiveTab] = useState<'STATEMENTS' | 'INTEREST_CERTS'>('STATEMENTS');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [dateRange, setDateRange] = useState('LAST_30_DAYS');
  const [certType, setCertType] = useState<'SAVINGS_INTEREST' | 'FD_TDS'>('SAVINGS_INTEREST');
  const [finYear, setFinYear] = useState('2026-27');
  const [isDownloading, setIsDownloading] = useState(false);

  const account = accounts.find(a => a.accountId === selectedAccount) || accounts[0];
  const accountTxs = transactions.filter(t => t.accountId === account?.accountId);

  const totalCredits = accountTxs.filter(t => t.transactionType === 'CREDIT').reduce((acc, t) => acc + t.amount, 0);
  const totalDebits = accountTxs.filter(t => t.transactionType === 'DEBIT').reduce((acc, t) => acc + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadStatement = (format: 'HTML' | 'CSV' = 'HTML') => {
    setIsDownloading(true);
    try {
      if (activeTab === 'STATEMENTS') {
        if (format === 'CSV') {
          downloadStatementCsv(account, accountTxs);
          toast.success('Statement CSV downloaded');
        } else {
          downloadStatementHtml({
            customerName: currentUser?.displayName || 'Karthick Krishna',
            customerId: currentUser?.customerId || 'HSBC-882941',
            account,
            dateRangeLabel: dateRange.replace(/_/g, ' '),
            txs: accountTxs,
            totalCredits,
            totalDebits,
          });
          toast.success('Certified e-Statement downloaded');
        }
      } else {
        downloadInterestCertificateHtml({
          customerName: currentUser?.displayName || 'Karthick Krishna',
          customerId: currentUser?.customerId || 'HSBC-882941',
          certType,
          finYear,
          account,
        });
        toast.success('Interest Certificate downloaded');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatedPageTransition className="pb-10">
      <div className="bg-white md:rounded-2xl md:border md:border-gray-200/80 md:shadow-xs overflow-hidden">
        {/* Header + Cards-Style Underline Sub-Tabs */}
        <div className="px-4 sm:px-6 md:px-8 pt-5 border-b border-gray-200 print:hidden">
          <h1 className="text-[19px] sm:text-[22px] font-bold text-[#1f1f1f] tracking-tight">
            Statements &amp; Tax Certificates
          </h1>
          <p className="text-xs text-[#777777] mt-0.5">
            Download certified e-Statements and Section 80TTA / Form 16A certificates
          </p>

          <div className="mt-4 flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'STATEMENTS' as const, label: 'e-Statements' },
              { id: 'INTEREST_CERTS' as const, label: 'Interest Certificates (ITR)' },
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 min-h-[40px] text-[13px] sm:text-[14px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active ? 'text-[#1f1f1f]' : 'text-[#777777] hover:text-[#1f1f1f]'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#DB0011] rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
          {activeTab === 'STATEMENTS' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end print:hidden">
                <div className="md:col-span-5">
                  <label htmlFor="stmt-acc" className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                    Select Account
                  </label>
                  <select
                    id="stmt-acc"
                    value={account?.accountId || ''}
                    onChange={e => setSelectedAccount(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    {accounts.map(acc => (
                      <option key={acc.accountId} value={acc.accountId}>
                        {acc.accountType} ({acc.maskedAccountNumber}) — {formatINR(acc.managedBalance)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="stmt-period" className="block text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-1.5">
                    Statement Period
                  </label>
                  <select
                    id="stmt-period"
                    value={dateRange}
                    onChange={e => setDateRange(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="LAST_30_DAYS">Last 30 Days</option>
                    <option value="LAST_90_DAYS">Last Quarter (90 Days)</option>
                    <option value="FINANCIAL_YEAR">FY 2026-27</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadStatement('HTML')}
                    disabled={isDownloading}
                    className="flex-1 min-h-[44px] px-3 bg-white border border-gray-300 text-[#1f1f1f] rounded-full text-xs font-semibold hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#DB0011]" aria-hidden="true" />
                    <span>Statement</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadStatement('CSV')}
                    disabled={isDownloading}
                    className="min-h-[44px] px-3.5 bg-[#F5F6F8] hover:bg-[#EBECEF] text-[#1f1f1f] rounded-full text-xs font-semibold active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
                  >
                    CSV
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="min-h-[44px] px-4 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Statement Paper */}
              <div className="p-4 sm:p-6 bg-[#F9FAFB] rounded-xl border border-gray-200 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2.5">
                    <img src="/logo.png" alt="HSBC India" className="w-8 h-8 object-contain" />
                    <div>
                      <div className="text-sm font-bold text-[#1f1f1f]">HSBC INDIA e-Statement</div>
                      <div className="text-[11px] text-[#777777]">
                        {currentUser?.displayName} • {currentUser?.customerId}
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-[11px] text-[#555555]">
                    <div>A/C: <strong className="font-mono text-[#1f1f1f]">{account?.accountNumber}</strong></div>
                    <div>IFSC: <strong className="font-mono text-[#1f1f1f]">{account?.ifscCode}</strong></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="text-[10px] text-[#777777] block">Closing Balance</span>
                    <span className="font-bold text-[#1f1f1f]">{formatINR(account?.managedBalance || 0)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="text-[10px] text-[#777777] block">Ledger Balance</span>
                    <span className="font-bold text-[#1f1f1f]">{formatINR(account?.ledgerBalance || 0)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="text-[10px] text-[#777777] block">Total Credits</span>
                    <span className="font-bold text-[#16864A]">+{formatINR(totalCredits)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="text-[10px] text-[#777777] block">Total Debits</span>
                    <span className="font-bold text-[#1f1f1f]">-{formatINR(totalDebits)}</span>
                  </div>
                </div>

                {/* Responsive Ledger Table */}
                <div className="overflow-x-auto bg-white rounded-xl border border-gray-200" tabIndex={0} role="region" aria-label="Account statement ledger">
                  <table className="w-full text-left text-xs min-w-[540px]">
                    <thead>
                      <tr className="border-b border-gray-200 text-[#777777] uppercase text-[10px] font-bold bg-[#F6F7F9]">
                        <th className="py-3 px-3">Date</th>
                        <th className="py-3 px-3">Description</th>
                        <th className="py-3 px-3 text-right">Debit</th>
                        <th className="py-3 px-3 text-right">Credit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {accountTxs.map(tx => {
                        const isCredit = tx.transactionType === 'CREDIT';
                        return (
                          <tr key={tx.transactionId}>
                            <td className="py-3 px-3 text-[#555555] whitespace-nowrap">{tx.transactionDate}</td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-[#1f1f1f]">{tx.description}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{tx.reference}</div>
                            </td>
                            <td className="py-3 px-3 text-right font-mono">{!isCredit ? formatINR(tx.amount) : '-'}</td>
                            <td className="py-3 px-3 text-right font-mono font-bold text-[#16864A]">{isCredit ? `+${formatINR(tx.amount)}` : '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#777777]">
                  <CheckCircle2 className="w-4 h-4 text-[#16864A] shrink-0" aria-hidden="true" />
                  <span>Digitally Signed HSBC India Banking Statement Record</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label htmlFor="cert-type" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Certificate Type</label>
                  <select
                    id="cert-type"
                    value={certType}
                    onChange={e => setCertType(e.target.value as any)}
                    className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="SAVINGS_INTEREST">Savings Interest (Sec 80TTA)</option>
                    <option value="FD_TDS">FD Interest &amp; TDS (Form 16A)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cert-fy" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Financial Year</label>
                  <select
                    id="cert-fy"
                    value={finYear}
                    onChange={e => setFinYear(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold"
                  >
                    <option value="2026-27">FY 2026-27</option>
                    <option value="2025-26">FY 2025-26</option>
                    <option value="2024-25">FY 2024-25</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cert-acc" className="font-bold text-[#777777] uppercase text-[10px] block mb-1.5">Account</label>
                  <select
                    id="cert-acc"
                    value={account?.accountId || ''}
                    onChange={e => setSelectedAccount(e.target.value)}
                    className="w-full h-11 px-3 bg-[#F6F7F9] border border-gray-200 rounded-xl font-semibold"
                  >
                    {accounts.map(acc => (
                      <option key={acc.accountId} value={acc.accountId}>
                        {acc.accountType} ({acc.maskedAccountNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-5 bg-[#F6F7F9] rounded-2xl border border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 pb-4 border-b border-gray-200">
                  <div>
                    <div className="font-bold text-sm text-[#1f1f1f]">
                      {certType === 'SAVINGS_INTEREST'
                        ? 'SAVINGS ACCOUNT INTEREST CERTIFICATE'
                        : 'FIXED DEPOSIT INTEREST & TDS SUMMARY'}
                    </div>
                    <div className="text-[11px] text-[#777777] mt-0.5">
                      FY {finYear} • PAN: ABCDE1234F • Client ID: {currentUser?.customerId}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadStatement('HTML')}
                    disabled={isDownloading}
                    className="min-h-[40px] px-5 bg-[#DB0011] hover:bg-[#B0000D] active:scale-[0.98] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Download Certificate</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="text-[#777777] block">Gross Interest</span>
                    <span className="font-bold text-[#16864A] text-sm">
                      {certType === 'SAVINGS_INTEREST' ? '₹34,850.00' : '₹1,42,600.00'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="text-[#777777] block">TDS Deducted</span>
                    <span className="font-bold text-[#1f1f1f] text-sm">
                      {certType === 'SAVINGS_INTEREST' ? '₹0.00' : '₹14,260.00'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-gray-200/70">
                    <span className="text-[#777777] block">TRACES Status</span>
                    <span className="font-bold text-[#16864A] text-sm flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Reconciled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedPageTransition>
  );
};
