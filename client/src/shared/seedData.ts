import {
  UserRecord,
  BankAccountRecord,
  TransactionRecord,
  CardRecord,
  DepositRecord,
  InsuranceRecord,
  NotificationRecord,
  SupportTicketRecord,
  AppLockSecurityRecord,
  WealthPortfolio,
  AuditLogRecord,
} from './types';

export const INITIAL_CUSTOMERS: UserRecord[] = [
  {
    uid: 'cust-karthick-8829',
    displayName: 'Karthick Krishna',
    email: 'karthick@hsbc.in',
    phone: '+91 98765 43210',
    role: 'customer',
    customerId: 'HSBC-882941',
    accountStatus: 'active',
    kycStatus: 'VERIFIED',
    address: '42, Altamount Road, Cumballa Hill',
    city: 'Mumbai',
    country: 'India',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
  {
    uid: 'cust-ananya-9912',
    displayName: 'Ananya Deshmukh',
    email: 'ananya@hsbc.in',
    phone: '+91 98220 11223',
    role: 'customer',
    customerId: 'HSBC-991245',
    accountStatus: 'active',
    kycStatus: 'VERIFIED',
    address: '15, Koregaon Park',
    city: 'Pune',
    country: 'India',
    createdAt: '2024-03-20T11:00:00.000Z',
    updatedAt: '2026-11-20T14:30:00.000Z',
  },
];

export const INITIAL_ACCOUNTS: BankAccountRecord[] = [
  {
    accountId: 'acc-sb-8829',
    ownerUid: 'cust-karthick-8829',
    customerName: 'Karthick Krishna',
    accountType: 'SAVINGS',
    accountNumber: '50200088294101',
    maskedAccountNumber: '•••• •••• •••• 4101',
    currency: 'INR',
    managedBalance: 2234680.50,
    ledgerBalance: 2234680.50,
    accountStatus: 'ACTIVE',
    branchName: 'Mumbai Main Branch, Fort',
    ifscCode: 'HSBC0400002',
    sortCode: '40-05-15',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2026-11-24T18:00:00.000Z',
  },
  {
    accountId: 'acc-ca-8829',
    ownerUid: 'cust-karthick-8829',
    customerName: 'Karthick Krishna',
    accountType: 'CURRENT',
    accountNumber: '50200088294102',
    maskedAccountNumber: '•••• •••• •••• 4102',
    currency: 'INR',
    managedBalance: 74980000.00,
    ledgerBalance: 74980000.00,
    accountStatus: 'ACTIVE',
    branchName: 'Bandra Kurla Complex Branch',
    ifscCode: 'HSBC0400003',
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2026-11-24T18:00:00.000Z',
  },
];

function formatSeedDateTime(isoUtc: string): string {
  const istMs = new Date(isoUtc).getTime() + 330 * 60 * 1000;
  const d = new Date(istMs);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mmm = months[d.getUTCMonth()];
  const yyyy = d.getUTCFullYear();
  let hours = d.getUTCHours();
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hh = String(hours).padStart(2, '0');
  return `${dd} ${mmm} ${yyyy}, ${hh}:${mins} ${ampm}`;
}

function generateBusinessTransactions(): TransactionRecord[] {
  // 20 Salesforce India credits = ₹3,30,00,000 (₹3.30 Cr — HIGH tier)
  const salesforceAmounts = [
    2100000, 1950000, 1850000, 1800000, 1750000,
    1700000, 1680000, 1650000, 1640000, 1620000,
    1600000, 1580000, 1560000, 1550000, 1540000,
    1520000, 1500000, 1480000, 1470000, 1460000,
  ];
  // 20 Flipkart Internet credits = ₹1,95,00,000 (₹1.95 Cr — MEDIUM tier)
  const flipkartAmounts = [
    1250000, 1180000, 1150000, 1100000, 1080000,
    1050000, 1020000, 1000000, 980000, 960000,
    950000, 940000, 920000, 900000, 880000,
    860000, 850000, 830000, 810000, 790000,
  ];
  // 20 Microsoft India credits = ₹95,00,000 (₹0.95 Cr — LOW tier)
  const microsoftAmounts = [
    680000, 640000, 600000, 580000, 560000,
    540000, 520000, 500000, 490000, 480000,
    460000, 450000, 440000, 420000, 410000,
    390000, 370000, 350000, 320000, 300000,
  ];
  // Total enterprise (60 txns) = ₹6,20,00,000 (₹6.20 Cr)

  // 26 Local Companies & Individuals credits = ₹2,04,80,000
  const localCredits: Array<{
    name: string;
    bank: string;
    acct: string;
    desc: string;
    category: TransactionRecord['category'];
    amount: number;
  }> = [
    { name: 'Zoho Corporation Pvt Ltd', bank: 'ICICI Corporate Desk', acct: '•••• •••• 2241', desc: 'RTGS SaaS Integration Settlement - Zoho Corp', category: 'TRANSFER', amount: 1650000 },
    { name: 'Freshworks Technologies India Pvt Ltd', bank: 'HDFC Bank Corporate', acct: '•••• •••• 3180', desc: 'NEFT Enterprise API Licensing - Freshworks', category: 'TRANSFER', amount: 1480000 },
    { name: 'Razorpay Software Pvt Ltd', bank: 'Axis Bank Corporate', acct: '•••• •••• 7742', desc: 'RTGS Merchant Escrow Settlement - Razorpay', category: 'TRANSFER', amount: 1150000 },
    { name: 'Zerodha Broking Ltd', bank: 'IDFC First Bank', acct: '•••• •••• 5019', desc: 'RTGS FinTech Advisory Fee - Zerodha', category: 'INVESTMENT', amount: 1080000 },
    { name: 'Bundl Technologies (Swiggy) Pvt Ltd', bank: 'Kotak Mahindra Bank', acct: '•••• •••• 6190', desc: 'RTGS Cloud Logistics Retainer - Swiggy', category: 'TRANSFER', amount: 980000 },
    { name: 'Rajesh Nair', bank: 'HDFC Bank Ltd', acct: '•••• •••• 4401', desc: 'IMPS Partner Capital Inflow - Rajesh Nair', category: 'INVESTMENT', amount: 940000 },
    { name: 'UrbanClap Technologies India Pvt Ltd', bank: 'Yes Bank Corporate', acct: '•••• •••• 8834', desc: 'NEFT Platform Ops Milestone - Urban Company', category: 'TRANSFER', amount: 890000 },
    { name: 'Vikramaditya Rao', bank: 'ICICI Bank Ltd', acct: '•••• •••• 1923', desc: 'RTGS Syndicate Co-Investment - Vikramaditya Rao', category: 'INVESTMENT', amount: 860000 },
    { name: 'Nykaa E-Retail Pvt Ltd', bank: 'Standard Chartered India', acct: '•••• •••• 6512', desc: 'NEFT Digital Commerce Suite - Nykaa', category: 'TRANSFER', amount: 840000 },
    { name: 'Deccan Precision Works Pvt Ltd', bank: 'State Bank of India', acct: '•••• •••• 7403', desc: 'RTGS Industrial ERP Rollout - Deccan Precision', category: 'TRANSFER', amount: 820000 },
    { name: 'Priya Subramanian', bank: 'Citibank India', acct: '•••• •••• 3891', desc: 'NEFT Executive Advisory Retainer - Priya Subramanian', category: 'TRANSFER', amount: 790000 },
    { name: 'Bharat Cold Chain Logistics LLP', bank: 'Axis Bank Ltd', acct: '•••• •••• 9145', desc: 'NEFT Fleet Telemetry License - Bharat Logistics', category: 'TRANSFER', amount: 760000 },
    { name: 'Arjun Malhotra', bank: 'HSBC India', acct: '•••• •••• 5288', desc: 'RTGS Angel Working Capital - Arjun Malhotra', category: 'INVESTMENT', amount: 750000 },
    { name: 'Mehta & Sons Infrastructure LLP', bank: 'Bank of Baroda', acct: '•••• •••• 2674', desc: 'RTGS Site Compliance Software - Mehta Infra', category: 'TRANSFER', amount: 720000 },
    { name: 'Deepika Iyer', bank: 'HDFC Bank Ltd', acct: '•••• •••• 6029', desc: 'NEFT Client Settlement - Deepika Iyer', category: 'TRANSFER', amount: 690000 },
    { name: 'Kalyani Cloud Labs Pvt Ltd', bank: 'IndusInd Bank', acct: '•••• •••• 8310', desc: 'NEFT Cloud Migration Fee - Kalyani Labs', category: 'TRANSFER', amount: 660000 },
    { name: 'Siddharth Menon', bank: 'Kotak Mahindra Bank', acct: '•••• •••• 4712', desc: 'NEFT Strategic Retainer - Siddharth Menon', category: 'TRANSFER', amount: 640000 },
    { name: 'Kavita Textiles Export House', bank: 'Union Bank of India', acct: '•••• •••• 1158', desc: 'NEFT Export Billing Platform - Kavita Textiles', category: 'TRANSFER', amount: 620000 },
    { name: 'Neha Kapoor', bank: 'ICICI Bank Ltd', acct: '•••• •••• 9430', desc: 'IMPS Commercial Lease Security Deposit - Neha Kapoor', category: 'TRANSFER', amount: 600000 },
    { name: 'Sahyadri Agri Exports Pvt Ltd', bank: 'Federal Bank', acct: '•••• •••• 7024', desc: 'NEFT Supply Chain Settlement - Sahyadri Agri', category: 'TRANSFER', amount: 580000 },
    { name: 'Rohan Deshpande', bank: 'Axis Bank Ltd', acct: '•••• •••• 3309', desc: 'NEFT Architecture & Audit Credit - Rohan Deshpande', category: 'TRANSFER', amount: 560000 },
    { name: 'Blue Tokai Coffee Roasters Pvt Ltd', bank: 'RBL Bank', acct: '•••• •••• 5581', desc: 'NEFT POS Analytics Renewal - Blue Tokai', category: 'TRANSFER', amount: 540000 },
    { name: 'Sneha Kulkarni', bank: 'State Bank of India', acct: '•••• •••• 8047', desc: 'NEFT Fractional CTO Retainer - Sneha Kulkarni', category: 'TRANSFER', amount: 520000 },
    { name: 'Karthikeya Sharma', bank: 'HDFC Bank Ltd', acct: '•••• •••• 2890', desc: 'IMPS Partner Receivable - Karthikeya Sharma', category: 'TRANSFER', amount: 490000 },
    { name: 'Anirudh Joshi', bank: 'IDFC First Bank', acct: '•••• •••• 6714', desc: 'NEFT Project Advance Credit - Anirudh Joshi', category: 'TRANSFER', amount: 460000 },
    { name: 'Pooja Hegde', bank: 'ICICI Bank Ltd', acct: '•••• •••• 1562', desc: 'IMPS Consultancy Settlement - Pooja Hegde', category: 'TRANSFER', amount: 410000 },
  ];

  // 14 Local Companies & Individuals debits = ₹75,00,000
  // Net Local (26 credits - 14 debits) = ₹2,04,80,000 - ₹75,00,000 = ₹1,29,80,000
  // Grand Total Business Current Balance = ₹6,20,00,000 + ₹1,29,80,000 = ₹7,49,80,000 (7.498 Cr)
  const localDebits: Array<{
    name: string;
    bank: string;
    acct: string;
    desc: string;
    category: TransactionRecord['category'];
    amount: number;
  }> = [
    { name: 'CBDT & GSTN Tax Portal (RBI)', bank: 'Reserve Bank of India', acct: '•••• •••• 0001', desc: 'Quarterly GST & Corporate Advance Tax Challan', category: 'UTILITIES', amount: 850000 },
    { name: 'BKC Maker Maxity Towers LLP', bank: 'HDFC Bank Corporate', acct: '•••• •••• 9901', desc: 'RTGS Corporate Office Lease - BKC Mumbai', category: 'UTILITIES', amount: 780000 },
    { name: 'CtrlS Datacenters Ltd', bank: 'ICICI Corporate Desk', acct: '•••• •••• 4428', desc: 'RTGS Tier-4 Rack Hosting & Bandwidth', category: 'UTILITIES', amount: 720000 },
    { name: 'Suresh Iyer & Associates LLP', bank: 'Axis Bank Ltd', acct: '•••• •••• 3174', desc: 'NEFT Statutory Audit & Legal Retainer', category: 'TRANSFER', amount: 660000 },
    { name: 'Tata Power Company Ltd', bank: 'State Bank of India', acct: '•••• •••• 8802', desc: 'RTGS Commercial Facility Power Settlement', category: 'UTILITIES', amount: 620000 },
    { name: 'Devika Chatterjee', bank: 'Kotak Mahindra Bank', acct: '•••• •••• 5219', desc: 'NEFT Principal Systems Architect Payout', category: 'SALARY', amount: 580000 },
    { name: 'Blue Dart Express Ltd', bank: 'Citibank India', acct: '•••• •••• 7730', desc: 'NEFT Hardware Dispatch & Courier Settlement', category: 'TRANSFER', amount: 540000 },
    { name: 'Manish Tiwari', bank: 'HDFC Bank Ltd', acct: '•••• •••• 6410', desc: 'NEFT DevSecOps Advisory Compensation', category: 'SALARY', amount: 510000 },
    { name: 'Airtel Business Enterprise', bank: 'Axis Bank Corporate', acct: '•••• •••• 1194', desc: 'MPLS Dedicated Fiber Leased Line Bill', category: 'UTILITIES', amount: 480000 },
    { name: 'Raghavendra Bhat', bank: 'ICICI Bank Ltd', acct: '•••• •••• 8322', desc: 'NEFT UX Research Lead Payout', category: 'SALARY', amount: 440000 },
    { name: 'Croma Tata Enterprise Desk', bank: 'HDFC Bank Ltd', acct: '•••• •••• 2504', desc: 'RTGS Engineering Workstation Procurement', category: 'SHOPPING', amount: 390000 },
    { name: 'Meera Sundaram', bank: 'State Bank of India', acct: '•••• •••• 4903', desc: 'NEFT Compliance & Privacy Consultant Fee', category: 'TRANSFER', amount: 350000 },
    { name: 'Taj Lands End Mumbai', bank: 'HSBC India', acct: '•••• •••• 6671', desc: 'Corporate Partner Summit Hospitality Settlement', category: 'DINING', amount: 310000 },
    { name: 'Pranav Kulkarni', bank: 'IDFC First Bank', acct: '•••• •••• 9120', desc: 'IMPS Hardware Maintenance Vendor Payout', category: 'TRANSFER', amount: 270000 },
  ];

  // Build 100 chronological slots starting strictly on 2026-01-30 and ending 2026-11-25
  const startMs = new Date('2026-01-30T04:15:00.000Z').getTime(); // 30 Jan 2026, 09:45 AM IST
  const endMs = new Date('2026-11-25T05:45:00.000Z').getTime();   // 25 Nov 2026, 11:15 AM IST
  const totalSlots = 100;

  type DraftEntry = {
    category: TransactionRecord['category'];
    description: string;
    amount: number;
    transactionType: 'CREDIT' | 'DEBIT';
    counterpartyName: string;
    counterpartyAccount: string;
    counterpartyBank: string;
    channel: 'RTGS' | 'NEFT' | 'IMPS' | 'BILL';
  };

  // Interleave pattern across the 10-month horizon (20 rounds of 5 entries = 100 entries):
  // Every 5-entry cycle: Salesforce -> Flipkart -> Local Credit -> Microsoft -> Local Debit/Credit
  const salesforceLabels = [
    'CRM Enterprise License Settlement',
    'Apex Cloud Customization Milestone',
    'Data Cloud Integration Retainer',
    'MuleSoft API Gateway Settlement',
    'Tableau Analytics Rollout Tranche',
  ];
  const flipkartLabels = [
    'Marketplace Seller API Settlement',
    'Supply Chain OMS Integration Payout',
    'BigBillion Cloud Scaling Retainer',
    'Ekart Telemetry Portal Milestone',
    'Payments Switch SLA Settlement',
  ];
  const microsoftLabels = [
    'Azure Co-Sell Cloud Credit',
    'Dynamics ERP Connector Settlement',
    'Entra Identity Migration Retainer',
    'PowerBI Embedded Analytics Fee',
    'Teams Enterprise Voice Integration',
  ];

  const orderedDrafts: DraftEntry[] = [];
  let lcIdx = 0;
  let ldIdx = 0;

  for (let i = 0; i < 20; i++) {
    // 1. Salesforce (HIGH)
    orderedDrafts.push({
      category: 'TRANSFER',
      description: `RTGS Settlement - ${salesforceLabels[i % salesforceLabels.length]} (#SF-${101 + i})`,
      amount: salesforceAmounts[i],
      transactionType: 'CREDIT',
      counterpartyName: 'Salesforce India Pvt Ltd',
      counterpartyAccount: '•••• •••• 7410',
      counterpartyBank: 'Citibank India Corporate',
      channel: 'RTGS',
    });

    // 2. Flipkart (MEDIUM)
    orderedDrafts.push({
      category: 'TRANSFER',
      description: `RTGS Settlement - ${flipkartLabels[i % flipkartLabels.length]} (#FK-${201 + i})`,
      amount: flipkartAmounts[i],
      transactionType: 'CREDIT',
      counterpartyName: 'Flipkart Internet Pvt Ltd',
      counterpartyAccount: '•••• •••• 6208',
      counterpartyBank: 'HDFC Bank Corporate',
      channel: 'RTGS',
    });

    // 3. Local Credit
    const lc1 = localCredits[lcIdx++];
    orderedDrafts.push({
      category: lc1.category,
      description: lc1.desc,
      amount: lc1.amount,
      transactionType: 'CREDIT',
      counterpartyName: lc1.name,
      counterpartyAccount: lc1.acct,
      counterpartyBank: lc1.bank,
      channel: lc1.amount >= 500000 ? 'RTGS' : 'NEFT',
    });

    // 4. Microsoft (LOW)
    orderedDrafts.push({
      category: 'TRANSFER',
      description: `NEFT Remittance - ${microsoftLabels[i % microsoftLabels.length]} (#MS-${301 + i})`,
      amount: microsoftAmounts[i],
      transactionType: 'CREDIT',
      counterpartyName: 'Microsoft Corporation India Pvt Ltd',
      counterpartyAccount: '•••• •••• 4905',
      counterpartyBank: 'HSBC India Corporate',
      channel: 'NEFT',
    });

    // 5. Local Debit (14 times) or remaining Local Credit (6 times) -> total 40 local
    if (ldIdx < localDebits.length && (i % 3 !== 2 || lcIdx >= localCredits.length)) {
      const ld = localDebits[ldIdx++];
      orderedDrafts.push({
        category: ld.category,
        description: ld.desc,
        amount: ld.amount,
        transactionType: 'DEBIT',
        counterpartyName: ld.name,
        counterpartyAccount: ld.acct,
        counterpartyBank: ld.bank,
        channel: ld.category === 'UTILITIES' ? 'BILL' : 'NEFT',
      });
    } else if (lcIdx < localCredits.length) {
      const lc2 = localCredits[lcIdx++];
      orderedDrafts.push({
        category: lc2.category,
        description: lc2.desc,
        amount: lc2.amount,
        transactionType: 'CREDIT',
        counterpartyName: lc2.name,
        counterpartyAccount: lc2.acct,
        counterpartyBank: lc2.bank,
        channel: lc2.amount >= 500000 ? 'RTGS' : 'NEFT',
      });
    } else {
      const ld = localDebits[ldIdx++];
      orderedDrafts.push({
        category: ld.category,
        description: ld.desc,
        amount: ld.amount,
        transactionType: 'DEBIT',
        counterpartyName: ld.name,
        counterpartyAccount: ld.acct,
        counterpartyBank: ld.bank,
        channel: ld.category === 'UTILITIES' ? 'BILL' : 'NEFT',
      });
    }
  }

  // Assign ascending timestamps from Jan 30 -> Nov 25, then return newest-first
  const records: TransactionRecord[] = orderedDrafts.map((entry, idx) => {
    const slotRatio = idx / (totalSlots - 1);
    const rawMs = startMs + Math.round(slotRatio * (endMs - startMs));
    // Deterministic business-hour jitter so dates feel organic but strictly ascending
    const jitterMinutes = ((idx * 37) % 180) - 90;
    const clampedMs =
      idx === 0
        ? startMs
        : idx === totalSlots - 1
          ? endMs
          : Math.min(endMs - 60000, Math.max(startMs + 60000, rawMs + jitterMinutes * 60000));
    const iso = new Date(clampedMs).toISOString();
    const yyyymm = iso.slice(0, 7).replace('-', '');
    const seq = String(idx + 1).padStart(3, '0');
    return {
      transactionId: `tx-2${seq}`,
      ownerUid: 'cust-karthick-8829',
      accountId: 'acc-ca-8829',
      category: entry.category,
      description: entry.description,
      amount: entry.amount,
      currency: 'INR',
      transactionType: entry.transactionType,
      status: 'COMPLETED',
      reference: `TXN/${entry.channel}/${yyyymm}/${80100 + idx}`,
      counterpartyName: entry.counterpartyName,
      counterpartyAccount: entry.counterpartyAccount,
      counterpartyBank: entry.counterpartyBank,
      transactionDate: formatSeedDateTime(iso),
      createdAt: iso,
      updatedAt: iso,
    };
  });

  // Sort newest-first so Dashboard & Transactions feed show latest Nov 25 entries at the top
  return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

const BUSINESS_TRANSACTIONS = generateBusinessTransactions();

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  ...BUSINESS_TRANSACTIONS,
  {
    transactionId: 'tx-1001',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    category: 'INVESTMENT',
    description: 'Executive Dividend & Retainer Credit',
    amount: 450000.00,
    currency: 'INR',
    transactionType: 'CREDIT',
    status: 'COMPLETED',
    reference: 'TXN/NEFT/202611/00821',
    counterpartyName: 'Alphabet Technologies India Pvt Ltd',
    counterpartyAccount: '•••• •••• 9920',
    counterpartyBank: 'Citibank N.A.',
    transactionDate: '24 Nov 2026, 10:30 AM',
    createdAt: '2026-11-24T05:00:00.000Z',
    updatedAt: '2026-11-24T05:00:00.000Z',
  },
  {
    transactionId: 'tx-1002',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    category: 'INVESTMENT',
    description: 'SIP Auto-Debit - HSBC Large Cap Equity Fund',
    amount: 50000.00,
    currency: 'INR',
    transactionType: 'DEBIT',
    status: 'COMPLETED',
    reference: 'TXN/INV/202611/44910',
    counterpartyName: 'HSBC Asset Management (India) Pvt Ltd',
    counterpartyAccount: '•••• •••• 1184',
    counterpartyBank: 'HSBC India',
    transactionDate: '23 Nov 2026, 09:15 AM',
    createdAt: '2026-11-23T03:45:00.000Z',
    updatedAt: '2026-11-23T03:45:00.000Z',
  },
  {
    transactionId: 'tx-1003',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    category: 'DINING',
    description: 'The Taj Mahal Palace - Wasabi by Morimoto',
    amount: 14850.00,
    currency: 'INR',
    transactionType: 'DEBIT',
    status: 'COMPLETED',
    reference: 'TXN/POS/202611/77102',
    counterpartyName: 'The Indian Hotels Company Ltd',
    transactionDate: '22 Nov 2026, 09:45 PM',
    createdAt: '2026-11-22T16:15:00.000Z',
    updatedAt: '2026-11-22T16:15:00.000Z',
  },
  {
    transactionId: 'tx-1004',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    category: 'TRANSFER',
    description: 'NEFT Transfer to Rajesh Kumar (Consulting)',
    amount: 75000.00,
    currency: 'INR',
    transactionType: 'DEBIT',
    status: 'COMPLETED',
    reference: 'TXN/NEFT/202611/33918',
    counterpartyName: 'Rajesh Kumar',
    counterpartyAccount: '•••• •••• 3391',
    counterpartyBank: 'HDFC Bank Ltd',
    transactionDate: '21 Nov 2026, 03:10 PM',
    createdAt: '2026-11-21T09:40:00.000Z',
    updatedAt: '2026-11-21T09:40:00.000Z',
  },
];

export const INITIAL_CARDS: CardRecord[] = [
  {
    cardId: 'card-deb-4281',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    cardType: 'DEBIT',
    cardTier: 'PREMIER_PLATINUM',
    cardName: 'HSBC Premier Personal Debit Card',
    cardholderName: 'KARTHICK KRISHNA',
    network: 'VISA',
    maskedCardNumber: '•••• •••• •••• 4281',
    expiryMonth: '08',
    expiryYear: '29',
    cardStatus: 'ACTIVE',
    spendingLimit: 250000,
    currentMonthSpent: 42100,
    onlineEnabled: true,
    internationalEnabled: true,
    contactlessEnabled: true,
    atmEnabled: true,
    posEnabled: true,
    gamblingRestricted: true,
    isActivated: true,
    cardPin: '8829',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
  {
    cardId: 'card-deb-4102',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-ca-8829',
    cardType: 'DEBIT',
    cardTier: 'GLOBAL_TRAVEL',
    cardName: 'HSBC Commercial Business Debit Card',
    cardholderName: 'KARTHICK KRISHNA',
    network: 'VISA',
    maskedCardNumber: '•••• •••• •••• 4102',
    expiryMonth: '05',
    expiryYear: '30',
    cardStatus: 'ACTIVE',
    spendingLimit: 1000000,
    currentMonthSpent: 185000,
    onlineEnabled: true,
    internationalEnabled: true,
    contactlessEnabled: true,
    atmEnabled: true,
    posEnabled: true,
    gamblingRestricted: true,
    isActivated: true,
    cardPin: '6420',
    createdAt: '2024-02-01T10:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
  {
    cardId: 'card-crd-9821',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    cardType: 'CREDIT',
    cardTier: 'PREMIER_WORLD_ELITE',
    cardName: 'HSBC Premier Credit Card',
    cardholderName: 'KARTHICK KRISHNA',
    network: 'MASTERCARD',
    maskedCardNumber: '•••• •••• •••• 9821',
    expiryMonth: '11',
    expiryYear: '30',
    cardStatus: 'ACTIVE',
    spendingLimit: 1000000,
    currentMonthSpent: 215000,
    creditLimit: 1000000,
    availableCredit: 785000,
    minDue: 10750,
    dueDate: '10 Dec 2026',
    rewardPoints: 48250,
    onlineEnabled: true,
    internationalEnabled: true,
    contactlessEnabled: true,
    atmEnabled: true,
    posEnabled: true,
    gamblingRestricted: true,
    isActivated: true,
    cardPin: '4192',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
  {
    cardId: 'card-crd-7410',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    cardType: 'CREDIT',
    cardTier: 'TRAVEL_ONE',
    cardName: 'HSBC TravelOne Credit Card',
    cardholderName: 'KARTHICK KRISHNA',
    network: 'MASTERCARD',
    maskedCardNumber: '•••• •••• •••• 7410',
    expiryMonth: '07',
    expiryYear: '30',
    cardStatus: 'ACTIVE',
    spendingLimit: 600000,
    currentMonthSpent: 94200,
    creditLimit: 600000,
    availableCredit: 505800,
    minDue: 4710,
    dueDate: '10 Dec 2026',
    rewardPoints: 26400,
    onlineEnabled: true,
    internationalEnabled: true,
    contactlessEnabled: true,
    atmEnabled: true,
    posEnabled: true,
    gamblingRestricted: true,
    isActivated: true,
    cardPin: '3318',
    createdAt: '2024-06-10T10:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
  {
    cardId: 'card-crd-5593',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    cardType: 'CREDIT',
    cardTier: 'LIVE_PLUS',
    cardName: 'HSBC Live+ Credit Card',
    cardholderName: 'KARTHICK KRISHNA',
    network: 'VISA',
    maskedCardNumber: '•••• •••• •••• 5593',
    expiryMonth: '03',
    expiryYear: '29',
    cardStatus: 'ACTIVE',
    spendingLimit: 350000,
    currentMonthSpent: 38450,
    creditLimit: 350000,
    availableCredit: 311550,
    minDue: 1920,
    dueDate: '10 Dec 2026',
    rewardPoints: 11200,
    onlineEnabled: true,
    internationalEnabled: true,
    contactlessEnabled: true,
    atmEnabled: true,
    posEnabled: true,
    gamblingRestricted: true,
    isActivated: true,
    cardPin: '9045',
    createdAt: '2024-09-12T10:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
  {
    cardId: 'card-crd-2284',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    cardType: 'CREDIT',
    cardTier: 'VISA_PLATINUM',
    cardName: 'HSBC Visa Platinum Credit Card',
    cardholderName: 'KARTHICK KRISHNA',
    network: 'VISA',
    maskedCardNumber: '•••• •••• •••• 2284',
    expiryMonth: '12',
    expiryYear: '28',
    cardStatus: 'ACTIVE',
    spendingLimit: 250000,
    currentMonthSpent: 12900,
    creditLimit: 250000,
    availableCredit: 237100,
    minDue: 645,
    dueDate: '10 Dec 2026',
    rewardPoints: 6850,
    onlineEnabled: true,
    internationalEnabled: false,
    contactlessEnabled: true,
    atmEnabled: true,
    posEnabled: true,
    gamblingRestricted: true,
    isActivated: true,
    cardPin: '5572',
    createdAt: '2024-04-05T10:00:00.000Z',
    updatedAt: '2026-11-24T10:00:00.000Z',
  },
];

export const INITIAL_DEPOSITS: DepositRecord[] = [
  {
    depositId: 'dep-fd-9901',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    depositType: 'FIXED',
    depositNumber: 'FD-HSBC-8829-001',
    principalAmount: 1000000,
    interestRate: 7.8,
    tenureMonths: 24,
    maturityDate: '15 Apr 2027',
    expectedMaturityAmount: 1162400,
    status: 'ACTIVE',
    createdAt: '2025-04-15T09:00:00.000Z',
  },
  {
    depositId: 'dep-rd-9902',
    ownerUid: 'cust-karthick-8829',
    accountId: 'acc-sb-8829',
    depositType: 'RECURRING',
    depositNumber: 'RD-HSBC-8829-002',
    principalAmount: 25000,
    interestRate: 7.2,
    tenureMonths: 12,
    maturityDate: '10 Jan 2027',
    expectedMaturityAmount: 312500,
    status: 'ACTIVE',
    createdAt: '2026-01-10T09:00:00.000Z',
  },
];

export const INITIAL_WEALTH: WealthPortfolio = {
  ownerUid: 'cust-karthick-8829',
  totalPortfolioValue: 4560000,
  equityAllocation: 60,
  debtAllocation: 30,
  goldAllocation: 10,
  mutualFunds: [
    {
      fundName: 'HSBC Large Cap Equity Fund',
      category: 'Large Cap Equity',
      investedAmount: 1200000,
      currentValue: 1580000,
      returnPercentage: 31.6,
    },
    {
      fundName: 'HSBC Flexi Cap Fund',
      category: 'Multi Cap Equity',
      investedAmount: 1000000,
      currentValue: 1420000,
      returnPercentage: 42.0,
    },
    {
      fundName: 'HSBC Corporate Bond Fund',
      category: 'Fixed Income / Debt',
      investedAmount: 1000000,
      currentValue: 1120000,
      returnPercentage: 12.0,
    },
    {
      fundName: 'Nippon India Sovereign Gold ETF',
      category: 'Commodities',
      investedAmount: 400000,
      currentValue: 440000,
      returnPercentage: 10.0,
    },
  ],
};

export const INITIAL_INSURANCE: InsuranceRecord[] = [
  {
    policyId: 'ins-001',
    ownerUid: 'cust-karthick-8829',
    policyNumber: 'CANARA-HSBC-PRM-99120',
    policyType: 'HEALTH',
    providerName: 'Canara HSBC Life Smart Wealth',
    coverageAmount: 5000000,
    annualPremium: 38500,
    policyStatus: 'ACTIVE',
    dueDate: '15 Feb 2027',
  },
  {
    policyId: 'ins-002',
    ownerUid: 'cust-karthick-8829',
    policyNumber: 'TATA-AIG-PRM-44102',
    policyType: 'TERM_LIFE',
    providerName: 'Tata AIG Premier Health Shield',
    coverageAmount: 20000000,
    annualPremium: 42000,
    policyStatus: 'ACTIVE',
    dueDate: '01 Mar 2027',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    notificationId: 'notif-1',
    ownerUid: 'cust-karthick-8829',
    title: 'Salary Credit Processed',
    message: '₹3,50,000.00 credited to HSBC Premier Savings Account from Alphabet Technologies.',
    type: 'TRANSACTION',
    read: false,
    createdAt: '2026-11-24T10:30:00.000Z',
  },
  {
    notificationId: 'notif-2',
    ownerUid: 'cust-karthick-8829',
    title: 'HSBC Premier Market Intelligence',
    message: 'RBI Monetary Policy review: Fixed Deposit rates revised upwards by 25 bps for HSBC Premier clients.',
    type: 'ANNOUNCEMENT',
    read: false,
    createdAt: '2026-11-23T14:00:00.000Z',
  },
  {
    notificationId: 'notif-3',
    ownerUid: 'cust-karthick-8829',
    title: 'Biometric Security Verified',
    message: 'Face ID / Touch ID authentication verified successfully on registered device.',
    type: 'SECURITY',
    read: true,
    createdAt: '2026-11-22T08:15:00.000Z',
  },
];

export const INITIAL_SUPPORT_TICKETS: SupportTicketRecord[] = [
  {
    ticketId: 'tkt-8801',
    ownerUid: 'cust-karthick-8829',
    customerName: 'Karthick Krishna',
    subject: 'International Card Limit Adjustment for London Travel',
    description: 'Requesting temporary international POS and ATM limit enhancement to £15,000 for travel across the UK.',
    category: 'ACCOUNT_INQUIRY',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assignedAdmin: 'Victoria Sterling (HSBC Operations)',
    createdAt: '2026-11-23T11:00:00.000Z',
    updatedAt: '2026-11-24T09:30:00.000Z',
    messages: [
      {
        id: 'msg-1',
        senderUid: 'cust-karthick-8829',
        senderRole: 'customer',
        message: 'Hello, I will be travelling to London next week and need my HSBC Premier World Elite card limit adjusted.',
        timestamp: '2026-11-23T11:00:00.000Z',
      },
      {
        id: 'msg-2',
        senderUid: 'admin-super-001',
        senderRole: 'admin',
        message: 'Dear Mr. Krishna, we have approved your request. Your international limit is temporarily enhanced to £15,000.',
        timestamp: '2026-11-24T09:30:00.000Z',
      },
    ],
  },
];

export const INITIAL_APPLOCK: AppLockSecurityRecord = {
  ownerUid: 'cust-karthick-8829',
  appLockEnabled: true,
  pinHash: '002831', // Fixed password / PIN: 002831
  failedAttempts: 0,
  lockedUntil: null,
  resetRequestedByAdmin: false,
  updatedAt: '2026-11-24T10:00:00.000Z',
};

export const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    logId: 'audit-001',
    adminUid: 'admin-super-001',
    adminEmail: 'admin@hsbc.in',
    action: 'BALANCE_ADJUSTMENT',
    targetUid: 'cust-karthick-8829',
    targetCustomerName: 'Karthick Krishna',
    targetRecord: 'accounts/acc-sb-8829',
    previousValue: 2050000,
    newValue: 2234680.50,
    reason: 'Monthly interest capitalization and premium relationship dividend credit',
    createdAt: '2026-11-24T08:00:00.000Z',
  },
  {
    logId: 'audit-002',
    adminUid: 'admin-super-001',
    adminEmail: 'admin@hsbc.in',
    action: 'CUSTOMER_CREATED',
    targetUid: 'cust-karthick-8829',
    targetCustomerName: 'Karthick Krishna',
    targetRecord: 'users/cust-karthick-8829',
    reason: 'HSBC Premier customer onboarding & KYC verification completed',
    createdAt: '2024-01-15T09:00:00.000Z',
  },
];
