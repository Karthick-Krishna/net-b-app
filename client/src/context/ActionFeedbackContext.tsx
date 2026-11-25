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

const FullscreenResultIcon: React.FC<{ type: FeedbackIconType }> = ({ type }) => {
  const isFreeze = type === 'freeze';
  const strokeColor = isFreeze ? '#1D4ED8' : type === 'key' ? '#DB0011' : '#16864A';
  const ringBg = isFreeze ? 'bg-blue-50 border-blue-200' : type === 'key' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200';

  return (
    <div className={`w-20 h-20 rounded-full border-2 ${ringBg} mx-auto flex items-center justify-center relative`}>
      <svg viewBox="0 0 48 48" className="w-11 h-11" fill="none" aria-hidden="true">
        <motion.circle
          cx="24"
          cy="24"
          r="20"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
        />
        {type === 'freeze' ? (
          <motion.g
            stroke={strokeColor}
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.15 }}
          >
            <line x1="24" y1="13" x2="24" y2="35" />
            <line x1="14.5" y1="18.5" x2="33.5" y2="29.5" />
            <line x1="14.5" y1="29.5" x2="33.5" y2="18.5" />
          </motion.g>
        ) : (
          <motion.path
            d="M15 24.5L21 30.5L33.5 18"
            stroke={strokeColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.28, delay: 0.18, ease: 'easeOut' }}
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

      {/* STEP 2: FULLSCREEN ANIMATION + POPUP UI WITH SUCCESS & RELATED BUTTONS */}
      <AnimatePresence>
        {successConfig && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fullscreen-success-title"
            className="fixed inset-0 z-[100] bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 text-center space-y-5"
            >
              {/* Crisp Animated Vector Seal */}
              <FullscreenResultIcon type={successConfig.icon || 'check'} />

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  <img src="/logo.png" alt="HSBC India" className="w-5 h-5 object-contain" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#777777]">
                    HSBC India Confirmation
                  </span>
                </div>
                <h2 id="fullscreen-success-title" className="text-xl font-bold text-[#1f1f1f]">
                  {successConfig.title}
                </h2>
                <p className="text-sm text-[#333333] leading-relaxed">
                  {successConfig.message}
                </p>
              </div>

              {successConfig.referenceId && (
                <div className="px-3.5 py-2 bg-[#F6F7F9] rounded-lg border border-gray-200/70 inline-block text-[11px] font-mono text-[#555555]">
                  Ref: {successConfig.referenceId}
                </div>
              )}

              {/* Related Action Buttons + Done */}
              <div className="pt-2 space-y-2.5">
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
                        className={`flex-1 min-h-[44px] px-4 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer ${
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
                  className="w-full min-h-[44px] bg-[#DB0011] hover:bg-[#B0000D] text-white text-xs font-semibold rounded-[2px] transition-colors cursor-pointer"
                >
                  Done
                </button>
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
