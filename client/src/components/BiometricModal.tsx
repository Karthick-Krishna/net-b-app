import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Biometric Authentication',
  subtitle = 'Confirm your identity using Face ID or Fingerprint'
}) => {
  const [status, setStatus] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setStatus('scanning');
      const timer = setTimeout(() => {
        setStatus('success');
        const completeTimer = setTimeout(() => {
          onSuccess();
        }, 700);
        return () => clearTimeout(completeTimer);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center relative border border-zinc-200">
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition"
        >
          <X size={16} />
        </button>

        <div className="mt-2 mb-4 relative">
          {status === 'scanning' ? (
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-[#DB0011] flex items-center justify-center text-[#DB0011] animate-pulse">
              <Fingerprint size={36} className="animate-bounce" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={36} />
            </div>
          )}
        </div>

        <h3 className="text-base font-bold text-bank-text leading-tight">{title}</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-[200px] leading-relaxed">
          {status === 'scanning' ? subtitle : 'Identity Verified Successfully'}
        </p>

        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 mt-4 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <ShieldCheck size={13} />
          <span>FIDO2 / Secure Enclave Protected</span>
        </div>
      </div>
    </div>
  );
};
