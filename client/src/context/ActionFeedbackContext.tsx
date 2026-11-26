import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { ModalDialog } from '../components/common/ModalDialog';

export interface RelatedActionButton {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

export type FeedbackIconType = 'check' | 'freeze' | 'unlock' | 'shield' | 'key';

export interface SuccessOverlayConfig {
  title: string;
  message: string;
  icon?: FeedbackIconType;
  referenceId?: string;
  relatedButtons?: RelatedActionButton[];
}

export interface ConfirmActionConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'neutral';
  onConfirm: () => Promise<SuccessOverlayConfig | void> | SuccessOverlayConfig | void;
  successTitle?: string;
  successMessage?: string;
  successIcon?: FeedbackIconType;
  referenceId?: string;
  relatedButtons?: RelatedActionButton[];
}

interface ActionFeedbackContextType {
  requestAction: (config: ConfirmActionConfig) => void;
  showSuccess: (config: SuccessOverlayConfig) => void;
  closeFeedback: () => void;
}

const ActionFeedbackContext = createContext<ActionFeedbackContextType | undefined>(undefined);

const ExecutiveStatusBadge: React.FC<{ type: FeedbackIconType }> = ({ type }) => {
  const isFreeze = type === 'freeze';
  const isKey = type === 'key';
  const strokeColor = isFreeze ? '#1E3A8A' : isKey ? '#DB0011' : '#166534';
  const boxStyle = isFreeze
    ? 'bg-slate-50 border-slate-200'
    : isKey
    ? 'bg-red-50/70 border-red-200'
    : 'bg-emerald-50/70 border-emerald-200';

  return (
    <div className={`w-12 h-12 rounded-[2px] border ${boxStyle} flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" aria-hidden="true">
        {type === 'freeze' ? (
          <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="4.5" y1="7.5" x2="19.5" y2="16.5" />
            <line x1="4.5" y1="16.5" x2="19.5" y2="7.5" />
          </g>
        ) : (
          <motion.path
            d="M5 12.5L9.5 17L19 7.5"
            stroke={strokeColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          />
        )}
      </svg>
    </div>
  );
};

export const ActionFeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confirmConfig, setConfirmConfig] = useState<ConfirmActionConfig | null>(null);
  const [successConfig, setSuccessConfig] = useState<SuccessOverlayConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const requestAction = (config: ConfirmActionConfig) => {
    setConfirmConfig(config);
  };

  const showSuccess = (config: SuccessOverlayConfig) => {
    setConfirmConfig(null);
    setSuccessConfig(config);
  };

  const closeFeedback = () => {
    setConfirmConfig(null);
    setSuccessConfig(null);
  };

  const handleConfirm = async () => {
    if (!confirmConfig || isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await confirmConfig.onConfirm();
      const resolved: SuccessOverlayConfig = result || {
        title: confirmConfig.successTitle || 'Action Completed',
        message: confirmConfig.successMessage || 'Your request has been processed securely.',
        icon: confirmConfig.successIcon || 'check',
        referenceId: confirmConfig.referenceId || `HSBC/${Date.now().toString().slice(-6)}`,
        relatedButtons: confirmConfig.relatedButtons,
      };
      setConfirmConfig(null);
      setSuccessConfig(resolved);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ActionFeedbackContext.Provider value={{ requestAction, showSuccess, closeFeedback }}>
      {children}

      {/* STEP 1: CONFIRMATION DIALOG */}
      <ModalDialog
        open={!!confirmConfig}
        onClose={() => !isProcessing && setConfirmConfig(null)}
        title={confirmConfig?.title || 'Confirm Action'}
        maxWidthClass="max-w-sm"
      >
        {confirmConfig && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-[#F6F7F9] rounded-xl border border-gray-200/70">
              {confirmConfig.tone === 'danger' ? (
                <AlertTriangle className="w-5 h-5 text-[#DB0011] shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#16864A] shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <p className="text-xs text-[#333333] leading-relaxed">
                {confirmConfig.message}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => setConfirmConfig(null)}
                className="min-h-[42px] px-4 bg-white hover:bg-gray-50 border border-[#333333] text-[#1f1f1f] text-xs font-semibold rounded-[2px] cursor-pointer"
              >
                {confirmConfig.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirm}
                className="min-h-[42px] px-5 bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold rounded-[2px] cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : confirmConfig.confirmLabel || 'Yes, Confirm'}
              </button>
            </div>
          </div>
        )}
      </ModalDialog>

      {/* STEP 2: EXECUTIVE HSBC COMPLETION SHEET */}
      <AnimatePresence>
        {successConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fullscreen-success-title"
            className="fixed inset-0 z-[100] bg-slate-950/70 backdrop-blur-[2px] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="w-full max-w-md bg-white rounded-[2px] shadow-2xl border border-gray-200 border-t-[3px] border-t-[#DB0011] overflow-hidden text-left"
            >
              {/* Institutional Header Strip */}
              <div className="px-6 py-3.5 bg-[#F8F9FA] border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="HSBC India" className="w-4 h-4 object-contain" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#555555]">
                    HSBC India · Security &amp; Account Services
                  </span>
                </div>
                {successConfig.referenceId && (
                  <span className="text-[10px] font-mono text-[#555555]">
                    {successConfig.referenceId}
                  </span>
                )}
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <ExecutiveStatusBadge type={successConfig.icon || 'check'} />
                  <div className="min-w-0 flex-1">
                    <h2 id="fullscreen-success-title" className="text-lg font-bold text-[#1f1f1f] tracking-tight">
                      {successConfig.title}
                    </h2>
                    <p className="text-xs text-[#444444] leading-relaxed mt-1">
                      {successConfig.message}
                    </p>
                  </div>
                </div>

                {/* Related Action Buttons + Done */}
                <div className="pt-2 border-t border-gray-100 space-y-2.5">
                  {successConfig.relatedButtons && successConfig.relatedButtons.length > 0 && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      {successConfig.relatedButtons.map((btn, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSuccessConfig(null);
                            btn.onClick();
                          }}
                          className={`flex-1 min-h-[42px] px-4 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
                            btn.variant === 'danger'
                              ? 'bg-red-50 text-[#DB0011] border border-[#DB0011] hover:bg-red-100'
                              : btn.variant === 'primary'
                              ? 'bg-[#1f1f1f] text-white hover:bg-black'
                              : 'bg-white text-[#1f1f1f] border border-[#333333] hover:bg-gray-50'
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setSuccessConfig(null)}
                    className="w-full min-h-[42px] bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ActionFeedbackContext.Provider>
  );
};

export const useActionFeedback = () => {
  const ctx = useContext(ActionFeedbackContext);
  if (!ctx) throw new Error('useActionFeedback must be used within ActionFeedbackProvider');
  return ctx;
};
