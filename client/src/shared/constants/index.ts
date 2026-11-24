export const BANK_CONFIG = {
  appName: 'HSBC India',
  adminAppName: 'HSBC India Operations Console',
  tagline: 'Mobile Banking & Wealth Management',
  disclaimer: 'This is an independently managed digital banking application. All displayed customer records, balances, and transactions are application-managed platform records.',
  defaultCurrency: 'INR',
  currencySymbols: {
    INR: '₹',
    GBP: '£',
    USD: '$',
    EUR: '€',
  },
  colors: {
    primaryRed: '#DB0011',
    deepRed: '#B0000D',
    white: '#FFFFFF',
    mainBg: '#F5F5F5',
    cardBg: '#FFFFFF',
    primaryText: '#252525',
    secondaryText: '#777777',
    border: '#E8E8E8',
    success: '#16864A',
    warning: '#D99B20',
    error: '#D92D20',
  },
  defaultBranch: {
    name: 'Mumbai Main Branch, Fort',
    ifsc: 'HSBC0400002',
    swift: 'HBUKINBB',
    city: 'Mumbai',
    country: 'India',
  },
};

export const TRANSACTION_CATEGORIES = [
  { id: 'TRANSFER', label: 'Transfers & Remittance' },
  { id: 'SALARY', label: 'Salary & Compensation' },
  { id: 'UTILITIES', label: 'Bills & Utilities' },
  { id: 'DINING', label: 'Dining & Food' },
  { id: 'SHOPPING', label: 'Shopping & Retail' },
  { id: 'INVESTMENT', label: 'Investments & Wealth' },
  { id: 'CHARGES', label: 'Bank Charges & Taxes' },
  { id: 'CASH_WITHDRAWAL', label: 'ATM & Cash Withdrawal' },
  { id: 'OTHER', label: 'Other Adjustments' },
] as const;

export const ACCOUNT_TYPES = [
  { id: 'SAVINGS', label: 'HSBC Premier Savings Account' },
  { id: 'CURRENT', label: 'HSBC Business Current Account' },
  { id: 'SALARY', label: 'HSBC Corporate Salary Account' },
  { id: 'FIXED_DEPOSIT', label: 'HSBC High Yield Fixed Deposit' },
  { id: 'RECURRING_DEPOSIT', label: 'HSBC Smart Recurring Deposit' },
  { id: 'FOREIGN_CURRENCY', label: 'Global Currency Pocket' },
] as const;

export const BILL_CATEGORIES = [
  { id: 'ELECTRICITY', name: 'Electricity', icon: 'Zap', billerExample: 'Tata Power / Adani Electricity' },
  { id: 'WATER', name: 'Water', icon: 'Droplets', billerExample: 'Municipal Corporation Water Board' },
  { id: 'GAS', name: 'Piped Gas', icon: 'Flame', billerExample: 'Mahanagar Gas Ltd / IGL' },
  { id: 'MOBILE', name: 'Mobile Postpaid', icon: 'Smartphone', billerExample: 'Airtel / Jio Postpaid' },
  { id: 'BROADBAND', name: 'Broadband & Fiber', icon: 'Wifi', billerExample: 'Airtel Xstream / JioFiber' },
  { id: 'CREDIT_CARD', name: 'Credit Card Bill', icon: 'CreditCard', billerExample: 'HSBC / External Cards' },
  { id: 'INSURANCE', name: 'Insurance Premium', icon: 'Shield', billerExample: 'Canara HSBC Life / HDFC ERGO' },
  { id: 'EDUCATION', name: 'Education Fees', icon: 'GraduationCap', billerExample: 'International Schools / Universities' },
  { id: 'OTHER', name: 'Other Utilities', icon: 'MoreHorizontal', billerExample: 'Municipal Taxes & Services' },
] as const;
