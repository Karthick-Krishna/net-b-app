import React, { useState } from 'react';
import { FileCheck2, Search, Filter } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = auditLogs.filter(
    l =>
      l.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.targetCustomerName && l.targetCustomerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Immutable Regulatory Audit Trail
          </h2>
          <p className="text-xs text-slate-400">
            Append-only compliance log tracking all administrative balance mutations and security actions
          </p>
        </div>
      </div>

      <div className="bg-[#1E293B] p-4 rounded-xl border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter audit events by action, reason, customer, or admin..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      <div className="bg-[#1E293B] rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Customer / Account</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Admin Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {filtered.map(log => (
                <tr key={log.logId} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-900/40">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-sans font-semibold">
                    {log.targetCustomerName || log.targetUid}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 max-w-xs">{log.reason}</td>
                  <td className="py-3 px-4 text-slate-400">{log.adminEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
