import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useBanking } from '../context/BankingContext';
import { CheckCircle2, Download, Share2, X, ShieldCheck } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { activeReceipt, closeReceipt, formatAmount, showToast } = useBanking();

  useEffect(() => {
    if (activeReceipt) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#DB0011', '#168447', '#FFFFFF', '#FFD700']
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [activeReceipt]);

  if (!activeReceipt) return null;

  const handleDownloadPdf = () => {
    window.print();
    showToast('Receipt saved / sent to printer', 'success');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Banking Payment Receipt',
        text: `Payment Receipt: ${activeReceipt.reference} - ${activeReceipt.currency} ${activeReceipt.amount} to ${activeReceipt.counterpartyName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `Premier Banking Receipt:\nRef: ${activeReceipt.reference}\nAmount: ${activeReceipt.currency} ${activeReceipt.amount}\nTo: ${activeReceipt.counterpartyName}\nDate: ${activeReceipt.date || new Date().toISOString()}`
      );
      showToast('Receipt details copied to clipboard', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-zinc-200 animate-in zoom-in-95 duration-200">
        {/* Receipt Header */}
        <div className="bg-[#DB0011] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">Payment Successful</h2>
              <p className="text-[11px] text-white/80">Electronic Funds Transfer Receipt</p>
            </div>
          </div>
          <button
            onClick={closeReceipt}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-5 bg-white text-bank-text print:p-2">
          {/* Amount Display */}
          <div className="text-center pb-4 border-b border-dashed border-zinc-200">
            <span className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Total Amount Paid</span>
            <div className="text-3xl font-extrabold text-bank-text mt-1 tracking-tight">
              {formatAmount(activeReceipt.amount, activeReceipt.currency)}
            </div>
            <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>COMPLETED & SETTLED</span>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Transaction Ref:</span>
              <span className="font-mono font-bold text-zinc-900">{activeReceipt.reference}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Date & Time:</span>
              <span className="font-medium text-zinc-800">
                {activeReceipt.date ? new Date(activeReceipt.date).toLocaleString('en-GB') : new Date().toLocaleString('en-GB')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Sender Account:</span>
              <span className="font-medium text-zinc-800 text-right">
                {activeReceipt.sourceAccountName || 'Premier Savings'}
                <br />
                <span className="text-[11px] text-zinc-500">{activeReceipt.sourceAccountNumber || '•••• 8941'}</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Beneficiary / Merchant:</span>
              <span className="font-bold text-zinc-900 text-right">
                {activeReceipt.counterpartyName}
                {activeReceipt.counterpartyAccount && (
                  <span className="block font-mono text-[11px] font-normal text-zinc-500">
                    Acc: {activeReceipt.counterpartyAccount}
                  </span>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Bank / Network:</span>
              <span className="font-medium text-zinc-800">{activeReceipt.bankName || 'Faster Payments UK'}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Transfer Fee & Tax:</span>
              <span className="font-medium text-emerald-700">
                {activeReceipt.fee > 0 ? formatAmount(activeReceipt.fee, activeReceipt.currency) : '£0.00 (Waived)'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Security Clearance:</span>
              <span className="font-medium text-zinc-700">Cryptographically Verified</span>
            </div>
          </div>

          {/* Watermark / Bank Stamp Box */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-center text-[10px] text-zinc-500">
            <p className="font-semibold text-zinc-700">Official Premier Banking Digital Authorization</p>
            <p>Sort Code: 40-05-15 • BIC: HBUKGB41LHR • Faster Payments Scheme Participant</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 print:hidden">
            <button
              onClick={handleDownloadPdf}
              className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 font-semibold text-zinc-700 flex items-center justify-center gap-1.5 text-xs transition"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 rounded-xl border border-zinc-300 hover:bg-zinc-50 font-semibold text-zinc-700 flex items-center justify-center gap-1.5 text-xs transition"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={closeReceipt}
            className="w-full py-3 rounded-xl bg-[#DB0011] hover:bg-[#B0000D] text-white font-bold text-xs tracking-wide shadow-md transition print:hidden"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
