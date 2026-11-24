import React, { useState } from 'react';
import { Settings, ShieldCheck, Building2, Server, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettingsPage: React.FC = () => {
  const [dailyCeiling, setDailyCeiling] = useState('2500000');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [auditRetentionDays, setAuditRetentionDays] = useState('365');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Operations Console system parameters saved successfully.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
          Operations Console System Settings
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Configure central core banking routing parameters, branch identifiers, and regulatory controls
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-5">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
              Central Branch Operating Entity
            </label>
            <div className="p-3 bg-gray-50 rounded-xl font-bold text-[#252525] border border-[#E8E8E8]">
              The Hongkong and Shanghai Banking Corporation Limited — Mumbai Fort Branch (002)
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                Maximum Daily Transaction Ceiling (INR)
              </label>
              <input
                type="number"
                value={dailyCeiling}
                onChange={e => setDailyCeiling(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">
                Audit Trail Retention
              </label>
              <select
                value={auditRetentionDays}
                onChange={e => setAuditRetentionDays(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
              >
                <option value="365">1 Year (365 Days) — Standard RBI</option>
                <option value="1825">5 Years (1825 Days) — Statutory Archive</option>
                <option value="3650">10 Years — Permanent Compliance</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-[#E8E8E8] flex items-center justify-between">
            <div>
              <div className="font-bold text-[#252525]">Core Banking Maintenance Mode</div>
              <div className="text-[11px] text-[#777777]">Blocks customer client logins while ledger reconciliation is running</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setMaintenanceMode(!maintenanceMode);
                toast.success(maintenanceMode ? 'Maintenance mode disabled' : 'Maintenance mode enabled');
              }}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                maintenanceMode ? 'bg-[#DB0011]' : 'bg-gray-300'
              }`}
            >
              <span className={`block w-4 h-4 bg-white rounded-full transition-transform absolute top-1 ${
                maintenanceMode ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
