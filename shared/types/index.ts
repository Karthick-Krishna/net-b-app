export type UserRole = 'customer' | 'admin' | 'superadmin';

export interface UserRecord {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  role: UserRole;
  customerId: string;
  accountStatus: 'active' | 'suspended' | 'pending';
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  address?: string;
  city?: string;
  country?: string;
  createdAt: any;
  updatedAt: any;
}

export interface BankAccountRecord {
  accountId: string;
  ownerUid: string;
  customerName?: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'SALARY' | 'FIXED_DEPOSIT' | 'RECURRING_DEPOSIT' | 'FOREIGN_CURRENCY';
  maskedAccountNumber: string;
  accountNumber: string;
  currency: 'INR' | 'GBP' | 'USD' | 'EUR';
  managedBalance: number;
  ledgerBalance: number;
  accountStatus: 'ACTIVE' | 'DORMANT' | 'INOPERATIVE' | 'FROZEN' | 'CLOSED';
  branchName: string;
  ifscCode: string;
  sortCode?: string;
  createdAt: any;
  updatedAt: any;
}

export interface TransactionRecord {
  transactionId: string;
  ownerUid: string;
  accountId: string;
  category: 'TRANSFER' | 'SALARY' | 'UTILITIES' | 'DINING' | 'SHOPPING' | 'INVESTMENT' | 'CHARGES' | 'CASH_WITHDRAWAL' | 'OTHER';
  description: string;
  amount: number;
  currency: string;
  transactionType: 'CREDIT' | 'DEBIT';
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'REVERSED';
  reference: string;
  counterpartyName: string;
  counterpartyAccount?: string;
  counterpartyBank?: string;
  transactionDate: string;
  internalNote?: string;
  isCorrection?: boolean;
  originalTransactionId?: string;
  createdAt: any;
  updatedAt: any;
}

export interface BeneficiaryRecord {
  beneficiaryId: string;
  ownerUid: string;
  displayName: string;
  nickname?: string;
  maskedAccountNumber: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  transferLimit: number;
  status: 'ACTIVE' | 'BLOCKED';
  isFavorite?: boolean;
  createdAt: any;
}

export interface CardRecord {
  cardId: string;
  ownerUid: string;
  accountId: string;
  cardType: 'DEBIT' | 'CREDIT';
  cardTier: 'PREMIER_PLATINUM' | 'PREMIER_WORLD_ELITE' | 'GLOBAL_TRAVEL';
  maskedCardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardStatus: 'ACTIVE' | 'FROZEN' | 'BLOCKED';
  spendingLimit: number;
  currentMonthSpent: number;
  creditLimit?: number;
  availableCredit?: number;
  minDue?: number;
  dueDate?: string;
  rewardPoints?: number;
  onlineEnabled?: boolean;
  internationalEnabled?: boolean;
  contactlessEnabled?: boolean;
  atmEnabled?: boolean;
  posEnabled?: boolean;
  gamblingRestricted?: boolean;
  isActivated?: boolean;
  cardPin?: string;
  createdAt: any;
  updatedAt: any;
}

export interface DepositRecord {
  depositId: string;
  ownerUid: string;
  accountId: string;
  depositType: 'FIXED' | 'RECURRING';
  depositNumber: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  maturityDate: string;
  expectedMaturityAmount: number;
  status: 'ACTIVE' | 'MATURED' | 'CLOSED';
  createdAt: any;
}

export interface RewardRecord {
  rewardId: string;
  ownerUid: string;
  points: number;
  availablePoints: number;
  redemptionHistory: {
    id: string;
    rewardTitle: string;
    pointsRedeemed: number;
    status: 'COMPLETED' | 'PENDING';
    date: string;
  }[];
}

export interface InsuranceRecord {
  policyId: string;
  ownerUid: string;
  policyNumber: string;
  policyType: 'HEALTH' | 'TERM_LIFE' | 'TRAVEL' | 'HOME';
  providerName: string;
  coverageAmount: number;
  annualPremium: number;
  policyStatus: 'ACTIVE' | 'PENDING_RENEWAL' | 'LAPSED';
  dueDate: string;
}

export interface NotificationRecord {
  notificationId: string;
  ownerUid: string;
  title: string;
  message: string;
  type: 'ACCOUNT' | 'TRANSACTION' | 'PAYMENT' | 'CARD' | 'DEPOSIT' | 'ANNOUNCEMENT' | 'SECURITY';
  read: boolean;
  createdAt: any;
}

export interface SupportTicketRecord {
  ticketId: string;
  ownerUid: string;
  customerName?: string;
  subject: string;
  description: string;
  category: 'TRANSACTION_DISPUTE' | 'CARD_LOST' | 'FRAUD' | 'ACCOUNT_INQUIRY' | 'GENERAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  assignedAdmin?: string;
  createdAt: any;
  updatedAt: any;
  messages?: {
    id: string;
    senderUid: string;
    senderRole: 'customer' | 'admin';
    message: string;
    timestamp: any;
  }[];
}

export interface AppLockSecurityRecord {
  ownerUid: string;
  appLockEnabled: boolean;
  pinHash?: string;
  failedAttempts: number;
  lockedUntil?: string | null;
  resetRequestedByAdmin?: boolean;
  updatedAt: any;
}

export interface AuditLogRecord {
  logId: string;
  adminUid: string;
  adminEmail: string;
  action: 'BALANCE_ADJUSTMENT' | 'TRANSACTION_CREATED' | 'TRANSACTION_CORRECTION' | 'CUSTOMER_CREATED' | 'CUSTOMER_STATUS_CHANGED' | 'APP_LOCK_RESET' | 'CARD_STATUS_CHANGED' | 'NOTIFICATION_BROADCAST';
  targetUid: string;
  targetCustomerName?: string;
  targetRecord: string;
  previousValue?: any;
  newValue?: any;
  reason: string;
  createdAt: any;
}

export interface WealthPortfolio {
  ownerUid: string;
  totalPortfolioValue: number;
  equityAllocation: number;
  debtAllocation: number;
  goldAllocation: number;
  mutualFunds: {
    fundName: string;
    category: string;
    investedAmount: number;
    currentValue: number;
    returnPercentage: number;
  }[];
}
