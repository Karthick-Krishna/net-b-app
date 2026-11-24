export const BANK_CONFIG = {
  appName: 'Premier Digital Banking',
  tagline: 'International & India Wealth Management',
  disclaimer: 'This is an independently managed digital banking application. All displayed customer records, balances, and transactions are application-managed platform records, not official bank statements.',
  defaultCurrency: 'INR',
  currencySymbols: {
    INR: '₹',
    GBP: '£',
    USD: '$',
    EUR: '€',
  },
  colors: {
    primaryRed: '#DB0011',
    secondaryRed: '#B0000D',
    white: '#FFFFFF',
    lightBg: '#F4F4F4',
    primaryText: '#222222',
    secondaryText: '#777777',
    border: '#E7E7E7',
    success: '#18864B',
    danger: '#D92D20',
  },
  defaultBranch: {
    name: 'Mumbai Fort Heritage Branch',
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
  { id: 'CHARGES', label: 'Bank Fees & Levies' },
  { id: 'CASH_WITHDRAWAL', label: 'ATM & Cash Withdrawal' },
  { id: 'OTHER', label: 'Other Adjustments' },
] as const;

export const ACCOUNT_TYPES = [
  { id: 'SAVINGS', label: 'Premier Savings Account' },
  { id: 'CURRENT', label: 'Business Current Account' },
  { id: 'SALARY', label: 'Corporate Salary Account' },
  { id: 'FIXED_DEPOSIT', label: 'High Yield Fixed Deposit' },
  { id: 'RECURRING_DEPOSIT', label: 'Smart Recurring Deposit' },
  { id: 'FOREIGN_CURRENCY', label: 'Global Currency Pocket' },
] as const;
