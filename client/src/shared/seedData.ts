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
    email: 'coralgenz@gmail.com',
    phone: '+91 6379791151',
    role: 'customer',
    customerId: 'HSBC-882941',
    accountStatus: 'active',
    kycStatus: 'VERIFIED',
    address: '2/26 Mullai Nagar, Pollachi, Tamil Nadu 642002, India',
    city: 'Pollachi',
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
    accountNumber: '06410088294101',
    maskedAccountNumber: '•••• •••• •••• 4101',
    currency: 'INR',
    managedBalance: 4223500.00,
    ledgerBalance: 4223500.00,
    accountStatus: 'ACTIVE',
    branchName: 'Coimbatore Branch, Race Course Road',
    ifscCode: 'HSBC0641002',
    sortCode: '64-10-02',
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2026-08-30T10:30:00.000Z',
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

function generatePersonalTransactions(): TransactionRecord[] {
  // Personal Premier Savings Ledger (15 Jan 2026 - 30 Aug 2026)
  // 12 Credits = ₹56,80,000 | 16 Debits = ₹14,56,500 | Net Balance = ₹42,23,500.00 (42.235 Lakhs)
  const entries: Array<{
    iso: string;
    category: TransactionRecord['category'];
    description: string;
    amount: number;
    transactionType: 'CREDIT' | 'DEBIT';
    counterpartyName: string;
    counterpartyAccount?: string;
    counterpartyBank?: string;
    channel: 'NEFT' | 'IMPS' | 'POS' | 'INV' | 'BILL';
  }> = [
    { iso: '2026-08-30T10:30:00.000Z', category: 'SALARY', description: 'August Salary & Executive Retainer Credit', amount: 450000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
    { iso: '2026-08-28T15:15:00.000Z', category: 'DINING', description: 'The Residency Towers Coimbatore - Chin Chin Dining', amount: 28000, transactionType: 'DEBIT', counterpartyName: 'Appaswamy Real Estates (Residency Towers)', channel: 'POS' },
    { iso: '2026-08-21T06:40:00.000Z', category: 'TRANSFER', description: 'HSBC Premier Credit Card Auto-Pay Settlement', amount: 142000, transactionType: 'DEBIT', counterpartyName: 'HSBC Cards Settlement Desk', counterpartyAccount: '•••• •••• 9821', counterpartyBank: 'HSBC India', channel: 'NEFT' },
    { iso: '2026-08-08T11:20:00.000Z', category: 'SHOPPING', description: 'Tata CLiQ Luxury Boutique Purchase', amount: 46000, transactionType: 'DEBIT', counterpartyName: 'Tata Unistore Limited', channel: 'POS' },
    { iso: '2026-07-18T07:45:00.000Z', category: 'UTILITIES', description: 'Race Course Road Residence Society Maintenance', amount: 85000, transactionType: 'DEBIT', counterpartyName: 'Race Course Residents Co-op Society', counterpartyAccount: '•••• •••• 3104', counterpartyBank: 'HDFC Bank Ltd', channel: 'NEFT' },
    { iso: '2026-07-10T04:00:00.000Z', category: 'UTILITIES', description: 'Coimbatore Tech Zone Enterprise Workspace Lease', amount: 75000, transactionType: 'DEBIT', counterpartyName: 'TIDEL Park Coimbatore Ltd', counterpartyAccount: '•••• •••• 4421', counterpartyBank: 'Indian Overseas Bank', channel: 'NEFT' },
    { iso: '2026-07-01T05:30:00.000Z', category: 'SALARY', description: 'July Salary & Executive Retainer Credit', amount: 450000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
    { iso: '2026-06-29T09:10:00.000Z', category: 'TRANSFER', description: 'Technology Advisory & Architecture Retainer', amount: 620000, transactionType: 'CREDIT', counterpartyName: 'Cognizant Technology Solutions India', counterpartyAccount: '•••• •••• 8104', counterpartyBank: 'Standard Chartered Bank', channel: 'NEFT' },
    { iso: '2026-06-19T12:25:00.000Z', category: 'SHOPPING', description: 'Singapore Airlines Executive Lounge & Booking', amount: 64000, transactionType: 'DEBIT', counterpartyName: 'Singapore Airlines Ltd', channel: 'POS' },
    { iso: '2026-06-11T08:50:00.000Z', category: 'SHOPPING', description: 'Apple India Flagship Store Purchase', amount: 124000, transactionType: 'DEBIT', counterpartyName: 'Apple India Pvt Ltd', channel: 'POS' },
    { iso: '2026-06-01T05:15:00.000Z', category: 'SALARY', description: 'June Salary & Executive Retainer Credit', amount: 450000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
    { iso: '2026-05-26T07:00:00.000Z', category: 'TRANSFER', description: 'Term Deposit Interest & Maturity Payout', amount: 480000, transactionType: 'CREDIT', counterpartyName: 'HSBC India Treasury Desk', counterpartyAccount: '•••• •••• 0091', counterpartyBank: 'HSBC India', channel: 'NEFT' },
    { iso: '2026-05-20T06:20:00.000Z', category: 'UTILITIES', description: 'Canara HSBC Life & Tata AIG Health Renewal', amount: 98500, transactionType: 'DEBIT', counterpartyName: 'Canara HSBC Life Insurance Co Ltd', counterpartyAccount: '•••• •••• 6201', counterpartyBank: 'Canara Bank', channel: 'BILL' },
    { iso: '2026-05-10T04:00:00.000Z', category: 'UTILITIES', description: 'Cloud Infrastructure & High-Compute Dedicated Servers', amount: 75000, transactionType: 'DEBIT', counterpartyName: 'Amazon Web Services India Pvt Ltd', counterpartyAccount: '•••• •••• 5590', counterpartyBank: 'HDFC Bank Ltd', channel: 'BILL' },
    { iso: '2026-05-02T05:30:00.000Z', category: 'SALARY', description: 'May Salary & Executive Retainer Credit', amount: 450000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
    { iso: '2026-04-28T10:15:00.000Z', category: 'TRANSFER', description: 'Personal Advisory Fee Settlement', amount: 325000, transactionType: 'CREDIT', counterpartyName: 'Ananya Deshmukh', counterpartyAccount: '•••• •••• 9912', counterpartyBank: 'HDFC Bank Ltd', channel: 'NEFT' },
    { iso: '2026-04-24T09:30:00.000Z', category: 'TRANSFER', description: 'NEFT Family Transfer - Lakshmi Krishna', amount: 75000, transactionType: 'DEBIT', counterpartyName: 'Lakshmi Krishna', counterpartyAccount: '•••• •••• 4018', counterpartyBank: 'State Bank of India', channel: 'NEFT' },
    { iso: '2026-04-12T13:45:00.000Z', category: 'SHOPPING', description: 'Emirates Airlines Coimbatore - London Return Fare', amount: 215000, transactionType: 'DEBIT', counterpartyName: 'Emirates Airline', channel: 'POS' },
    { iso: '2026-04-01T05:20:00.000Z', category: 'SALARY', description: 'April Salary & Executive Retainer Credit', amount: 450000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
    { iso: '2026-03-28T07:10:00.000Z', category: 'TRANSFER', description: 'HSBC Premier Credit Card Bill Settlement', amount: 185000, transactionType: 'DEBIT', counterpartyName: 'HSBC Cards Settlement Desk', counterpartyAccount: '•••• •••• 9821', counterpartyBank: 'HSBC India', channel: 'NEFT' },
    { iso: '2026-03-22T06:00:00.000Z', category: 'TRANSFER', description: 'Enterprise Architecture Consulting Settlement', amount: 380000, transactionType: 'CREDIT', counterpartyName: 'Infosys Limited', counterpartyAccount: '•••• •••• 3318', counterpartyBank: 'ICICI Bank Ltd', channel: 'NEFT' },
    { iso: '2026-03-10T04:00:00.000Z', category: 'UTILITIES', description: 'Coimbatore Tech Zone Enterprise Workspace Lease', amount: 75000, transactionType: 'DEBIT', counterpartyName: 'TIDEL Park Coimbatore Ltd', counterpartyAccount: '•••• •••• 4421', counterpartyBank: 'Indian Overseas Bank', channel: 'NEFT' },
    { iso: '2026-03-01T05:30:00.000Z', category: 'SALARY', description: 'March Salary & Executive Retainer Credit', amount: 450000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
    { iso: '2026-02-22T08:40:00.000Z', category: 'UTILITIES', description: 'TANGEDCO Electricity & Airtel Black Fiber Annual Plan', amount: 42000, transactionType: 'DEBIT', counterpartyName: 'TANGEDCO Coimbatore Central', counterpartyAccount: '•••• •••• 5502', counterpartyBank: 'Canara Bank', channel: 'BILL' },
    { iso: '2026-02-14T15:30:00.000Z', category: 'DINING', description: 'Vivanta Coimbatore - Red Pearl Fine Dining', amount: 52000, transactionType: 'DEBIT', counterpartyName: 'The Indian Hotels Company Ltd', channel: 'POS' },
    { iso: '2026-02-05T06:15:00.000Z', category: 'SALARY', description: 'Annual Executive Performance Bonus Credit', amount: 950000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
    { iso: '2026-01-24T04:00:00.000Z', category: 'UTILITIES', description: 'Enterprise Data Center Colocation & High-Speed Network', amount: 75000, transactionType: 'DEBIT', counterpartyName: 'Tata Communications Ltd', counterpartyAccount: '•••• •••• 9012', counterpartyBank: 'State Bank of India', channel: 'BILL' },
    { iso: '2026-01-15T05:30:00.000Z', category: 'TRANSFER', description: 'Executive Signing & Relocation Credit', amount: 225000, transactionType: 'CREDIT', counterpartyName: 'Alphabet Technologies India Pvt Ltd', counterpartyAccount: '•••• •••• 9920', counterpartyBank: 'Citibank N.A.', channel: 'NEFT' },
  ];

  return entries.map((entry, idx) => {
    const yyyymm = entry.iso.slice(0, 7).replace('-', '');
    const seq = String(idx + 1).padStart(3, '0');
    return {
      transactionId: `tx-1${seq}`,
      ownerUid: 'cust-karthick-8829',
      accountId: 'acc-sb-8829',
      category: entry.category,
      description: entry.description,
      amount: entry.amount,
      currency: 'INR',
      transactionType: entry.transactionType,
      status: 'COMPLETED',
      reference: `TXN/${entry.channel}/${yyyymm}/${41000 + idx}`,
      counterpartyName: entry.counterpartyName,
      counterpartyAccount: entry.counterpartyAccount,
      counterpartyBank: entry.counterpartyBank,
      transactionDate: formatSeedDateTime(entry.iso),
      createdAt: entry.iso,
      updatedAt: entry.iso,
    };
  });
}

export const INITIAL_TRANSACTIONS: TransactionRecord[] = generatePersonalTransactions();

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
    updatedAt: '2026-08-30T10:00:00.000Z',
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
  totalPortfolioValue: 0,
  equityAllocation: 0,
  debtAllocation: 0,
  goldAllocation: 0,
  mutualFunds: [],
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
    message: '₹4,50,000.00 credited to HSBC Premier Savings Account from Alphabet Technologies.',
    type: 'TRANSACTION',
    read: false,
    createdAt: '2026-08-30T10:30:00.000Z',
  },
  {
    notificationId: 'notif-2',
    ownerUid: 'cust-karthick-8829',
    title: 'HSBC Premier Market Intelligence',
    message: 'RBI Monetary Policy review: Fixed Deposit rates revised upwards by 25 bps for HSBC Premier clients.',
    type: 'ANNOUNCEMENT',
    read: false,
    createdAt: '2026-08-24T14:00:00.000Z',
  },
  {
    notificationId: 'notif-3',
    ownerUid: 'cust-karthick-8829',
    title: 'Security Session Authenticated',
    message: '6-digit PIN security authentication verified on registered MacBook Pro and Samsung Galaxy S24 Ultra.',
    type: 'SECURITY',
    read: true,
    createdAt: '2026-08-20T08:15:00.000Z',
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
    previousValue: 3773500,
    newValue: 4223500.00,
    reason: 'August salary retainer credit and quarterly interest capitalization',
    createdAt: '2026-08-30T10:30:00.000Z',
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
