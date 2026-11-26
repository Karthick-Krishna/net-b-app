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

const SOUTH_INDIAN_EMPLOYEES = [
  'Aarav Krishnan', 'Adithya Subramanian', 'Pranav Nair', 'Siddharth Menon', 'Rohan Narayanan',
  'Karthikeyan Sundaram', 'Vikramaditya Rao', 'Nikhil Venkatesh', 'Harish Rajagopal', 'Arjun Krishnamurthy',
  'Arvind Srinivasan', 'Varun Balasubramanian', 'Gautham Nambiar', 'Anirudh Iyengar', 'Shreyas Viswanathan',
  'Tarun Chandrasekhar', 'Keshav Desikan', 'Madhav Gopalakrishnan', 'Darshan Raghuram', 'Nitish Seshadri',
  'Sai Kiran Reddy', 'Yashwanth Gowda', 'Pranith Ramaswamy', 'Rishi Parthasarathy', 'Vivek Natarajan',
  'Abhinav Raghavan', 'Kavin Selvakumar', 'Dinesh Saravanan', 'Vigneshwaran Murugan', 'Ashwin Shankar',
  'Surya Prakash Pillai', 'Harsha Vardhan Naidu', 'Pradeep Venkataraman', 'Tejas Kulkarni', 'Niranjan Hegde',
  'Naveen Thiagarajan', 'Rahul Unnikrishnan', 'Santosh Kurian', 'Deepak Kalyanasundaram', 'Manish Mahalingam',
  'Akash Badrinath', 'Bharath Swaminathan', 'Charan Rajendran', 'Devansh Kamath', 'Eshwar Padmanabhan',
  'Ganesh Rangarajan', 'Hrithik Santhanam', 'Ishaan Varadarajan', 'Jayanth Prabhakar', 'Kaushik Muthukumar',
  'Lokesh Alagappan', 'Manoj Kannan', 'Nandan Sivakumar', 'Omkar Bhat', 'Pavan Nanjundaiah',
  'Raghav Jayaraman', 'Sachin Thangavel', 'Udayashankar Shetty', 'Vamsi Krishna Chowdary', 'Yogeshwar Palanisamy',
  'Akshay Shanmugam', 'Bhargav Deshpande', 'Chirag Madhavan', 'Dhruv Anantharaman', 'Girish Kodandaram',
  'Hemanth Sridharan', 'Jagadishwaran Elango', 'Kishore Soundararajan', 'Mithun Karuppusamy', 'Mukund Balasubramanyam',
  'Neeraj Somasundaram', 'Prahlad Panchapakesan', 'Rajeshwar Vaidyanathan', 'Santhosh Ramalingam', 'Shyam Sundar Rajan',
  'Sudharshan Perumal', 'Tharun Arumugam', 'Vishal Ganesan', 'Sriram Kuppusamy', 'Aravindh Loganathan',
  'Praveen Chockalingam', 'Balaji Thirumalai', 'Rakesh Pandian', 'Nithin Kumaran',
];

const INDIAN_BANKS = [
  'HDFC Bank Ltd',
  'ICICI Bank Ltd',
  'Axis Bank Ltd',
  'Kotak Mahindra Bank',
  'State Bank of India',
  'HSBC India',
];

