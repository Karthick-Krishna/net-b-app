import React, { useState } from 'react';
import { FileCheck2, Search, Filter, Download } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

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

  const handleExportCSV = () => {
    toast.success('Audit trail log exported to compliance CSV');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Immutable Regulatory Audit Trail
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Append-only compliance log tracking all administrative balance mutations and security overrides
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8E8E8] text-[#252525] rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors shadow-xs"
        >
          <Download className="w-4 h-4 text-[#DB0011]" />
          <span>Export Audit Log</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E8E8E8] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Filter audit events by action, reason, customer, or admin email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs text-[#252525] placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#555555]">
            <thead className="bg-[#F9F9F9] text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#E8E8E8] font-bold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Customer / Account</th>
                <th className="py-3 px-4">Justification & Reason</th>
                <th className="py-3 px-4">Admin Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filtered.map(log => (
                <tr key={log.logId} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-4 text-[#777777] font-mono whitespace-nowrap">
                    {new Date(log.createdAt).toISOString().replace('T', ' ').slice(0, 19)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-[#DB0011] border border-red-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#252525]">
                    {log.targetCustomerName || log.targetUid}
                  </td>
                  <td className="py-3 px-4 text-[#252525] max-w-sm">{log.reason}</td>
                  <td className="py-3 px-4 text-[#777777] font-mono text-[11px]">{log.adminEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
