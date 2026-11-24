import React, { useState } from 'react';
import { Gift, Award, Plus, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAdminStore } from '../../context/AdminStoreContext';
import toast from 'react-hot-toast';

export const RewardsAdminPage: React.FC = () => {
  const { customers } = useAdminStore();
  const [pointsBonus, setPointsBonus] = useState('5000');
  const [selectedCustomerUid, setSelectedCustomerUid] = useState(customers[0]?.uid || '');

  const handleGrantBonus = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Granted ${parseInt(pointsBonus).toLocaleString()} Premier Reward Points bonus to customer!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#252525] tracking-tight">
          Rewards & Loyalty Program Administration
        </h2>
        <p className="text-xs text-[#777777] mt-0.5">
          Manage Premier reward points balance, merchant redemption vouchers, and airline airmiles transfers
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E8E8E8]">
            <Award className="w-5 h-5 text-[#DB0011]" />
            <h3 className="text-sm font-bold text-[#252525]">Award Promotional Points Bonus</h3>
          </div>

          <form onSubmit={handleGrantBonus} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Target Customer</label>
              <select
                value={selectedCustomerUid}
                onChange={e => setSelectedCustomerUid(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-bold"
              >
                {customers.map(c => (
                  <option key={c.uid} value={c.uid}>
                    {c.displayName} ({c.customerId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-[#777777] uppercase text-[10px] block mb-1">Reward Points Amount</label>
              <input
                type="number"
                required
                value={pointsBonus}
                onChange={e => setPointsBonus(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-[#E8E8E8] rounded-xl font-black text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#DB0011] hover:bg-[#B0000D] text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              Credit Reward Points
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-[#777777] uppercase tracking-wider">
            Active Airline & Hotel Partners
          </h3>
          <div className="divide-y divide-[#E8E8E8] text-xs">
            {[
              { partner: 'Singapore Airlines KrisFlyer', ratio: '2 Points = 1 Mile', status: 'Active' },
              { partner: 'British Airways Executive Club', ratio: '2 Points = 1 Avios', status: 'Active' },
              { partner: 'Taj Hotels Epicure Club', ratio: '1 Point = ₹0.50', status: 'Active' },
              { partner: 'Apple Store India Gift Vouchers', ratio: 'Instant E-Code', status: 'Active' },
            ].map((p, i) => (
              <div key={i} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-[#252525]">{p.partner}</div>
                  <div className="text-[10px] text-gray-500">{p.ratio}</div>
                </div>
                <span className="text-[10px] font-bold text-[#16864A] bg-emerald-50 px-2 py-0.5 rounded">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
