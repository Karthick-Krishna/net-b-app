import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const AppLockAdminPage: React.FC = () => {
  const { customers, getAppLock, resetAppLock } = useAdminStore();
  const [resetReason, setResetReason] = useState('Customer identity verified via secure banking call');
  const [targetUid, setTargetUid] = useState<string | null>(null);

  const handleResetLock = async (uid: string) => {
    const res = await resetAppLock(uid, resetReason);
    if (res.success) {
      toast.success('Customer App-Lock reset successfully! Audit log created.');
      setTargetUid(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">
          Customer App-Lock & Credential Administration
        </h2>
        <p className="text-xs text-slate-400">
          Administer customer security lockouts and safely initiate credential resets without exposing PIN data
        </p>
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-800">
          {customers.map(c => {
            const sec = getAppLock(c.uid);
            return (
              <div key={c.uid} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{c.displayName}</h3>
                    <span className="font-mono text-xs text-slate-400">({c.customerId})</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sec.appLockEnabled ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {sec.appLockEnabled ? 'PIN Enabled' : 'PIN Inactive'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <div>Email: <strong className="text-slate-300">{c.email}</strong></div>
                    <div>Failed Attempts: <strong className={sec.failedAttempts > 0 ? 'text-red-400' : 'text-slate-300'}>{sec.failedAttempts}/5</strong></div>
                    {sec.lockedUntil && (
                      <div className="text-red-400 font-bold">
                        Temporarily locked until: {new Date(sec.lockedUntil).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTargetUid(c.uid)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Unlock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Initiate Credential Reset</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {targetUid && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-white">
            <h3 className="text-base font-bold text-white">Authorize App-Lock Reset</h3>
            <p className="text-xs text-slate-400">
              This will clear failed attempts, unlock the customer session, and prompt them to establish a fresh PIN.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Mandatory Operational Reason
              </label>
              <textarea
                rows={3}
                value={resetReason}
                onChange={e => setResetReason(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTargetUid(null)}
                className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResetLock(targetUid)}
                className="px-4 py-2 bg-[#DB0011] hover:bg-[#B0000D] rounded-lg text-xs font-bold"
              >
                Confirm & Log Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
