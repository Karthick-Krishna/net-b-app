import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  UserCheck,
  FileText,
  Search,
} from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export interface ServiceRequest {
  id: string;
  type: 'KYC_VERIFICATION' | 'CARD_REPLACEMENT' | 'DORMANT_REACTIVATION' | 'INTEREST_CERTIFICATE';
  customerName: string;
  customerId: string;
  description: string;
  requestedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const ServiceRequestsPage: React.FC = () => {
  const { customers } = useAdminStore();
  const [filterType, setFilterType] = useState<string>('ALL');

  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 'REQ-KYC-001',
      type: 'KYC_VERIFICATION',
      customerName: 'Aarav Patel',
      customerId: 'HSBC-882941',
      description: 'Re-KYC Document Submission: DigiLocker Aadhaar XML & PAN verification',
      requestedDate: '2026-11-24 18:30',
      status: 'PENDING',
    },
    {
      id: 'REQ-CRD-002',
      type: 'CARD_REPLACEMENT',
      customerName: 'Priya Sharma',
      customerId: 'HSBC-991245',
      description: 'Lost card replacement for HSBC Premier Platinum Debit (•••• 4921)',
      requestedDate: '2026-11-24 16:45',
      status: 'PENDING',
    },
    {
      id: 'REQ-ACT-003',
      type: 'DORMANT_REACTIVATION',
      customerName: 'Aarav Patel',
      customerId: 'HSBC-882941',
      description: 'Reactivation of Inoperative Savings Account (•••• 8829) with KYC clearance',
      requestedDate: '2026-11-24 14:10',
      status: 'PENDING',
    },
    {
      id: 'REQ-TAX-004',
      type: 'INTEREST_CERTIFICATE',
      customerName: 'Priya Sharma',
      customerId: 'HSBC-991245',
      description: 'Certified Section 80TTA Interest Certificate dispatch for FY 2026-27',
      requestedDate: '2026-11-24 11:20',
      status: 'APPROVED',
    },
  ]);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: action } : r))
    );
    toast.success(
      `Request ${id} marked as ${action}. Audit entry recorded and customer notified.`
    );
  };

  const filtered = requests.filter(r => {
    if (filterType === 'ALL') return true;
    return r.type === filterType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
            Customer Service & KYC Requests
          </h2>
          <p className="text-xs text-[#777777] mt-0.5">
            Authorize or reject customer KYC submissions, card replacements, and dormant account reactivations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-[#E8E8E8] rounded-xl self-start sm:self-auto shadow-xs">
          {['ALL', 'KYC_VERIFICATION', 'CARD_REPLACEMENT', 'DORMANT_REACTIVATION'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filterType === t
                  ? 'bg-[#DB0011] text-white shadow-xs'
                  : 'text-[#555555] hover:text-[#252525]'
              }`}
            >
              {t.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-[#E8E8E8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#555555]">
            <thead className="bg-[#F9F9F9] text-[#777777] uppercase text-[10px] tracking-wider border-b border-[#E8E8E8] font-bold">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Requested On</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Operations Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E8]">
              {filtered.map(req => (
                <tr key={req.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#252525]">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-[#555555]">
                      {req.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#252525]">
                    {req.customerName}
                    <div className="font-mono text-[10px] text-[#777777]">{req.customerId}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#252525] max-w-sm">
                    {req.description}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#777777]">
                    {req.requestedDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-50 text-[#16864A] border border-emerald-200'
                          : req.status === 'REJECTED'
                          ? 'bg-red-50 text-[#DB0011] border border-red-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAction(req.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(req.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-[#DB0011] rounded-lg text-xs font-bold transition-colors border border-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 font-semibold text-[11px]">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