function generatePersonalTransactions(): TransactionRecord[] {
  // Deterministic PRNG for reproducible 2–11 minute random gaps and tiered 6L–14L salaries
  let rng = 882941;
  const nextRand = () => {
    rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
    return rng;
  };
  const nextGapMinutes = () => 2 + (nextRand() % 10); // Strictly 2 to 11 minutes inclusive

  type RawEntry = {
    iso: string;
    category: TransactionRecord['category'];
    description: string;
    amount: number;
    transactionType: 'CREDIT' | 'DEBIT';
    counterpartyName: string;
    counterpartyAccount?: string;
    counterpartyBank?: string;
    channel: string;
  };

  const entries: RawEntry[] = [];

  // 1. INTERNATIONAL INWARD CREDITS FROM SALESFORCE & MICROSOFT = ₹7,34,00,000 (₹7.34 Cr)
  const intlCredits: Array<RawEntry> = [
    {
      iso: '2026-08-29T05:14:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 82,840 @ ₹84.50) · Salesforce Inc. Global Enterprise Remittance',
      amount: 7000000,
      transactionType: 'CREDIT',
      counterpartyName: 'Salesforce, Inc. (San Francisco, USA)',
      counterpartyAccount: 'US-FED-8841029',
      counterpartyBank: 'Citibank N.A., New York (SWIFT: CITIUS33)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-08-19T06:22:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 76,923 @ ₹84.50) · Microsoft Corp Azure Cloud Settlement',
      amount: 6500000,
      transactionType: 'CREDIT',
      counterpartyName: 'Microsoft Corporation (Redmond, USA)',
      counterpartyAccount: 'US-CHIPS-440219',
      counterpartyBank: 'Bank of America N.A., USA (SWIFT: BOFAUS3N)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-07-24T04:48:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 88,757 @ ₹84.50) · Salesforce Cloud Architecture Delivery',
      amount: 7500000,
      transactionType: 'CREDIT',
      counterpartyName: 'Salesforce, Inc. (San Francisco, USA)',
      counterpartyAccount: 'US-FED-8841029',
      counterpartyBank: 'Citibank N.A., New York (SWIFT: CITIUS33)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-07-08T05:35:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 71,006 @ ₹84.50) · Microsoft Global AI Engineering Wire',
      amount: 6000000,
      transactionType: 'CREDIT',
      counterpartyName: 'Microsoft Corporation (Redmond, USA)',
      counterpartyAccount: 'US-CHIPS-440219',
      counterpartyBank: 'Bank of America N.A., USA (SWIFT: BOFAUS3N)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-06-18T06:10:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 94,675 @ ₹84.50) · Salesforce Enterprise AI Platform Settlement',
      amount: 8000000,
      transactionType: 'CREDIT',
      counterpartyName: 'Salesforce, Inc. (San Francisco, USA)',
      counterpartyAccount: 'US-FED-8841029',
      counterpartyBank: 'Citibank N.A., New York (SWIFT: CITIUS33)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-06-03T04:55:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 74,556 @ ₹84.50) · Microsoft Corp Global Vendor Retainer',
      amount: 6300000,
      transactionType: 'CREDIT',
      counterpartyName: 'Microsoft Corporation (Redmond, USA)',
      counterpartyAccount: 'US-CHIPS-440219',
      counterpartyBank: 'Bank of America N.A., USA (SWIFT: BOFAUS3N)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-05-12T05:18:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 76,923 @ ₹84.50) · Salesforce APAC Engineering Milestone',
      amount: 6500000,
      transactionType: 'CREDIT',
      counterpartyName: 'Salesforce, Inc. (San Francisco, USA)',
      counterpartyAccount: 'US-FED-8841029',
      counterpartyBank: 'Citibank N.A., New York (SWIFT: CITIUS33)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-04-14T06:04:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 76,923 @ ₹84.50) · Microsoft Enterprise Services Remittance',
      amount: 6500000,
      transactionType: 'CREDIT',
      counterpartyName: 'Microsoft Corporation (Redmond, USA)',
      counterpartyAccount: 'US-CHIPS-440219',
      counterpartyBank: 'Bank of America N.A., USA (SWIFT: BOFAUS3N)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-03-25T05:42:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 82,840 @ ₹84.50) · Salesforce Inc. Multi-Region Deployment',
      amount: 7000000,
      transactionType: 'CREDIT',
      counterpartyName: 'Salesforce, Inc. (San Francisco, USA)',
      counterpartyAccount: 'US-FED-8841029',
      counterpartyBank: 'Citibank N.A., New York (SWIFT: CITIUS33)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-02-09T06:15:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 68,639 @ ₹84.50) · Salesforce Inc. Q1 Enterprise Advisory Wire',
      amount: 5800000,
      transactionType: 'CREDIT',
      counterpartyName: 'Salesforce, Inc. (San Francisco, USA)',
      counterpartyAccount: 'US-FED-8841029',
      counterpartyBank: 'Citibank N.A., New York (SWIFT: CITIUS33)',
      channel: 'SWIFT',
    },
    {
      iso: '2026-01-22T05:00:00.000Z',
      category: 'TRANSFER',
      description: 'Intl Wire Credit (USD 74,556 @ ₹84.50) · Microsoft Corp Q1 International Remittance',
      amount: 6300000,
      transactionType: 'CREDIT',
      counterpartyName: 'Microsoft Corporation (Redmond, USA)',
      counterpartyAccount: 'US-CHIPS-440219',
      counterpartyBank: 'Bank of America N.A., USA (SWIFT: BOFAUS3N)',
      channel: 'SWIFT',
    },
  ];
  entries.push(...intlCredits);

  // 2. HARDWARE & LAPTOP SHOPS PURCHASES = ₹24,12,700 (Spaced 2–11 min gaps per shopping run)
  const augShopStart = new Date('2026-08-15T06:30:00.000Z').getTime();
  let shopCursorMs = augShopStart;
  const augHardwareItems = [
    { description: 'Apple India Flagship Store — MacBook Pro 16" M4 Max Workstations (2x)', amount: 698000, counterpartyName: 'Apple India Pvt Ltd', counterpartyBank: 'Citibank N.A.', channel: 'POS' },
    { description: 'Imagine Store Coimbatore — Apple Studio Displays & Thunderbolt Docks', amount: 345000, counterpartyName: 'Ample Technologies Pvt Ltd', counterpartyBank: 'HDFC Bank Ltd', channel: 'POS' },
    { description: 'Dell Exclusive Store Race Course — Precision Mobile Workstations (3x)', amount: 495000, counterpartyName: 'Dell India Pvt Ltd', counterpartyBank: 'ICICI Bank Ltd', channel: 'NEFT' },
    { description: 'Croma Infiniti Tech — Keychron Mechanical Keyboards & MX Master 3S Kits', amount: 114700, counterpartyName: 'Infiniti Retail Ltd (Croma)', counterpartyBank: 'Axis Bank Ltd', channel: 'POS' },
    { description: 'APC Schneider Store — Enterprise Rack UPS & Power Backup Hardware', amount: 145000, counterpartyName: 'Vijay Sales Hardware Hub', counterpartyBank: 'HDFC Bank Ltd', channel: 'POS' },
  ];
  augHardwareItems.forEach((item, idx) => {
    if (idx > 0) shopCursorMs += nextGapMinutes() * 60 * 1000;
    entries.push({
      iso: new Date(shopCursorMs).toISOString(),
      category: 'SHOPPING',
      description: item.description,
      amount: item.amount,
      transactionType: 'DEBIT',
      counterpartyName: item.counterpartyName,
      counterpartyAccount: `•••• •••• ${3100 + idx * 17}`,
      counterpartyBank: item.counterpartyBank,
      channel: item.channel,
    });
  });

  let julShopCursorMs = new Date('2026-07-25T07:10:00.000Z').getTime();
  const julHardwareItems = [
    { description: 'Lenovo Commercial Store — ThinkPad P16 Developer Laptops (2x)', amount: 360000, counterpartyName: 'Lenovo India Commercial Systems', counterpartyBank: 'Standard Chartered Bank', channel: 'NEFT' },
    { description: 'Reliance Digital Pollachi — LG UltraFine 4K Work Displays (6x)', amount: 138000, counterpartyName: 'Reliance Retail Ltd', counterpartyBank: 'HDFC Bank Ltd', channel: 'POS' },
    { description: 'PrimeABGB Tech Hardware — Ubiquiti UniFi Wi-Fi 7 Mesh & 10GbE Switches', amount: 72000, counterpartyName: 'PrimeABGB Computer Hardware', counterpartyBank: 'ICICI Bank Ltd', channel: 'IMPS' },
    { description: 'Samsung Experience Store — 990 Pro 4TB NVMe SSDs & Portable T9 Drives', amount: 45000, counterpartyName: 'Samsung India Electronics Pvt Ltd', counterpartyBank: 'Axis Bank Ltd', channel: 'POS' },
  ];
  julHardwareItems.forEach((item, idx) => {
    if (idx > 0) julShopCursorMs += nextGapMinutes() * 60 * 1000;
    entries.push({
      iso: new Date(julShopCursorMs).toISOString(),
      category: 'SHOPPING',
      description: item.description,
      amount: item.amount,
      transactionType: 'DEBIT',
      counterpartyName: item.counterpartyName,
      counterpartyAccount: `•••• •••• ${5200 + idx * 19}`,
      counterpartyBank: item.counterpartyBank,
      channel: item.channel,
    });
  });

  // 3. AUGUST 02: GOOGLE GEMINI PRO (GOOGLE AI PRO) SUBSCRIPTIONS FOR ALL 84 ACCOUNTS
  // Real Google India price = ₹1,950/account × 84 accounts = ₹1,63,800 (Spaced strictly 2–11 min gaps)
  let geminiCursorMs = new Date('2026-08-02T02:35:00.000Z').getTime(); // Starts 08:05 AM IST on 02 Aug 2026
  SOUTH_INDIAN_EMPLOYEES.forEach((empName, idx) => {
    if (idx > 0) geminiCursorMs += nextGapMinutes() * 60 * 1000;
    const seatNo = String(idx + 1).padStart(2, '0');
    entries.push({
      iso: new Date(geminiCursorMs).toISOString(),
      category: 'UTILITIES',
      description: `Google AI Pro (Gemini Pro) Subscription · Seat #${seatNo} (${empName})`,
      amount: 1950,
      transactionType: 'DEBIT',
      counterpartyName: 'Google Asia Pacific Pte Ltd (Gemini Pro)',
      counterpartyAccount: '•••• •••• 7740',
      counterpartyBank: 'Citibank N.A. India',
      channel: 'BILL',
    });
  });

  // 4. PAYROLL SALARIES TO ALL 84 SOUTH INDIAN MALE EMPLOYEES (₹6,00,000 to ₹14,00,000 each)
  // Target salary sum = ₹6,66,00,000 so Credits (7,34,00,000) - Debits (6,91,76,500) = ₹42,23,500.00
  const TARGET_SALARY_SUM = 66600000;
  const salaries = SOUTH_INDIAN_EMPLOYEES.map((_, idx) => {
    if (idx < 10) {
      return 1100000 + (nextRand() % 61) * 5000;
    }
    if (idx < 34) {
      return 800000 + (nextRand() % 51) * 5000;
    }
    return 600000 + (nextRand() % 37) * 5000;
  });

  let currentSum = salaries.reduce((a, b) => a + b, 0);
  let adjIdx = 0;
  while (currentSum !== TARGET_SALARY_SUM) {
    const diff = TARGET_SALARY_SUM - currentSum;
    const step = diff > 0 ? Math.min(5000, diff) : Math.max(-5000, diff);
    const candidate = salaries[adjIdx] + step;
    if (candidate >= 600000 && candidate <= 1400000) {
      salaries[adjIdx] = candidate;
      currentSum += step;
    }
    adjIdx = (adjIdx + 1) % salaries.length;
  }

  // Payroll disbursement on 30 Aug 2026 starting 09:00 AM IST, spaced strictly 2–11 minutes apart
  let salaryCursorMs = new Date('2026-08-30T03:30:00.000Z').getTime();
  SOUTH_INDIAN_EMPLOYEES.forEach((empName, idx) => {
    if (idx > 0) salaryCursorMs += nextGapMinutes() * 60 * 1000;
    const bank = INDIAN_BANKS[idx % INDIAN_BANKS.length];
    const acctLast4 = String(4100 + ((idx * 37) % 5800)).padStart(4, '0');
    entries.push({
      iso: new Date(salaryCursorMs).toISOString(),
      category: 'SALARY',
      description: `Employee Salary Payout — ${empName} (Emp ID #EMP-${String(idx + 101).padStart(3, '0')})`,
      amount: salaries[idx],
      transactionType: 'DEBIT',
      counterpartyName: empName,
      counterpartyAccount: `•••• •••• ${acctLast4}`,
      counterpartyBank: bank,
      channel: 'NEFT',
    });
  });

  // Sort reverse-chronologically (most recent first)
  entries.sort((a, b) => new Date(b.iso).getTime() - new Date(a.iso).getTime());

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
