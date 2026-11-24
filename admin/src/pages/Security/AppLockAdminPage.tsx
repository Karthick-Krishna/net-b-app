import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldAlert,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  X,
  Smartphone,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const AppLockAdminPage: React.FC = () => {
  const { customers, getAppLock, resetAppLock } = useAdminStore();
  const [resetReason, setResetReason] = useState('Customer identity authenticated via branch manager verification');
  const [targetUid, setTargetUid] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleResetLock = async (uid: string) => {
    const res = await resetAppLock(uid, resetReason);
    if (res.success) {
      toast.success('Customer 6-Digit MPIN reset successfully! Customer required to set new MPIN on next login.');
      setTargetUid(null);
    }
  };

  const targetCustomer = customers.find(c => c.uid === targetUid);

  const filteredCustomers = customers.filter(
    c =>
      c.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Customer App-Lock & MPIN Administration
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Administer customer security lockouts, monitor failed attempts, and safely initiate MPIN resets without exposing keys
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-[#16864A] border border-emerald-200 rounded-full text-xs font-bold self-start sm:self-auto">
          HMAC-SHA256 Protected PIN Hashes
        </span>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer name, Customer ID, or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs text-[#252525] placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      {/* Customer Security Cards List */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="divide-y divide-[#E8E8E8]">
          {filteredCustomers.map(c => {
            const sec = getAppLock(c.uid);
            const isLocked = sec.failedAttempts >= 5 || (sec.lockedUntil && new Date(sec.lockedUntil) > new Date());

            return (
              <div
                key={c.uid}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-sm font-bold text-[#252525]">{c.displayName}</h3>
                    <span className="font-mono text-xs text-[#DB0011] font-bold">({c.customerId})</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isLocked
                          ? 'bg-red-100 text-[#DB0011]'
                          : sec.appLockEnabled
                          ? 'bg-emerald-50 text-[#16864A] border border-emerald-200'
                          : 'bg-gray-100 text-[#777777]'
                      }`}
                    >
                      {isLocked ? 'Account Temporarily Locked' : sec.appLockEnabled ? '6-Digit MPIN Active' : 'MPIN Inactive'}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-[#555555] space-y-1">
                    <div>Registered Email: <strong className="text-[#252525]">{c.email}</strong></div>
                    <div>
                      Failed Verification Attempts:{' '}
                      <strong className={sec.failedAttempts > 0 ? 'text-[#DB0011] font-bold' : 'text-[#252525]'}>
                        {sec.failedAttempts}/5 Attempts
                      </strong>
                    </div>
                    {sec.lockedUntil && (
                      <div className="text-[#DB0011] font-bold">
                        Temporarily locked until: {new Date(sec.lockedUntil).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTargetUid(c.uid)}
                    className="px-4 py-2.5 bg-gray-50 hover:bg-red-50 text-[#252525] hover:text-[#DB0011] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#E8E8E8]"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#DB0011]" />
                    <span>Initiate MPIN Reset</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {targetUid && targetCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-[#E8E8E8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
              <div className="flex items-center gap-2 text-[#DB0011]">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-black text-[#252525]">Authorize MPIN Reset</h3>
              </div>
              <button
                onClick={() => setTargetUid(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-3">
              <div className="p-3 bg-red-50 text-[#B0000D] rounded-xl border border-red-200">
                <strong>Zero Knowledge Architecture:</strong> Administrator cannot view customer PINs. This action revokes the existing hash and enforces a new MPIN setup on customer's next login.
              </div>

              <p className="text-[#555555]">
                Target Customer: <strong>{targetCustomer.displayName}</strong> ({targetCustomer.customerId}).
              </p>

              <div>
                <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                  Mandatory Compliance Justification *
                </label>
                <textarea
                  rows={3}
                  value={resetReason}
                  onChange={e => setResetReason(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl text-xs text-[#252525]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E8E8]">
              <button
                type="button"
                onClick={() => setTargetUid(null)}
                className="px-4 py-2 border border-[#E8E8E8] rounded-xl font-bold text-[#777777]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResetLock(targetUid)}
                className="px-5 py-2 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold shadow-xs"
              >
                Authorize & Clear Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
